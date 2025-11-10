# Features

Domain-bound reusable components and business logic for Alga PSA integration.

## Structure

Each feature module typically contains:
- **components/** - Domain-specific UI components
- **services/** - Data fetching hooks, contexts, and API client integration
- **view/** - View models and data transformation logic (when applicable)

## Feature Modules

### Core Domain Entities

- **[agreements/](agreements/)** - Agreement management (status badges, cells, hooks for fetching agreements/subscriptions/orders)
- **[subscriptions/](subscriptions/)** - Subscription handling (status badges, billing periods)
- **[orders/](orders/)** - Order management (status badges, data fetching)
- **[services/](services/)** - Service catalog and management
- **[products/](products/)** - Product components and cells
- **[consumers/](consumers/)** - Consumer management (links, models, hooks)

### Supporting Features

- **[billing-config/](billing-config/)** - Billing configuration (status badges, hooks)
- **[statements/](statements/)** - Statement handling and data fetching
- **[dates/](dates/)** - Date/time display components (DateTimeCell)
- **[markup/](markup/)** - Price markup calculations and display cells

### System Features

- **[account/](account/)** - Account context provider and hooks
- **[user/](user/)** - User context and authentication
- **[extension/](extension/)** - Extension-specific context and hooks

## Common Patterns

### Context Providers
Most feature modules export a Context Provider that wraps API clients:
```tsx
<AccountProvider baseUrl={url} token={token}>
  {children}
</AccountProvider>
```

### Custom Hooks
Features expose custom hooks for data fetching using TanStack Query:
```tsx
const { agreements, pagination, isLoading } = useAgreements(options);
```

### Domain Components
Reusable components with domain-specific logic:
- Status badges (AgreementStatusBadge, SubscriptionStatusBadge, OrderStatusBadge)
- Data cells (DateTimeCell, MarkupCell, ProductCell, AgreementCell)
- Domain-specific links (ConsumerLink)

## Dependencies

- **@swo/mp-api-model** - API type definitions
- **@tanstack/react-query** - Data fetching and caching
- **@lib/swo** - Internal API client SDK
- **@ui** - Base UI components
