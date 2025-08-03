import type { ErrorFallbackProps } from '@/shared/types/layoutTypes';
import { AlertCircle, RotateCcw } from 'lucide-react';

// ===============================
// ERROR FALLBACK COMPONENT
// ===============================
export const ErrorFallback = ({
  error,
  resetError,
  componentName,
}: ErrorFallbackProps) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50 rounded-lg border border-red-200">
    <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      {componentName ? `${componentName} Failed to Load` : 'Component Error'}
    </h3>
    <p className="text-sm text-red-600 mb-1 text-center">
      {error.message || 'Something went wrong while loading this component.'}
    </p>
    <details className="text-xs text-red-500 mb-4 max-w-full">
      <summary className="cursor-pointer hover:text-red-700">
        View Details
      </summary>
      <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-20">
        {error.stack}
      </pre>
    </details>
    <button
      onClick={resetError}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      Try Again
    </button>
  </div>
);
