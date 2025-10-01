# SWO ALGA Extension

## Overview

This is an ALGA PSA (Professional Services Automation) extension for SoftwareONE, built as an iframe-based UI extension. The application provides a comprehensive management interface for agreements, orders, statements, and billing configurations within the SoftwareONE ecosystem.

**Project Name:** `swo-alga-ext`
**Publisher:** SoftwareONE
**Version:** 0.1.0
**Runtime:** wasm-js@1

## Tech Stack

### Core Technologies

- **React 19.1.1** - UI framework
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Build tool and dev server
- **React Router 7.8.2** - Client-side routing

### State & Data Management

- **TanStack Query 5.85.9** - Server state management, caching, and data fetching
- **Axios 1.11.0** - HTTP client for API requests
- **@swo/rql-client 5.0.3** - RQL (Resource Query Language) client for SWO APIs

### UI & Styling

- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.12** - Tailwind integration for Vite
- **@alga-psa/ui-kit 0.1.0** - ALGA UI component library
- **@headlessui/react 2.2.7** - Unstyled, accessible UI components
- **Lucide React 0.544.0** - Icon library
- **clsx 2.1.1** - Utility for constructing className strings

### Utilities

- **Day.js 1.11.18** - Date/time manipulation
- **@swo/mp-api-model 5.0.428** - SoftwareONE marketplace API models

### Development Tools

- **@alga-psa/cli 0.1.0** - ALGA CLI for building and packaging
- **ESLint 9.33.0** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Project Structure

```
alga-extension/
├── src/
│   ├── app/                    # Application routes and pages
│   │   ├── agreements/         # Agreement management UI
│   │   ├── orders/             # Order management UI
│   │   ├── settings/           # Application settings UI
│   │   ├── statements/         # Statement management UI
│   │   └── app.tsx             # Main app component with routing
│   │
│   ├── features/               # Feature modules (domain logic)
│   │   ├── account/            # Account context and hooks
│   │   ├── agreements/         # Agreement services, hooks, components
│   │   ├── billing-config/     # Billing configuration management
│   │   ├── dates/              # Date formatting utilities
│   │   ├── extension/          # Extension context and configuration
│   │   ├── markup/             # Markup-related features
│   │   ├── orders/             # Order services and hooks
│   │   ├── statements/         # Statement services and hooks
│   │   └── user/               # User context and hooks
│   │
│   ├── lib/                    # Shared libraries and utilities
│   │   ├── alga/               # ALGA-specific integrations
│   │   │   ├── billing-config/ # Billing config client and models
│   │   │   └── kv-storage.ts   # Key-value storage abstraction
│   │   ├── extension-data/     # Extension data client and models
│   │   ├── swo/                # SoftwareONE API clients
│   │   │   ├── accounts-client.ts
│   │   │   ├── agreements-client.ts
│   │   │   ├── orders-client.ts
│   │   │   ├── statements-client.ts
│   │   │   ├── subscriptions-client.ts
│   │   │   └── users-client.ts
│   │   └── swo-navigation/     # Iframe navigation and messaging
│   │
│   ├── ui/                     # Reusable UI components
│   │   ├── actions.tsx
│   │   ├── audit.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── error-card.tsx
│   │   ├── icon.tsx
│   │   ├── input.tsx
│   │   ├── listbox.tsx
│   │   ├── radio.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   │
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
│
├── dist/                      # Build output (ui/ subdirectory)
├── manifest.json              # ALGA extension manifest
├── alga.config.json           # ALGA build configuration
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies and scripts
```

## Architecture Patterns

### Feature-Based Organization

The codebase follows a **feature-based architecture** (organizing by functionality rather than by layers):

- **`/app`** - Route pages and top-level views that compose features
- **`/features`** - Feature modules containing business logic, data fetching (hooks, context), state management, and business-aware presentation components
- **`/lib`** - Shared utilities, API clients, platform integrations (infrastructure layer)
- **`/ui`** - Reusable, generic, business-agnostic UI components (component library)

### Context + Hooks Pattern

Each feature module typically includes:

- **`context.tsx`** - React context for providing feature-specific data/clients
- **`hooks.ts`** - Custom hooks for data fetching and mutations using TanStack Query
- **`components/`** - Feature-specific, business-aware UI components

Example from `features/agreements/`:

```typescript
// context.tsx - Provides agreements client
<AgreementsContext.Provider value={{ client }}>

// hooks.ts - Custom hooks
useAgreements(options) // Query hook
useAgreement(id)       // Single item query
```

### API Client Organization

**`lib/swo/`** contains typed API clients for SoftwareONE services:

- `agreements-client.ts` - Agreement CRUD operations
- `subscriptions-client.ts` - Subscription management
- `orders-client.ts` - Order management
- `statements-client.ts` - Financial statements
- `accounts-client.ts` - Account operations
- `users-client.ts` - User management

All clients likely use `@swo/rql-client` for querying and `@swo/mp-api-model` for type definitions.

### State Management Strategy

