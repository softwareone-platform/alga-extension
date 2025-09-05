# Features/Settings

This directory contains the application-wide settings feature, providing configuration management for the SoftwareOne extension.

## Architecture

This feature follows the **reactification pattern** for integrating settings management with React and local storage persistence.

### Files Structure

- `context.tsx` - React Context provider and core settings logic
- `hooks.ts` - Custom hooks for consuming settings in components  
- `index.ts` - Clean exports for the feature

## Settings Domain

### Types

- **`SWOSettings`** - Configuration object containing:
  - `endpoint`: API endpoint URL
  - `token`: Authentication token
  - `note`: Optional user note

- **`SWOStatus`** - Connection status: `"unconfigured"` | `"active"` | `"disabled"` | `"error"`

### Context Provider Pattern

The `SettingsProvider` manages:
- Local storage persistence via `localStorage` 
- Status tracking based on configuration validity
- Settings validation and state management

### Hook Pattern

The `useSettings()` hook provides:
- Current settings object
- Status information
- Actions: `setSettings()`, `enable()`, `disable()`, `error()`

## Usage

```typescript
// Wrap app with provider (typically in main.tsx)
<SettingsProvider>
  <App />
</SettingsProvider>

// Use in components
const { settings, status, setSettings } = useSettings();
```

## Integration

This feature is used app-wide for:
- API client configuration in `src/lib/` integrations
- Authentication state management
- Connection status tracking

**Critical**: Always include `endpoint` and `token` in TanStack Query keys when using these settings with external API clients to ensure proper cache invalidation.