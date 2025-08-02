import { Suspense, useMemo } from 'react';

// Internal imports
import { ErrorBoundary, LoadingFallback } from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';

// Types and constants
import { componentMap } from '@/constants/componentMap';
import {
  LAYOUT_PRESETS,
  getPresetContainerClasses,
  getPresetGapClasses,
} from '@/constants/layoutPresets';
import type { DynamicMainLayoutProps, LayoutItem } from '@/types/layoutTypes';

// Utilities
import { composeClasses } from '@/utils/layoutUtils';

// ===============================
// MAIN DYNAMIC LAYOUT COMPONENT
// ===============================
const DynamicMainLayout = ({
  preset = 'default',
  customConfig,
  onError,
}: DynamicMainLayoutProps) => {
  // ===============================
  // MEMOIZED CONFIGURATION
  // ===============================
  const layoutItems = useMemo(() => {
    let items: LayoutItem[];

    if (customConfig) {
      items = customConfig;
    } else if (preset !== 'default') {
      items = LAYOUT_PRESETS[preset].map((presetItem, idx) => ({
        ...presetItem,
        id: `${preset}-${idx}`,
      }));
    } else {
      // Use the default preset
      items = LAYOUT_PRESETS.default.map((presetItem, idx) => ({
        ...presetItem,
        id: `default-${idx}`,
      }));
    }

    return items.filter(item => item.visible !== false);
  }, [preset, customConfig]);

  // ===============================
  // ERROR HANDLER
  // ===============================
  const handleComponentError = (error: Error, componentName?: string) => {
    console.error(`Component ${componentName} error:`, error);
    onError?.(error, componentName);
  };

  // ===============================
  // DYNAMIC STYLING
  // ===============================
  const gapClasses = useMemo(() => getPresetGapClasses(preset), [preset]);
  const containerClasses = useMemo(
    () => getPresetContainerClasses(preset, gapClasses),
    [preset, gapClasses]
  );

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
