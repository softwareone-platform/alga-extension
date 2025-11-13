# Extension

React-based browser extension for Alga PSA integration.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **UI Components**: Custom components + Alga UI Kit

## Project Structure

- **[lib/](src/lib/)** - React-agnostic code that could be part of an SDK (API clients, utilities, business logic)
- **[ui/](src/ui/)** - Reusable, domain-agnostic UI components
- **[features/](src/features/)** - Domain-bound reusable components with business logic
- **[app/](src/app/)** - Application-specific code with non-reusable components
- **[utils/](src/utils/)** - General utility functions

## Key Files

- [manifest.json](manifest.json) - Browser extension manifest
- [vite.config.ts](vite.config.ts) - Vite build configuration
- [main.tsx](src/main.tsx) - Application entry point
- [store.ts](src/store.ts) - Global state management

## Development

```bash
npm run dev        # Start development server
npm run build      # Build extension
npm run build:alga # Build and pack with Alga CLI
```