- **TanStack Query** for server state (API data, caching, background updates)
- **React Context** for dependency injection (clients, configuration)
- **KVStorage** for persistent local storage (`lib/alga/kv-storage.ts`)
  - Extension settings: `new KVStorage("swo:extension")`
  - Billing configs: `new KVStorage("swo:billing-configs")`

### Routing Structure

The app uses **React Router 7** with nested routes:

```
/                           → Redirect to /agreements
/agreements                 → Agreements list
  /:id                      → Agreement detail (tabs below)
    /softwareone            → SoftwareONE view
    /subscriptions          → Subscriptions tab
    /orders                 → Orders tab
    /consumer               → Consumer view
    /billing                → Billing configuration
    /details                → Agreement details

/orders                     → Orders list
  /:id                      → Order detail
    /items                  → Order items
    /details                → Order details

/statements                 → Statements list
  /:id                      → Statement detail
    /charges                → Charges breakdown
    /details                → Statement details

/settings                   → Settings
  /general                  → General settings (API endpoint, token)
  /details                  → Extension details
```

### Component Patterns

1. **Barrel Exports** - Each module exports via `index.ts` for clean imports
2. **Path Aliases** - Configured in `vite.config.ts`:
   - `@lib` → `./src/lib`
   - `@ui` → `./src/ui`
   - `@features` → `./src/features`
3. **Headless UI Integration** - Uses `@headlessui/react` for accessible components
4. **ALGA UI Kit** - Imports theme from `@alga-psa/ui-kit/theme.css`

## Key Files

### Entry Point

**`src/main.tsx`**

- Sets up QueryClient with retry and refetch policies
- Wraps app in providers: `QueryClientProvider` → `ExtensionProvider` → `BrowserRouter`
- Initializes KVStorage for extension settings
- Contains identification tokens (IDT comments)

### Main App

**`src/app/app.tsx`**

- Defines all application routes
- Checks for extension configuration (endpoint, token)
- Redirects to `/settings/general` if not configured
- Wraps routes in `AccountProvider`, `UserProvider`, `BillingConfigsProvider`
- Runs iframe integration via `runIFrame()`

### Configuration Files

- **`manifest.json`** - ALGA extension manifest (name, version, UI type, entry point)
- **`alga.config.json`** - Build command configuration
- **`vite.config.ts`** - Build output to `./dist/ui`, path aliases, Tailwind plugin

## Build & Development

### Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite build
npm run build:alga   # Build + package for ALGA (alga pack)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Build Output

- Vite builds to `./dist/ui/`
- ALGA CLI (`alga pack`) packages the extension for deployment
- Assets defined in manifest: `"assets": ["ui/**/*"]`

## Integration Points

### ALGA PSA Platform

- Extension runs as an iframe within ALGA PSA
- Manifest defines app menu hook: `{ "appMenu": { "label": "swo-alga-ext" } }`
- Uses ALGA UI Kit for consistent theming

### SoftwareONE APIs

- Base URL and authentication token configured via `/settings/general`
- All API clients receive `baseUrl` and `token` from extension context
- Uses RQL client for advanced querying capabilities

### Iframe Communication

**`lib/swo-navigation/`** handles parent-iframe messaging:

- `iframe.ts` - Iframe-side communication
- `host.ts` - Parent window communication
- `messages.ts` - Message type definitions
- `utils.ts` - Helper functions

### Storage

- **KVStorage** abstraction for browser storage
- Namespaced storage:
  - `"swo:extension"` - Extension configuration (endpoint, token, status)
  - `"swo:billing-configs"` - Billing configuration data

## Code Quality

### TypeScript Configuration

- Strict mode enabled
- Split configs: `tsconfig.app.json` (app code), `tsconfig.node.json` (build tools)
- Path mapping for clean imports

### Linting

- ESLint 9 with flat config (`eslint.config.js`)
- TypeScript ESLint integration
- React hooks and refresh plugins

### File Count

- **116 TypeScript/TSX files** in `src/`
- Clean separation between types, components, and logic

## UI Components

The `src/ui/` directory provides reusable, likely Headless UI-based components:

- **Forms**: Button, Input, Radio, Listbox
- **Layout**: Card, Drawer, Dialog, Tabs, Table
- **Feedback**: Error Card, Actions
- **Display**: Audit, Icon, Link

These components are exported as a barrel from `ui/index.ts` for easy consumption across the app.

## Extension Data Models

The extension likely defines:

- **Extension Details** (`lib/extension-data/models.ts`)
  - Endpoint URL
  - Authentication token
  - Status (active/disabled)
  - Metadata
- **Billing Config Models** (`lib/alga/billing-config/models.ts`)
- Custom types extending `@swo/mp-api-model`

## Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Make Changes**: Edit files in `src/`
3. **Build for Production**: `npm run build:alga`
4. **Deploy**: Package is created via ALGA CLI
5. **Install in ALGA**: Upload extension to ALGA PSA platform

## Notes

- Extension requires configuration before use (API endpoint and token)
- Uses React 19 with StrictMode enabled
- Query client configured with 2 retries for queries, 0 for mutations
- Window focus refetch disabled by default
- Identification tokens in `main.tsx` suggest integration with SoftwareONE services
