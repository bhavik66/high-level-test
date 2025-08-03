import { LayoutService } from '@/api/services/layoutService';
import type { LayoutItem } from '@/types/layoutTypes';
import { useQuery } from '@tanstack/react-query';

/**
 * React Query hook for fetching layout configuration
 */
export const useLayout = (name: string) => {
  return useQuery({
    queryKey: ['layout', name],
    queryFn: () => LayoutService.getLayout(name),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes('HTTP 4')) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for getting layout with loading and error states
 */
export const useLayoutData = (
  name: string
): {
  layout: LayoutItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} => {
  const { data: layout, isLoading, error, refetch } = useLayout(name);

  return {
    layout,
    isLoading,
    error,
    refetch,
  };
};

export default useLayout;
