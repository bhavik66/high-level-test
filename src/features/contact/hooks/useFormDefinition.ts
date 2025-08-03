import { contactService } from '@/features/contact/api/ContactService';
import type { FormDefinition } from '@/types/formTypes';
import { useCallback, useEffect, useRef, useState } from 'react';

// Hook return type
export interface UseFormDefinitionReturn {
  formDefinition: FormDefinition | null;
  loading: boolean;
  error: string | null;
  refetch: (formId?: string) => Promise<void>;
}

/**
 * Custom hook for managing form definitions
 * Handles fetching and caching of form schema definitions
 */
export function useFormDefinition(
  formId: string = 'contactForm'
): UseFormDefinitionReturn {
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track what we've loaded to prevent double calls
  const loadedFormIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  /**
   * Fetch form definition from API - memoized callback for external use
   */
  const fetchFormDefinition = useCallback(
    async (targetFormId: string = formId) => {
      // Prevent double calls
      if (isFetchingRef.current) {
        console.log('Form definition fetch already in progress, skipping...');
        return;
      }

      console.log('Manually fetching form definition for:', targetFormId);
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const definition =
          await contactService.fetchFormDefinition(targetFormId);
        setFormDefinition(definition);
        loadedFormIdRef.current = targetFormId;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to fetch form definition';
        setError(errorMessage);
        console.error('Form definition fetch error:', err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [formId]
  );

  // Load initial data when formId changes
  useEffect(() => {
    // Only fetch if we haven't loaded this formId yet or if there's an error
    if (loadedFormIdRef.current !== formId && !isFetchingRef.current) {
      console.log('FormId changed from', loadedFormIdRef.current, 'to', formId);

      loadedFormIdRef.current = formId;
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      contactService
        .fetchFormDefinition(formId)
        .then(definition => {
          setFormDefinition(definition);
        })
        .catch(err => {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to fetch form definition';
          setError(errorMessage);
          console.error('Form definition fetch error:', err);
        })
        .finally(() => {
          setLoading(false);
          isFetchingRef.current = false;
        });
    }
  }, [formId]); // Only formId dependency

  return {
    formDefinition,
    loading,
    error,
    refetch: fetchFormDefinition,
  };
}
