import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useRef } from 'react';
import { conversationService } from '../api/ConversationService';
import type { Message } from '../types';
import EmailMessage from './EmailMessage';
import WhatsAppMessage from './WhatsAppMessage';

interface ConversationContentProps {
  className?: string;
  conversationId?: string;
}

const MessageRenderer = ({ message }: { message: Message }) => {
  switch (message.type) {
    case 'email':
      return <EmailMessage message={message} />;
    case 'whatsapp':
      return <WhatsAppMessage message={message} />;
    default:
      return null;
  }
};

const ConversationContent: React.FC<ConversationContentProps> = ({
  className,
  conversationId = 'conv_001',
}) => {
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
    queryKey: ['conversation-messages', conversationId],
    queryFn: ({ pageParam }) => {
      return conversationService.fetchMessagesPage({
        conversationId,
        limit: 15, // Slightly smaller limit for messages since they can be larger
        offset: pageParam,
      });
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (messages change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Flatten all pages into a single array
  const allMessages = data ? data.pages.flatMap(page => page.messages) : [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allMessages.length + 1 : allMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Slightly larger estimate for message components
    overscan: 3, // Fewer items to overscan since messages are larger
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

    const threshold = 2; // Smaller threshold for conversations
    const shouldFetch = lastItem.index >= allMessages.length - threshold;

    if (shouldFetch) {
      fetchTriggeredRef.current = true;
      fetchNextPage().finally(() => {
        // Reset flag after fetch completes
        setTimeout(() => {
          fetchTriggeredRef.current = false;
        }, 1000);
      });
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    items,
    allMessages.length,
    fetchNextPage,
  ]);

  // Debounced effect to prevent rapid triggers
  useEffect(() => {
    const timeoutId = setTimeout(handleFetch, 100);
    return () => clearTimeout(timeoutId);
  }, [handleFetch]);

  if (status === 'pending') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-destructive">
          Error loading conversation: {error?.message || 'Unknown error'}
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
              const isLoaderRow = virtualItem.index > allMessages.length - 1;
              const message = allMessages[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="mb-6"
                >
                  {isLoaderRow ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-muted-foreground">
                        {hasNextPage
                          ? 'Loading more messages...'
                          : 'No more messages to load'}
                      </div>
                    </div>
                  ) : (
                    <MessageRenderer message={message} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background loading indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="absolute bottom-4 right-4">
          <div className="text-muted-foreground text-sm">Refreshing...</div>
        </div>
      )}
    </div>
  );
};

export default ConversationContent;
