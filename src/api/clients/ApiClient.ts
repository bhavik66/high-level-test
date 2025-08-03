import type {
  ApiClientConfig,
  ApiError,
  HttpMethod,
  QueryParams,
  RequestConfig,
} from '../types';

/**
 * Production-level API Client with retry logic, error handling, and timeout support
 */
export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = config.timeout ?? 10000; // 10 seconds default
    this.defaultRetries = config.retries ?? 3;
    this.defaultRetryDelay = config.retryDelay ?? 1000; // 1 second default
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  /**
   * Make an HTTP request with retry logic and proper error handling
   */
  private async makeRequest<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = config?.timeout ?? this.defaultTimeout;
    const retries = config?.retries ?? this.defaultRetries;
    const retryDelay = config?.retryDelay ?? this.defaultRetryDelay;
    const headers = { ...this.defaultHeaders, ...config?.headers };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestInit: RequestInit = {
          method,
          headers,
          signal: controller.signal,
        };

        if (data && method !== 'GET') {
          requestInit.body = JSON.stringify(data);
        }

        const response = await fetch(url, requestInit);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          const apiError: ApiError = new Error(
            errorData.message || `HTTP ${response.status}`
          ) as ApiError;
          apiError.status = response.status;
          apiError.code = errorData.code;
          apiError.details = errorData.details;
          throw apiError;
        }

        const result = await response.json();
        return result;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or on the last attempt
        if (this.isClientError(error) || attempt === retries) {
          throw this.enhanceError(error as Error, method, endpoint);
        }

        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    throw this.enhanceError(lastError!, method, endpoint);
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: QueryParams,
    config?: RequestConfig
  ): Promise<T> {
    const url = params
      ? `${endpoint}?${this.buildQueryString(params)}`
      : endpoint;
    return this.makeRequest<T>('GET', url, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>('PATCH', endpoint, data, config);
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Parse error response from API
   */
  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return {
        message: response.statusText || 'Unknown error',
        code: 'PARSE_ERROR',
      };
    }
  }

  /**
   * Check if error is a client error (4xx)
   */
  private isClientError(error: any): boolean {
    return error?.status >= 400 && error?.status < 500;
  }

  /**
   * Enhance error with additional context
   */
  private enhanceError(
    error: Error,
    method: HttpMethod,
    endpoint: string
  ): ApiError {
    const apiError = error as ApiError;
    apiError.message = `${method} ${endpoint}: ${error.message}`;
    return apiError;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update default headers
   */
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove default header
   */
  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ApiClientConfig> {
    return {
      baseURL: this.baseURL,
      timeout: this.defaultTimeout,
      retries: this.defaultRetries,
      retryDelay: this.defaultRetryDelay,
      defaultHeaders: { ...this.defaultHeaders },
    };
  }
}
