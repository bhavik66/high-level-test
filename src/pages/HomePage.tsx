import { ConfigurableGridLayout } from '@/components/layout';

import layoutConfig from '@/assets/data/mainLayout.json';
import type { LayoutItem } from '@/types/layoutTypes';

import { componentRegistry } from '@/config';

export default function HomePage() {
  const handleError = (error: Error, componentName?: string) => {
    console.error('Layout error:', error, componentName);
  };

  return (
    <div className="p-2 sm:p-4 h-screen bg-gray-200">
      <ConfigurableGridLayout
        onError={handleError}
        layoutConfig={layoutConfig as LayoutItem[]}
        componentRegistry={componentRegistry}
      />
    </div>
  );
}
