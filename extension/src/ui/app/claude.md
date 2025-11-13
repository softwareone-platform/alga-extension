# App

Application-specific code with non-reusable components for the two main portals.

## Structure

The app is organized into two main portals:

### [consumer/](consumer/)
**Consumer Portal** - End-user facing interface for customers to manage their services.

**Main Sections:**
- **start/** - Dashboard view with overview of agreements, subscriptions, orders, and statements
- **agreements/** - Agreement management
  - Agreement detail with subscriptions, orders, and details tabs
- **subscriptions/** - Subscription management
  - Subscription detail with items, orders, and details tabs
- **orders/** - Order tracking
  - Order detail with items and details tabs
- **statements/** - Billing statements
  - Statement detail with charges and details tabs

**Key Files:**
- [routes.tsx](consumer/routes.tsx) - Route definitions for consumer portal
- [layout.tsx](consumer/layout.tsx) - Consumer portal layout wrapper

### [msp/](msp/)
**MSP Portal** - Managed Service Provider interface with extended management capabilities.

**Main Sections:**
- **agreements/** - Agreement management
  - Agreement detail with SoftwareOne, subscriptions, orders, consumer, billing, and details tabs
- **subscriptions/** - Subscription management
  - Subscription detail with items, orders, and details tabs
- **orders/** - Order management
  - Order detail with items and details tabs
- **statements/** - Statement management
  - Statement detail with charges and details tabs
- **settings/** - Portal configuration
  - General settings and details tabs

**Key Files:**
- [routes.tsx](msp/routes.tsx) - Route definitions for MSP portal
- Layout files per section (e.g., agreements/layout.tsx, subscriptions/layout.tsx)

### Top-Level

- **[app.tsx](app.tsx)** - Root application component with context providers setup
  - Initializes AccountProvider, UserProvider, BillingConfigsProvider, etc.
  - Handles navigation sync with iframe
  - Manages authentication state

## Routing Structure

Both portals follow a consistent nested routing pattern:
- List views at top level (e.g., `/msp/agreements`)
- Detail views with tabs (e.g., `/msp/agreements/:id/subscriptions`)
- Nested detail views for related entities

## Key Differences: Consumer vs MSP

- **Consumer Portal**: Simplified view with dashboard (start page), focused on end-user needs
- **MSP Portal**: Extended functionality with additional tabs (SoftwareOne, billing, consumer details), settings page, and management features

## Component Reusability

Components in this directory are **not reusable** across the application unless they're only used within a single app segment. For reusable components, see:
- [ui/](../ui/) - Domain-agnostic components
- [features/](../features/) - Domain-bound reusable components
