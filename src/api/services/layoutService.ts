import { env } from '@/config/env';
import type { LayoutItem } from '@/types/layoutTypes';
import { ApiClient } from '../clients/ApiClient';

// Create API client instance for layout service
const apiClient = new ApiClient({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
});

export interface LayoutResponse {
  layout: LayoutItem[];
  timestamp: string;
  version: string;
}

/**
 * Layout Service - handles all layout-related API calls
 */
export class LayoutService {
  /**
   * Fetch main layout configuration from API
   */
  static async getLayout(name: string): Promise<LayoutItem[]> {
    const response = await apiClient.get<LayoutResponse>(`/layout/${name}`);
    return response.layout;
  }

  /**
   * Fetch main layout configuration (alternative endpoint)
   */
  static async getMainLayout(): Promise<LayoutItem[]> {
    return await apiClient.get<LayoutItem[]>('/layout/main');
  }
}

export default LayoutService;
