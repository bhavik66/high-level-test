import { Skeleton } from '@/components/ui/skeleton';
import type { LoadingFallbackProps } from '@/types/errorTypes';

// ===============================
// LOADING FALLBACK COMPONENT
// ===============================
export const LoadingFallback = ({ componentName }: LoadingFallbackProps) => (
  <div className="flex flex-col space-y-3 p-6 w-full">
    {componentName && (
      <div className="text-xs text-muted-foreground mb-2">
        Loading {componentName}...
      </div>
    )}
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="flex items-center space-x-2">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);
