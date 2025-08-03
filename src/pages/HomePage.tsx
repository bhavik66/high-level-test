import { Button } from '@/components';
import { ErrorFallback } from '@/components/error-boundary';
import { LoadingFallback } from '@/components/fallbacks';
import { ConfigurableGridLayout } from '@/components/layout';
import { componentRegistry } from '@/config';
import { useLayoutData } from '@/hooks/useLayout';
import { useState } from 'react';

export default function HomePage() {
  const [layoutName, setLayoutName] = useState('main');
  const { layout, isLoading, error, refetch } = useLayoutData(layoutName);

  const handleError = (error: Error, componentName?: string) => {
    console.error('Layout error:', error, componentName);
  };

  const handleChangeLayout = () => {
    setLayoutName(layoutName === 'main' ? 'secondary' : 'main');
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
      <div className="absolute bottom-8 right-8">
        <Button
          variant={'outline'}
          className="shadow-md"
          onClick={handleChangeLayout}
        >
          Switch to {layoutName === 'main' ? 'Secondary' : 'Main'} Layout
        </Button>
      </div>
    </div>
  );
}
