import type { ContactData } from '@/features/contact/api/ContactService';
import { contactService } from '@/features/contact/api/ContactService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Hook return type
export interface UseContactDataReturn {
  // Contact data state
  contactData: ContactData | null;
  loading: boolean;
  error: string | null;

  // Form values state
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;

  // Actions
  refetch: (contactId?: string) => Promise<void>;
  saveFormValues: (values: Record<string, unknown>) => void;

  // Loading states
  isSaving: boolean;
}

/**
 * Custom hook for managing contact data and form values
 * Uses TanStack Query for efficient caching and data fetching
 */
export function useContactData(contactId: string = '1'): UseContactDataReturn {
  // Contact data query
  const {
    data: contactData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => contactService.fetchContactData(contactId),
    staleTime: 30 * 1000, // 30 seconds - contact data might change more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Form values state (current form input values)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (contactData) {
      setFormValues(contactData as unknown as Record<string, unknown>);
    }
  }, [contactData]);

  // Adapt the refetch function to match the original API
  const adaptedRefetch = async (targetContactId?: string) => {
    if (targetContactId && targetContactId !== contactId) {
      console.warn(
        'Refetching with a different contactId is not supported in the new implementation'
      );
    }
    await refetch();
  };

  // Save form values function - just logs the values
  const saveFormValues = (values: Record<string, unknown>) => {
    console.log('Form values to be saved:', values);
  };

  return {
    // Contact data state
    contactData: contactData || null,
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : 'An error occurred'
      : null,

    // Form values state
    formValues,
    setFormValues,

    // Actions
    refetch: adaptedRefetch,
    saveFormValues,

    // Loading states
    isSaving: false, // Always false since we're not saving
  };
}
