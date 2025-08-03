import { contactService } from '@/features/contact/api/ContactService';
import type { FormDefinition } from '@/types/formTypes';
import { useQuery } from '@tanstack/react-query';

// Hook return type
export interface UseFormDefinitionReturn {
  formDefinition: FormDefinition | null;
  loading: boolean;
  error: string | null;
  refetch: (formId?: string) => Promise<void>;
}

/**
 * Custom hook for managing form definitions
 * Uses TanStack Query for efficient caching and data fetching
 */
export function useFormDefinition(
  formId: string = 'contactForm'
): UseFormDefinitionReturn {
  const {
    data: formDefinition,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['form-definition', formId],
    queryFn: () => contactService.fetchFormDefinition(formId),
    staleTime: 5 * 60 * 1000, // 5 minutes - form definitions don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Adapt the refetch function to match the original API
  const adaptedRefetch = async (targetFormId?: string) => {
    if (targetFormId && targetFormId !== formId) {
      console.warn(
        'Refetching with a different formId is not supported in the new implementation'
      );
    }
    await refetch();
  };

  return {
    formDefinition: formDefinition || null,
    loading: isLoading,
    error: error
      ? error instanceof Error
        ? error.message
        : 'An error occurred'
      : null,
    refetch: adaptedRefetch,
  };
}
