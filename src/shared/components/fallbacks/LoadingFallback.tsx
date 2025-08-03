import type { LoadingFallbackProps } from '@/shared/types/errorTypes';
import { Loader2 } from 'lucide-react';

// ===============================
// LOADING FALLBACK COMPONENT
// ===============================
export const LoadingFallback = ({ componentName }: LoadingFallbackProps) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-lg border border-gray-200">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
    <h3 className="text-sm font-medium text-gray-700 mb-1">
      Loading {componentName || 'Component'}
    </h3>
    <p className="text-xs text-gray-500">Please wait...</p>
  </div>
);
