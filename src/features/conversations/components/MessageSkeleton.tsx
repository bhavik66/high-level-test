import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

/**
 * Skeleton component for message loading states
 * Works for both email and WhatsApp message types
 */
const MessageSkeleton: React.FC = () => (
  <Card className="w-full mx-auto shadow-sm p-0 rounded-lg">
    <CardContent className="p-0">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-3 pt-2">
        <Skeleton className="h-5 w-48 bg-gray-200/50" />
        <Skeleton className="h-8 w-8 rounded bg-gray-200/50" />
      </div>

      {/* Thread badge area */}
      <div className="flex justify-center py-2">
        <Skeleton className="h-5 w-5 rounded-full bg-gray-200/50" />
      </div>

      {/* Message content */}
      <div className="p-4">
        {/* Sender info skeleton */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-200/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-200/50" />
              <Skeleton className="h-3 w-32 bg-gray-200/50" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16 bg-gray-200/50" />
            <Skeleton className="h-6 w-6 rounded bg-gray-200/50" />
            <Skeleton className="h-6 w-6 rounded bg-gray-200/50" />
            <Skeleton className="h-6 w-6 rounded bg-gray-200/50" />
          </div>
        </div>

        {/* Message body skeleton */}
        <div className="space-y-4 mb-6">
          <Skeleton className="h-4 w-full bg-gray-200/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-gray-200/50" />
            <Skeleton className="h-4 w-5/6 bg-gray-200/50" />
            <Skeleton className="h-4 w-2/3 bg-gray-200/50" />
          </div>
          <Skeleton className="h-4 w-20 bg-gray-200/50" />
        </div>

        {/* Action button skeleton */}
        <Skeleton className="h-10 w-16 rounded-lg bg-gray-200/50" />
      </div>
    </CardContent>
  </Card>
);

export default MessageSkeleton;
