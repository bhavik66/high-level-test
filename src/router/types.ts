// Router-related types for type safety

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  errorElement?: React.ReactNode;
  children?: RouteConfig[];
}

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
}

// Route constants for type-safe navigation
export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '*',
} as const;

export type RouteKeys = (typeof ROUTES)[keyof typeof ROUTES];
