import type { ComponentKey } from '@/types/layoutTypes';
import { lazy } from 'react';

// ===============================
// DYNAMIC COMPONENT MAPPING
// ===============================
export const componentMap = {
  ContactView: lazy(() => import('@/features/contact/components/ContactView')),
  ConversationsView: lazy(
    () => import('@/features/conversations/components/ConversationsView')
  ),
  NotesView: lazy(() => import('@/features/notes/components/NotesView')),
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
