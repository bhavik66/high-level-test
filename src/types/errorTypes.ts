// ===============================
// ERROR BOUNDARY INTERFACES
// ===============================
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: unknown;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (
    error: Error,
    resetError: () => void,
    componentName?: string
  ) => React.ReactNode;
  componentName?: string;
}

export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  componentName?: string;
}

// ===============================
// LOADING COMPONENT INTERFACES
// ===============================
export interface LoadingFallbackProps {
  componentName?: string;
}
