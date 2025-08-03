import type { ComponentKey } from '@/shared/types/layoutTypes';
import { lazy } from 'react';

// ===============================
// DYNAMIC COMPONENT MAPPING
// ===============================
export const componentMap = {
  ContactView: lazy(() => import('@/features/contact')),
  ConversationsView: lazy(() => import('@/features/conversations')),
  NotesView: lazy(() => import('@/features/notes')),
} as const;

// ===============================
// COMPONENT UTILITIES
// ===============================
export const getComponentDisplayName = (component: ComponentKey): string => {
  return component.replace('View', '');
};

export const isValidComponent = (
  component: string
): component is ComponentKey => {
  return component in componentMap;
};
