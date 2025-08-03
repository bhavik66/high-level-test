# Shared API Client

This directory contains the production-level API client infrastructure used throughout the application.

## Structure

- `clients/` - API client implementations
- `types/` - Common API types and interfaces

## Usage

### Basic API Client

```typescript
import { ApiClient } from '@/shared/api';

const client = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
});

// GET request
const data = await client.get('/users');

// POST request
const newUser = await client.post('/users', { name: 'John' });
```

### Service Implementation

```typescript
import { ApiClient } from '@/shared/api';

export class UserService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient({
      baseURL: env.API_BASE_URL,
      timeout: 15000,
    });
  }

  async getUsers() {
    return this.apiClient.get('/users');
  }
}
```

## Features

- **Automatic Retries**: Configurable retry logic with exponential backoff
- **Timeout Handling**: Request timeout with abort controller
- **Error Enhancement**: Detailed error information with context
- **Type Safety**: Full TypeScript support
- **Production Ready**: Comprehensive error handling and logging
