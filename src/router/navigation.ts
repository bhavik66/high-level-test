import { useLocation, useNavigate, useParams } from 'react-router';
import { ROUTES, type RouteKeys } from './types';

// Custom navigation hook with type safety
export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const navigateTo = (
    path: RouteKeys | string,
    options?: { replace?: boolean; state?: any }
  ) => {
    navigate(path, options);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  const getCurrentPath = () => location.pathname;

  const isCurrentPath = (path: string) => location.pathname === path;

  return {
    navigateTo,
    goBack,
    goForward,
    getCurrentPath,
    isCurrentPath,
    location,
    params,
    ROUTES,
  };
}

// Utility functions for route operations
export const routeUtils = {
  buildPath: (template: string, params: Record<string, string>) => {
    return Object.entries(params).reduce(
      (path, [key, value]) => path.replace(`:${key}`, value),
      template
    );
  },

  isValidRoute: (path: string): path is RouteKeys => {
    return Object.values(ROUTES).includes(path as RouteKeys);
  },
};
