import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

/**
 * Skeleton component that matches the Note structure
 * Used to provide loading state for notes while fetching more content
 */
const NoteSkeleton: React.FC = () => (
  <Card className="shadow-none rounded border-0 bg-gray-50 py-0">
    <CardContent className="p-4">
      <div className="flex flex-col gap-2">
        {/* Content skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-gray-200/50" />
          <Skeleton className="h-4 w-3/4 bg-gray-200/50" />
          <Skeleton className="h-4 w-5/6 bg-gray-200/50" />
        </div>

        {/* Timestamp skeleton */}
        <Skeleton className="h-3 w-20 bg-gray-200/50" />
      </div>
    </CardContent>
  </Card>
);

export default NoteSkeleton;
