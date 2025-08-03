import { ErrorFallback } from '@/components/error-boundary';
import { LoadingFallback } from '@/components/fallbacks';
import { ConfigurableGridLayout } from '@/components/layout';
import { componentRegistry } from '@/config';
import { useLayoutData } from '@/hooks/useLayout';

export default function HomePage() {
  const { layout, isLoading, error, refetch } = useLayoutData('main');

  const handleError = (error: Error, componentName?: string) => {
    console.error('Layout error:', error, componentName);
  };

  if (isLoading) {
    return (
      <div className="p-2 sm:p-4 h-screen bg-gray-200">
        <LoadingFallback />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 h-screen bg-gray-200">
        <ErrorFallback error={error} resetError={refetch} />
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="p-2 sm:p-4 h-screen bg-gray-200">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No layout configuration available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 h-screen bg-gray-200">
      <ConfigurableGridLayout
        onError={handleError}
        layoutConfig={layout}
        componentRegistry={componentRegistry}
      />
    </div>
  );
}
