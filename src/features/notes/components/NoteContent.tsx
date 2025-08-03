import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useRef } from 'react';
import { notesService } from '../api/NotesService';
import Note from './Note';
import NoteSkeleton from './NoteSkeleton';

interface NoteContentProps {
  className?: string;
}

const NoteContent: React.FC<NoteContentProps> = ({ className }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: ({ pageParam }) => {
      return notesService.fetchNotesPage({
        limit: 20,
        offset: pageParam,
      });
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten all pages into a single array
  const allNotes = data ? data.pages.flatMap(page => page.notes) : [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allNotes.length + 1 : allNotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();
  const fetchTriggeredRef = useRef(false);

  // Stable fetch function to prevent vibration
  const handleFetch = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || fetchTriggeredRef.current) {
      return;
    }

    const [lastItem] = [...items].reverse();
    if (!lastItem) {
      return;
    }

    const threshold = 3;
    const shouldFetch = lastItem.index >= allNotes.length - threshold;

    if (shouldFetch) {
      fetchTriggeredRef.current = true;
      fetchNextPage().finally(() => {
        // Reset flag after fetch completes
        setTimeout(() => {
          fetchTriggeredRef.current = false;
        }, 1000);
      });
    }
  }, [hasNextPage, isFetchingNextPage, items, allNotes.length, fetchNextPage]);

  // Debounced effect to prevent rapid triggers
  useEffect(() => {
    const timeoutId = setTimeout(handleFetch, 100);
    return () => clearTimeout(timeoutId);
  }, [handleFetch]);

  if (status === 'pending') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground">Loading notes...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-destructive">
          Error loading notes: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className || ''}`}>
      <div ref={parentRef} className="h-full w-full overflow-y-auto">
        <div
          style={{ height: `${virtualizer.getTotalSize()}px` }}
          className="relative w-full"
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map(virtualItem => {
              const isLoaderRow = virtualItem.index > allNotes.length - 1;
              const note = allNotes[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="mb-3"
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <NoteSkeleton />
                    ) : (
                      <div className="flex h-32 items-center justify-center">
                        <div className="text-muted-foreground">
                          No more notes to load
                        </div>
                      </div>
                    )
                  ) : (
                    <Note content={note.content} timestamp={note.timestamp} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background loading indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="absolute bottom-4 right-4 rounded-md bg-background/80 px-3 py-2 text-sm text-muted-foreground shadow-md backdrop-blur-sm">
          Updating notes...
        </div>
      )}
    </div>
  );
};

export default NoteContent;
