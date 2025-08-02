import type { LayoutItem } from '@/types/layoutTypes';

// ===============================
// LAYOUT UTILITY FUNCTIONS
// ===============================

/**
 * Composes CSS classes from layout item configuration
 */
export function composeClasses({
  className = '',
  responsive,
}: LayoutItem): string {
  if (!responsive) return className;

  const baseClasses = responsive.base || '';
  const responsiveClasses = Object.entries(responsive)
    .filter(([bp]) => bp !== 'base')
    .map(([bp, cls]) => `${bp}:${cls}`)
    .join(' ');

  const allClasses = `${className} ${baseClasses} ${responsiveClasses}`.trim();
  return [...new Set(allClasses.split(' '))].join(' ');
}

/**
 * Filters and sorts layout items based on visibility and order
 */
export function processLayoutItems(
  items: LayoutItem[],
  hiddenComponents: Set<string>
): LayoutItem[] {
  return items
    .filter(item => item.visible && !hiddenComponents.has(item.component))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Generates unique ID for layout item
 */
export function generateLayoutItemId(
  preset: string,
  index: number,
  component?: string
): string {
  return `${preset}-${component || 'item'}-${index}`;
}

/**
 * Validates if an item has required properties for layout
 */
export function isValidLayoutItem(item: unknown): item is LayoutItem {
  if (!item || typeof item !== 'object') return false;

  const layoutItem = item as Record<string, unknown>;
  return (
    typeof layoutItem.component === 'string' &&
    ['ContactView', 'ConversationsView', 'NotesView'].includes(
      layoutItem.component
    )
  );
}

/**
 * Creates a deep copy of layout items
 */
export function cloneLayoutItems(items: LayoutItem[]): LayoutItem[] {
  return items.map(item => ({
    ...item,
    responsive: item.responsive ? { ...item.responsive } : undefined,
  }));
}

/**
 * Merges layout item configurations
 */
export function mergeLayoutItems(
  base: LayoutItem[],
  overrides: Partial<LayoutItem>[]
): LayoutItem[] {
  return base.map((item, index) => ({
    ...item,
    ...overrides[index],
    responsive: {
      ...item.responsive,
      ...overrides[index]?.responsive,
    },
  }));
}
