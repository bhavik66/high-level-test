import { ApiClient } from '@/api/clients';
import { env } from '@/config/env';
import type { FormDefinition } from '@/types/formTypes';

// Contact API response types
export interface ContactData {
  id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  dob?: string;
  gender?: string;
  marital_status?: string;
  spouse_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  zip?: string;
  created_at: string;
  updated_at: string;
}

export interface FormDefinitionResponse {
  formDefinition: FormDefinition;
  timestamp: string;
}

export interface ContactResponse {
  contact: ContactData;
  timestamp: string;
}

export interface ContactUpdateResponse {
  contact: ContactData;
  message: string;
  timestamp: string;
}

export interface ContactsListResponse {
  contacts: ContactData[];
  total: number;
  timestamp: string;
}

export interface ContactDeleteResponse {
  message: string;
  contact: ContactData;
  timestamp: string;
}

/**
 * Production-level Contact Service
 * Handles all contact and form-related API operations using the common API client
 */
export class ContactService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient({
      baseURL: env.API_BASE_URL,
      timeout: 15000, // 15 seconds for form operations
      retries: 2, // Fewer retries for user-facing operations
      retryDelay: 500, // Faster retry for better UX
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch form definition by ID
   * @param formId - Form identifier (defaults to 'contactForm')
   * @returns Promise with form definition data
   */
  async fetchFormDefinition(
    formId: string = 'contactForm'
  ): Promise<FormDefinition> {
    try {
      const response = await this.apiClient.get<FormDefinitionResponse>(
        `/forms/definition/${formId}`
      );

      return response.formDefinition;
    } catch (error) {
      // Log error for monitoring (in production, use proper logging service)
      console.error('Failed to fetch form definition:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to load form definition. Please try again.');
    }
  }

  /**
   * Fetch contact data by ID
   * @param contactId - Contact identifier (defaults to '1')
   * @returns Promise with contact data
   */
  async fetchContactData(contactId: string = '1'): Promise<ContactData> {
    try {
      const response = await this.apiClient.get<ContactResponse>(
        `/forms/contact/${contactId}`
      );

      return response.contact;
    } catch (error) {
      // Log error for monitoring
      console.error('Failed to fetch contact data:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to load contact data. Please try again.');
    }
  }

  /**
   * Update contact data
   * @param contactId - Contact identifier
   * @param formData - Updated form data
   * @returns Promise with updated contact data
   */
  async updateContactData(
    contactId: string,
    formData: Record<string, unknown>
  ): Promise<ContactData> {
    try {
      const response = await this.apiClient.put<ContactUpdateResponse>(
        `/forms/contact/${contactId}`,
        formData
      );

      return response.contact;
    } catch (error) {
      // Log error for monitoring
      console.error('Failed to update contact data:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to save contact data. Please try again.');
    }
  }

  /**
   * Create new contact
   * @param formData - Form data for new contact
   * @returns Promise with created contact data
   */
  async createContact(formData: Record<string, unknown>): Promise<ContactData> {
    try {
      const response = await this.apiClient.post<ContactUpdateResponse>(
        '/forms/contact',
        formData
      );

      return response.contact;
    } catch (error) {
      // Log error for monitoring
      console.error('Failed to create contact:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to create contact. Please try again.');
    }
  }

  /**
   * Fetch all contacts
   * @returns Promise with all contacts data
   */
  async fetchAllContacts(): Promise<ContactData[]> {
    try {
      const response =
        await this.apiClient.get<ContactsListResponse>('/forms/contacts');

      return response.contacts;
    } catch (error) {
      // Log error for monitoring
      console.error('Failed to fetch contacts:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to load contacts. Please try again.');
    }
  }

  /**
   * Delete contact by ID
   * @param contactId - Contact identifier
   * @returns Promise with deletion confirmation
   */
  async deleteContact(contactId: string): Promise<ContactData> {
    try {
      const response = await this.apiClient.delete<ContactDeleteResponse>(
        `/forms/contact/${contactId}`
      );

      return response.contact;
    } catch (error) {
      // Log error for monitoring
      console.error('Failed to delete contact:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to delete contact. Please try again.');
    }
  }
}

// Create and export a singleton instance
export const contactService = new ContactService();
