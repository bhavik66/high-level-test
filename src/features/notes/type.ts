// Note data structure
export interface NoteData {
  id: string;
  content: string;
  timestamp: string;
}

// Tag type mapping for notes feature
export type NoteTagType =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

// Tag styling configuration for notes
export const NOTE_TAG_STYLES: Record<NoteTagType, string> = {
  primary: 'text-blue-500 font-medium',
  secondary: 'text-green-500 font-medium',
  accent: 'text-amber-500 font-medium',
  info: 'text-indigo-500 font-medium',
  success: 'text-emerald-500 font-medium',
  warning: 'text-yellow-500 font-medium',
  error: 'text-red-500 font-medium',
} as const;
