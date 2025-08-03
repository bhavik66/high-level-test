import { ROUTES } from '@/router/types';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingFallback } from '@/components/fallbacks';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Route-level error boundary component
function RouteErrorBoundary() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

// Router Provider Component
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RouteErrorBoundary />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
