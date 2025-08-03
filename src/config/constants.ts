// Application-wide constants
export const APP_CONFIG = {
  name: 'Dynamic Layout App',
  version: '1.0.0',
  defaultTheme: 'light',
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
} as const;
