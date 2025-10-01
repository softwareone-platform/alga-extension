# Features Directory

## Overview

The `src/features/` directory contains React business features that implement the "reactification" pattern for integrating with external services and managing application state.

## Feature Structure

Each feature follows a standard organization pattern:

- `context.tsx` - React Context provider with state and client management
- `hooks.ts` - Custom hooks for consuming the feature's context
- `index.ts` - Export barrel for clean imports

## Feature Types

### Client Wrappers

Features that wrap vanilla-js clients from `src/lib/` into React Context providers:

- Follow the optional client pattern (`client?: SomeClient`)
- Create clients conditionally based on available credentials
- Integrate with TanStack Query for data fetching

### State Management

Features that manage application state:

- Use React Context for state sharing
- Implement localStorage persistence when needed
- Provide status tracking and error handling

## Implementation Guidelines

- Reference the main project CLAUDE.md for detailed "reactification" patterns
- Use consistent naming conventions across features
- Export all public APIs through `index.ts`
- Follow TypeScript best practices with proper typing

## Integration

Features are consumed in the `src/app/` directory where they're composed into the application's component hierarchy.
