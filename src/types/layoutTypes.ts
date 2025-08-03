// ===============================
// COMPONENT MAPPING TYPES
// ===============================
export type ComponentKey = 'ContactView' | 'ConversationsView' | 'NotesView';

// ===============================
// RESPONSIVE TYPES
// ===============================
export type ResponsiveBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveMap = Partial<Record<ResponsiveBreakpoint, string>>;

// ===============================
// LAYOUT PRESET TYPES
// ===============================
export type LayoutPreset =
  | 'default'
  | 'sidebar-focus'
  | 'chat-focus'
  | 'notes-focus'
  | 'mobile-first';

// ===============================
// LAYOUT ITEM INTERFACE
// ===============================
export interface LayoutItem {
  id?: string;
  component: ComponentKey;
  className?: string;
  responsive?: ResponsiveMap;
  visible?: boolean;
  order?: number;
  title?: string;
  description?: string;
}

// ===============================
// LAYOUT CONFIG INTERFACE
// ===============================
export interface LayoutConfig {
  items: LayoutItem[];
  preset?: LayoutPreset;
  gap?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
}

// ===============================
// COMPONENT PROPS INTERFACES
// ===============================
export interface ConfigurableGridLayoutProps {
  preset?: LayoutPreset;
  customConfig?: LayoutItem[];
  onError?: (error: Error, componentName?: string) => void;
}
