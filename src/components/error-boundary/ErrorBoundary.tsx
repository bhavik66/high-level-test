import type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@/types/errorTypes';
import { Component } from 'react';
import { ErrorFallback } from './ErrorFallback';

// ===============================
// ERROR BOUNDARY COMPONENT
// ===============================
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error(
      'Component Error Boundary caught an error:',
      error,
      errorInfo
    );
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error!,
          this.resetError,
          this.props.componentName
        );
      }
      return (
        <ErrorFallback
          error={this.state.error!}
          resetError={this.resetError}
          componentName={this.props.componentName}
        />
      );
    }

    return this.props.children;
  }
}
