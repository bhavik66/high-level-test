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

  // Flatten all pages into a single array and reverse for chat-like display
  // Newest messages at bottom, oldest at top
  const allMessages = data
    ? data.pages.flatMap(page => page.messages).reverse()
    : [];

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allMessages.length + 1 : allMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Slightly larger estimate for message components
    overscan: 3, // Fewer items to overscan since messages are larger
    initialOffset: () => {
      // Start at bottom for chat-like behavior
      const element = parentRef.current;
      if (element) {
        return element.scrollHeight - element.clientHeight;
      }
      return 0;
    },
  });

  const items = virtualizer.getVirtualItems();
  const fetchTriggeredRef = useRef(false);

  // Track scroll position for maintaining position after loading older messages
  const previousScrollHeightRef = useRef(0);
  const shouldMaintainPositionRef = useRef(false);

  // Stable fetch function for loading older messages when scrolling up
  const handleFetch = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || fetchTriggeredRef.current) {
      return;
    }

    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    // Check if we're near the top (loading older messages)
    const threshold = 200; // pixels from top
    const shouldFetch = scrollElement.scrollTop <= threshold;

    if (shouldFetch && items.length > 0) {
      // Store current scroll height to maintain position
      previousScrollHeightRef.current = scrollElement.scrollHeight;
      shouldMaintainPositionRef.current = true;
      fetchTriggeredRef.current = true;
      fetchNextPage().finally(() => {
        // Reset flag after fetch completes
        setTimeout(() => {
          fetchTriggeredRef.current = false;
        }, 1000);
      });
    }
  }, [hasNextPage, isFetchingNextPage, items.length, fetchNextPage]);

  // Effect to maintain scroll position after loading older messages
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (shouldMaintainPositionRef.current && scrollElement) {
      const newScrollHeight = scrollElement.scrollHeight;
      const heightDifference =
        newScrollHeight - previousScrollHeightRef.current;

      if (heightDifference > 0) {
        scrollElement.scrollTop = scrollElement.scrollTop + heightDifference;
      }

      shouldMaintainPositionRef.current = false;
    }
  }, [allMessages.length]);

  // Scroll-based fetch trigger
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      handleFetch();
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [handleFetch]);

  // Initial scroll to bottom when first loading
  useEffect(() => {
    if (status === 'success' && allMessages.length > 0) {
      const scrollElement = parentRef.current;
      if (scrollElement && (!data?.pages?.length || data.pages.length === 1)) {
        // Only auto-scroll on initial load, not on subsequent page loads
        setTimeout(() => {
          scrollElement.scrollTop =
            scrollElement.scrollHeight - scrollElement.clientHeight;
        }, 50);
      }
    }
  }, [status, allMessages.length, data?.pages?.length]);

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
              // For chat-like behavior, loader should be at the top (index 0)
              const isLoaderRow = virtualItem.index === 0 && hasNextPage;
              const messageIndex = hasNextPage
                ? virtualItem.index - 1
                : virtualItem.index;
              const message = allMessages[messageIndex];

              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="mb-6"
                >
                  {isLoaderRow ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="text-muted-foreground text-sm">
                        {isFetchingNextPage
                          ? 'Loading older messages...'
                          : 'Scroll up to load older messages'}
                      </div>
                    </div>
                  ) : message ? (
                    <MessageRenderer message={message} />
                  ) : null}
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
