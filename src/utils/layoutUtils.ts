import type { LayoutItem } from '@/types';

// ===============================
// LAYOUT UTILITY FUNCTIONS
// ===============================

/**
 * Composes CSS classes from layout item configuration
 * Handles responsive breakpoints and deduplicates classes
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
