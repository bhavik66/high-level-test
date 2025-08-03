import { ApiClient } from '@/api/clients';
import { env } from '@/config/env';
import type { Message } from '../types';

// Conversation API response types
export interface MessagesPage {
  messages: Message[];
  nextOffset: number;
  hasMore: boolean;
  total: number;
  conversationId: string;
}

// Conversation API parameters
export interface FetchMessagesParams {
  conversationId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Production-level Conversation Service
 * Handles all conversation-related API operations using the common API client
 */
export class ConversationService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient({
      baseURL: env.API_BASE_URL,
      timeout: 15000, // 15 seconds for conversation operations
      retries: 2, // Fewer retries for user-facing operations
      retryDelay: 500, // Faster retry for better UX
      defaultHeaders: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * Fetch paginated messages for a conversation
   * @param params - Pagination and conversation parameters
   * @returns Promise with paginated messages data
   */
  async fetchMessagesPage(
    params: FetchMessagesParams = {}
  ): Promise<MessagesPage> {
    const { conversationId = 'conv_001', limit = 20, offset = 0 } = params;

    try {
      const response = await this.apiClient.get<MessagesPage>(
        '/conversations/messages',
        {
          conversationId,
          limit,
          offset,
        }
      );

      return response;
    } catch (error) {
      // Log error for monitoring (in production, use proper logging service)
      console.error('Failed to fetch conversation messages:', error);

      // Re-throw with user-friendly message
      throw new Error('Failed to load conversation. Please try again.');
    }
  }

  /**
   * Send a new message to a conversation
   * @param conversationId - The conversation ID
   * @param messageData - The message data to send
   * @returns Promise with the created message
   */
  async sendMessage(
    conversationId: string,
    messageData: Partial<Message>
  ): Promise<Message> {
    try {
      const response = await this.apiClient.post<Message>(
        `/conversations/${conversationId}/messages`,
        messageData
      );
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }
}

// Create and export a singleton instance
export const conversationService = new ConversationService();
