import { Suspense, useMemo } from 'react';

// Internal imports
import {
  ErrorBoundary,
  LoadingFallback,
} from '@/shared/components/error-boundary';
import Layout from './Layout';

// JSON Config
import layoutConfig from '@/assets/data/mainLayout.json';

// Types and constants
import { componentMap } from '@/shared/constants/componentMap';
import type { LayoutItem } from '@/shared/types/layoutTypes';

// Utilities
import { composeClasses, isValidLayoutItem } from '@/shared/utils/layoutUtils';

// ===============================
// MAIN DYNAMIC LAYOUT COMPONENT
// ===============================
const DynamicMainLayout = ({
  customConfig,
  onError,
}: {
  customConfig?: LayoutItem[];
  onError?: (error: Error, componentName?: string) => void;
} = {}) => {
  // ===============================
  // MEMOIZED CONFIGURATION
  // ===============================
  const layoutItems = useMemo(() => {
    let items: LayoutItem[];

    if (customConfig) {
      items = customConfig;
    } else {
      // Use mainLayout.json
      const parsedConfig = (
        Array.isArray(layoutConfig)
          ? layoutConfig.filter(isValidLayoutItem)
          : []
      ) as LayoutItem[];

      items = parsedConfig.map((item, idx) => ({
        ...item,
        id: `layout-${idx}`,
        visible: item.visible !== false,
      }));
    }

    return items.filter(item => item.visible !== false);
  }, [customConfig]);

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
        {layoutItems.map((item, idx) => {
          const Component = componentMap[item.component];
          const classes = composeClasses(item);
          const componentName = item.title || item.component;

          return (
            <ErrorBoundary
              key={item.id || `${item.component}-${idx}`}
              componentName={componentName}
              fallback={(error, resetError, name) => (
                <div className="h-full">
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
              <Layout className={classes}>
                <Suspense
                  fallback={<LoadingFallback componentName={componentName} />}
                >
                  <Component />
                </Suspense>
              </Layout>
            </ErrorBoundary>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicMainLayout;
