# Lib

React-agnostic SDK-like code that provides core functionality and API integrations.

## Structure

### [swo/](swo/)

SWO (SoftwareONE) API client implementations for consuming the MP API.

**Client Classes:**

- **AgreementsClient** - Fetch agreements, subscriptions, and orders
- **SubscriptionsClient** - Manage subscription data
- **OrdersClient** - Handle order operations
- **StatementsClient** - Access billing statements
- **AccountsClient** - Account management
- **UsersClient** - User data operations

All clients use:

- **@swo/rql-client** for query building
- **@swo/mp-api-model** for type definitions
- Axios for HTTP requests

### [alga/](alga/)

Alga PSA-specific integrations and utilities.

**Key Components:**

- **KVStorage** - Key-value storage abstraction for Alga storage API
- **extension-storage.ts** - Standalone example/demo of storage API operations
- **billing-config/** - Billing configuration client and models
- **clients/** - Client management functionality
- **extension/** - Extension-specific client and models
- **services/** - Service management client and models
- **shared.ts** - Common utilities and types

## Design Principles

- **Framework-agnostic** - No React dependencies; pure TypeScript/JavaScript
- **Reusable** - Code can be extracted as standalone SDK packages
- **Type-safe** - Full TypeScript coverage with proper type definitions
- **Separation of concerns** - API clients, storage, and navigation are isolated modules

## Dependencies

- **axios** - HTTP client
- **@swo/rql-client** - RQL query builder for SWO API
- **@swo/mp-api-model** - Type definitions for SWO Managed Platform API
