# SWO Client Library

## Overview

The SWO Client library provides vanilla JavaScript clients for SWO API operations. These are framework-agnostic HTTP clients that can be integrated into any JavaScript application.

## Architecture

All clients follow a consistent pattern:
- Require `baseUrl` and `token` parameters for instantiation
- Use axios with shared configuration for HTTP requests  
- Provide strongly-typed methods for API operations
- Support Bearer token authentication

## Base Configuration (`shared.ts`)

```typescript
export const axiosInstance = (baseUrl: string, token: string) =>
  axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
```

## Client Class Pattern

```typescript
export class SomeClient {
  private axios: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.axios = axiosInstance(baseUrl, token);
  }
  
  async getResource(): Promise<ResourceType> {
    const { data } = await this.axios.get<ResourceResponse>('/endpoint');
    return data;
  }
}
```

## Available Clients

- **AccountsClient** - Account management operations
- **AgreementsClient** - Agreement, subscription, and order operations with RQL query support
- **StatementsClient** - Statement operations
- **SubscriptionsClient** - Subscription management
- **OrdersClient** - Order operations

## Key Features

### RQL Query Support
The `AgreementsClient` supports advanced querying using the `@swo/rql-client`:
- Filtering by fields (e.g., licensee.id)
- Sorting and ordering
- Field expansion and exclusion
- Pagination with offset/limit

### TypeScript Support
All clients use types from `@swo/mp-api-model` for:
- Request parameters
- Response data structures  
- Type safety throughout the API layer

## Dependencies

- `axios` - HTTP client
- `@swo/mp-api-model` - TypeScript models for API responses
- `@swo/rql-client` - RQL query building (used by AgreementsClient)

## Usage Example

```typescript
const client = new AccountsClient('https://api.swo.com', 'your-token');
const account = await client.getAccount();
```

**Note**: For React integration patterns, see the main project CLAUDE.md file.