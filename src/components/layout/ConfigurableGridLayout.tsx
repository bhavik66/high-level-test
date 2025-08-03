import { Suspense } from 'react';

// Internal imports
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingFallback } from '@/components/fallbacks';

// Types and constants
import type { ComponentKey, LayoutItem } from '@/types/layoutTypes';

// Utilities
import { cn } from '@/lib';
import { composeClasses } from '@/utils';

// ===============================
// TYPES
// ===============================
interface ConfigurableGridLayoutProps {
  onError?: (error: Error, componentName?: string) => void;
  layoutConfig?: LayoutItem[];
  componentRegistry: Record<
    ComponentKey,
    React.LazyExoticComponent<React.ComponentType<unknown>>
  >;
}

// ===============================
// CONFIGURABLE GRID LAYOUT COMPONENT
// ===============================
const ConfigurableGridLayout = ({
  onError,
  layoutConfig,
  componentRegistry,
}: ConfigurableGridLayoutProps) => {
  // ===============================
  // ERROR HANDLER
  // ===============================
  const handleComponentError = (error: Error, componentName?: string) => {
    console.error(`Component ${componentName} error:`, error);
    onError?.(error, componentName);
  };

  // ===============================
  // CONTAINER CLASSES
  // ===============================
  const containerClasses = 'grid grid-cols-12 gap-2 sm:gap-4 h-full';

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="h-full">
      {/* Main Layout Grid */}
      <div className={containerClasses}>
        {layoutConfig?.map((item, idx) => {
          const Component = componentRegistry[item.component];
          const classes = composeClasses(item);
          const componentName = item.title || item.component;

          return (
            <ErrorBoundary
              key={item.id || `${item.component}-${idx}`}
              componentName={componentName}
              fallback={(error, resetError, name) => (
                <div className={cn('h-full w-full', classes)}>
                  <button
                    onClick={() => {
                      resetError();
                      handleComponentError(error, name);
                    }}
                    className="w-full h-full flex items-center justify-center text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Error: {name} - Click to retry
                  </button>
                </div>
              )}
            >
              <div className={`w-full h-full overflow-y-auto ${classes}`}>
                <Suspense
                  fallback={<LoadingFallback componentName={componentName} />}
                >
                  <Component />
                </Suspense>
              </div>
            </ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigurableGridLayout;
