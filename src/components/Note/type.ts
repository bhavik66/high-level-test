// Tag type mapping for better type safety
export type TagType =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

// Tag styling configuration
export const TAG_STYLES: Record<TagType, string> = {
  primary: 'text-primary font-medium',
  secondary: 'text-secondary font-medium',
  accent: 'text-accent font-medium',
  info: 'text-info font-medium',
  success: 'text-success font-medium',
  warning: 'text-warning font-medium',
  error: 'text-error font-medium',
} as const;
