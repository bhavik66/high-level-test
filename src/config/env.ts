// Environment configuration
export const env = {
  NODE_ENV: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  // Add other environment variables here as needed
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
