# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` - Runs Vite dev server with HMR
- **Build for production**: `npm run build` - TypeScript compilation followed by Vite build
- **Lint code**: `npm run lint` - ESLint with TypeScript and React rules
- **Preview production build**: `npm run preview` - Preview the built application

## Project Architecture

This is a React 19 + TypeScript + Vite application with a minimal setup:

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router v7 in declarative mode
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with TypeScript, React Hooks, and React Refresh plugins
- **Entry Point**: `src/main.tsx` renders the main `App` component
- **TypeScript Config**: Uses project references with separate configs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)

### Source Structure

- `src/main.tsx` - Application entry point with React StrictMode
- `src/app/` - Application components organized by feature areas
- `src/ui/` - Reusable UI components
- `src/lib/` - External library integrations ("reactified" vanilla clients)
- `public/` - Static assets served by Vite
- `dist/` - Build output directory (ignored by ESLint)

#### Lib Folder Architecture

The `src/lib/` folder contains external library integrations that follow a "reactification" pattern:

- **External Clients**: Vanilla JavaScript classes that wrap HTTP APIs (e.g., `swo-client`)
- **React Integration**: Each client is wrapped with React Context and TanStack Query
- **Dynamic Configuration**: All clients use `baseUrl` and `token` from application settings (not env variables)
- **Query Key Pattern**: TanStack queries include `endpoint` and `token` in query keys for proper cache invalidation

See individual CLAUDE.md files in lib subdirectories for specific implementation details.

### Key Configuration Files

- `vite.config.ts` - Vite configuration with React plugin
- `eslint.config.js` - ESLint configuration with TypeScript and React rules
- `tsconfig.json` - TypeScript project references configuration
- `package.json` - Project dependencies and scripts

## Development Notes

- Uses modern ESLint flat config format with TypeScript support
- CSS files are imported directly in components
- No testing framework is currently configured
- HMR (Hot Module Replacement) is enabled for fast development

## Code Style Guidelines

- **TypeScript Types**: Prefer `type` over `interface` for type definitions

## React Integration Patterns

This project uses a "reactification" pattern for integrating vanilla JS external libraries with React and TanStack Query.

### Pattern Overview

1. **Vanilla Clients**: Framework-agnostic client classes in `src/lib/`
2. **React Providers**: Context providers in `src/app/` feature directories 
3. **Query Hooks**: Custom hooks using TanStack Query for data fetching

### Context Provider Pattern

```typescript
export const SomeProvider = ({ children }: Props) => {
  const { settings } = useSettings();
  const { endpoint, token } = settings;

  const client = useMemo(
    () => new SomeClient(endpoint, token),
    [endpoint, token]
  );

  return (
    <SomeContext.Provider value={{ client }}>
      {children}
    </SomeContext.Provider>
  );
};
```

### Query Hook Pattern

```typescript
export const useSome = (options?) => {
  const { client } = useContext(SomeContext);
  const { settings } = useSettings();
  const { endpoint, token } = settings;

  return useQuery({
    queryKey: ["resource", endpoint, token, options],
    queryFn: () => client.getResource(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(endpoint && token),
  });
};
```

### Critical Query Key Pattern

**Always include `endpoint` and `token` in query keys** when using external APIs with dynamic configuration:

- ✅ `["accounts", endpoint, token]`
- ✅ `["agreements", endpoint, token, options]`
- ❌ `["accounts"]` - Missing credentials, cache won't invalidate

This ensures proper cache invalidation when API credentials change in the application settings.

## External Libraries and Documentation

- **Always use Context7 tools**: When asked to use or implement features with external libraries, ALWAYS use the context7 MCP tools (`resolve-library-id` and `get-library-docs`) to fetch the latest documentation and code examples before implementation. This ensures you have access to up-to-date information and best practices for any library.