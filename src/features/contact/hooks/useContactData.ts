import type { ContactData } from '@/features/contact/api/ContactService';
import { contactService } from '@/features/contact/api/ContactService';
import { useCallback, useEffect, useRef, useState } from 'react';

// Hook return type
export interface UseContactDataReturn {
  // Contact data state
  contactData: ContactData | null;
  loading: boolean;
  error: string | null;

  // Form values state (derived from contact data)
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;

  // Actions
  refetch: (contactId?: string) => Promise<void>;
  updateContact: (
    contactId: string,
    values: Record<string, unknown>
  ) => Promise<void>;
  saveFormValues: (values: Record<string, unknown>) => Promise<void>;

  // Loading states
  isSaving: boolean;
}

/**
 * Custom hook for managing contact data and form values
 * Handles CRUD operations for contact information
 */
export function useContactData(contactId: string = '1'): UseContactDataReturn {
  // Contact data state
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form values state (current form input values)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Track what we've loaded to prevent double calls
  const loadedContactIdRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  /**
   * Fetch contact data from API - memoized callback for external use
   */
  const fetchContactData = useCallback(
    async (targetContactId: string = contactId) => {
      // Prevent double calls
      if (isFetchingRef.current) {
        console.log('Contact data fetch already in progress, skipping...');
        return;
      }

      console.log('Manually fetching contact data for:', targetContactId);
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const contact = await contactService.fetchContactData(targetContactId);
        setContactData(contact);
        loadedContactIdRef.current = targetContactId;

        // Set form values to contact data (excluding metadata)
        const { id, created_at, updated_at, ...contactFormData } = contact;
        setFormValues(contactFormData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch contact data';
        setError(errorMessage);
        console.error('Contact data fetch error:', err);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [contactId]
  );

  /**
   * Update specific contact with form values
   */
  const updateContact = useCallback(
    async (targetContactId: string, values: Record<string, unknown>) => {
      setIsSaving(true);
      setError(null);

      try {
        const updatedContact = await contactService.updateContactData(
          targetContactId,
          values
        );
        setContactData(updatedContact);
        loadedContactIdRef.current = updatedContact.id;

        // Update form values with the latest data
        const { id, created_at, updated_at, ...contactFormData } =
          updatedContact;
        setFormValues(contactFormData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update contact';
        setError(errorMessage);
        console.error('Contact update error:', err);
        throw err; // Re-throw to allow caller to handle
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Save current form values (update existing contact)
   */
  const saveFormValues = useCallback(
    async (values: Record<string, unknown>) => {
      if (!contactData) {
        throw new Error('No contact data loaded');
      }

      await updateContact(contactData.id, values);
    },
    [contactData, updateContact]
  );

  // Load initial data when contactId changes
  useEffect(() => {
    // Only fetch if we haven't loaded this contactId yet or if there's an error
    if (loadedContactIdRef.current !== contactId && !isFetchingRef.current) {
      console.log(
        'ContactId changed from',
        loadedContactIdRef.current,
        'to',
        contactId
      );

      loadedContactIdRef.current = contactId;
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      contactService
        .fetchContactData(contactId)
        .then(contact => {
          setContactData(contact);

          // Set form values to contact data (excluding metadata)
          const { id, created_at, updated_at, ...contactFormData } = contact;
          setFormValues(contactFormData);
        })
        .catch(err => {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to fetch contact data';
          setError(errorMessage);
          console.error('Contact data fetch error:', err);
        })
        .finally(() => {
          setLoading(false);
          isFetchingRef.current = false;
        });
    }
  }, [contactId]); // Only contactId dependency

  return {
    // Contact data state
    contactData,
    loading,
    error,

    // Form values state
    formValues,
    setFormValues,

    // Actions
    refetch: fetchContactData,
    updateContact,
    saveFormValues,

    // Loading states
    isSaving,
  };
}
