import type { LayoutItem, LayoutPreset } from '@/types/layoutTypes';

// ===============================
// LAYOUT PRESETS CONFIGURATION
// ===============================
export const LAYOUT_PRESETS: Record<LayoutPreset, LayoutItem[]> = {
  default: [
    {
      component: 'ContactView',
      title: 'Contact Details',
      className: 'h-full',
      visible: true,
      order: 0,
      responsive: {
        base: 'col-span-12 mb-4',
        md: 'col-span-4 mb-0',
        lg: 'col-span-3',
      },
    },
    {
      component: 'ConversationsView',
      title: 'Conversations',
      className: 'h-full',
      visible: true,
      order: 1,
      responsive: {
        base: 'col-span-12 mb-4',
        md: 'col-span-4 mb-0',
        lg: 'col-span-6',
      },
    },
    {
      component: 'NotesView',
      title: 'Notes',
      className: 'h-full',
      visible: true,
      order: 2,
      responsive: {
        base: 'col-span-12 mb-4',
        md: 'col-span-4 mb-0',
        lg: 'col-span-3',
      },
    },
  ],

  'sidebar-focus': [
    {
      component: 'ContactView',
      title: 'Contact Details',
      className: 'h-full',
      visible: true,
      order: 0,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-4' },
    },
    {
      component: 'ConversationsView',
      title: 'Conversations',
      className: 'h-full',
      visible: true,
      order: 1,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-5' },
    },
    {
      component: 'NotesView',
      title: 'Notes',
      className: 'h-full',
      visible: true,
      order: 2,
      responsive: { base: 'col-span-12', lg: 'col-span-3' },
    },
  ],

  'chat-focus': [
    {
      component: 'ContactView',
      title: 'Contact Details',
      className: 'h-full',
      visible: true,
      order: 0,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-2' },
    },
    {
      component: 'ConversationsView',
      title: 'Conversations',
      className: 'h-full',
      visible: true,
      order: 1,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-8' },
    },
    {
      component: 'NotesView',
      title: 'Notes',
      className: 'h-full',
      visible: true,
      order: 2,
      responsive: { base: 'col-span-12', lg: 'col-span-2' },
    },
  ],

  'notes-focus': [
    {
      component: 'ContactView',
      title: 'Contact Details',
      className: 'h-full',
      visible: true,
      order: 0,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-3' },
    },
    {
      component: 'ConversationsView',
      title: 'Conversations',
      className: 'h-full',
      visible: true,
      order: 1,
      responsive: { base: 'col-span-12 mb-4', lg: 'col-span-4' },
    },
    {
      component: 'NotesView',
      title: 'Notes',
      className: 'h-full',
      visible: true,
      order: 2,
      responsive: { base: 'col-span-12', lg: 'col-span-5' },
    },
  ],

  'mobile-first': [
    {
      component: 'ConversationsView',
      title: 'Conversations',
      className: 'h-full',
      visible: true,
      order: 0,
      responsive: {
        base: 'col-span-12 mb-4',
        md: 'col-span-6',
        lg: 'col-span-8',
      },
    },
    {
      component: 'ContactView',
      title: 'Contact Details',
      className: 'h-full',
      visible: true,
      order: 1,
      responsive: {
        base: 'col-span-12 mb-4',
        md: 'col-span-6',
        lg: 'col-span-2',
      },
    },
    {
      component: 'NotesView',
      title: 'Notes',
      className: 'h-full',
      visible: true,
      order: 2,
      responsive: { base: 'col-span-12', lg: 'col-span-2' },
    },
  ],
};

// ===============================
// PRESET UTILITIES
// ===============================
export const getPresetDisplayName = (preset: LayoutPreset): string => {
  return preset.charAt(0).toUpperCase() + preset.slice(1).replace('-', ' ');
};

export const getPresetGapClasses = (preset: LayoutPreset): string => {
  switch (preset) {
    case 'chat-focus':
      return 'gap-1 sm:gap-2';
    case 'mobile-first':
      return 'gap-3 sm:gap-4';
    case 'notes-focus':
      return 'gap-2 sm:gap-3';
    default:
      return 'gap-2 sm:gap-4';
  }
};

export const getPresetContainerClasses = (
  preset: LayoutPreset,
  gapClasses: string
): string => {
  const baseClasses = `grid grid-cols-12 ${gapClasses} h-full transition-all duration-300`;

  switch (preset) {
    case 'chat-focus':
      return `${baseClasses} bg-gradient-to-br from-blue-50 to-indigo-50`;
    case 'notes-focus':
      return `${baseClasses} bg-gradient-to-br from-yellow-50 to-orange-50`;
    case 'sidebar-focus':
      return `${baseClasses} bg-gradient-to-br from-green-50 to-emerald-50`;
    default:
      return baseClasses;
  }
};
