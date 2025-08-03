import { env } from '@/config/env';
import { ApiClient } from '@/shared/api/clients';
import type { NoteData } from '../type';

// Notes API response types
export interface NotesPage {
  notes: NoteData[];
  nextOffset: number;
  hasMore: boolean;
  total: number;
}

// Notes API parameters
export interface FetchNotesParams {
  limit?: number;
  offset?: number;
}

/**
 * Production-level Notes Service
 * Handles all notes-related API operations using the common API client
 */
export class NotesService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient({
      baseURL: env.API_BASE_URL,
      timeout: 15000, // 15 seconds for notes operations
      retries: 2, // Fewer retries for user-facing operations
      retryDelay: 500, // Faster retry for better UX
      defaultHeaders: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * Fetch paginated notes
   * @param params - Pagination parameters
   * @returns Promise with paginated notes data
   */
  async fetchNotesPage(params: FetchNotesParams = {}): Promise<NotesPage> {
    const { limit = 20, offset = 0 } = params;

    try {
      const response = await this.apiClient.get<NotesPage>('/notes', {
        limit,
        offset,
      });

      return response;
    } catch (error) {
      // Log error for monitoring (in production, use proper logging service)
      console.error('Failed to fetch notes:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to load notes. Please try again.');
    }
  }
}

// Create and export a singleton instance
export const notesService = new NotesService();
