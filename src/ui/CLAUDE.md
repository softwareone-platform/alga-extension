# UI Components Directory

This directory contains purely presentational UI components with no business logic, API calls, or service dependencies.

## Architecture Principles

### Pure UI Components

- **No Business Logic**: Components handle only presentation and user interactions
- **No API Calls**: All data is passed via props - no direct service integration
- **No Side Effects**: Components are stateless or manage only local UI state
- **Reusable**: Components are designed for use across different application contexts

### ForwardRef Pattern

All components use `React.forwardRef` for proper ref forwarding to enable:

- Form library integration (react-hook-form, etc.)
- Focus management and accessibility
- Third-party library compatibility
- Imperative DOM operations when needed

```typescript
export const Component = forwardRef<HTMLElementType, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Element ref={ref} className={clsx(baseStyles, className)} {...props} />
    );
  }
);

Component.displayName = "Component";
```

## Technology Stack

### Headless UI Foundation

Built on `@headlessui/react` for:

- Accessible component primitives
- Keyboard navigation and focus management
- ARIA attributes and screen reader support
- Unstyled, composable components

### Styling Approach

- **Tailwind CSS**: Primary styling system with utility classes
- **clsx**: Conditional className composition
- **Design Tokens**: Consistent spacing, colors, and typography through CSS variables

## Component Patterns

### 1. Simple Wrapper Components

Basic HTML elements or Headless UI components with consistent styling:

- `Button` - Headless UI button with variant support
- `Input` / `Textarea` - Form inputs with focus styling
- `Card` - Layout container with standard spacing
- `Link` - Styled anchor elements

### 2. Compound Components

Components that expose sub-components for flexible composition:

```typescript
export const Tabs = TabsComponent as typeof TabsComponent & {
  Tab: typeof TabComponent;
};
Tabs.Tab = TabComponent;

// Usage: <Tabs><Tabs.Tab /></Tabs>
```

### 3. Headless UI Wrappers

Components that wrap multiple related Headless UI primitives:

- `Dialog` + `DialogPanel` + `DialogTitle` - Modal dialogs
- `Actions` + `ActionItem` - Dropdown menus

## TypeScript Integration

### Type Extension Pattern

Components extend base HTML or Headless UI types:

```typescript
type ComponentProps = HeadlessComponentProps & {
  customProp?: string;
};

// Or for HTML elements
type ComponentProps = HTMLAttributes<HTMLDivElement> & {
  customProp?: string;
};
```

### Generic Components

Some components use generic constraints:

```typescript
export const Component = forwardRef<HTMLElementType, ComponentProps>(
  ({ className, ...props }, ref) => { ... }
);
```

## Export Strategy

### Centralized Exports

All components are re-exported through `index.ts`:

```typescript
export * from "./button";
export * from "./input";
// ...
```

This enables clean imports:

```typescript
import { Button, Input, Card } from "@/ui";
```

## Design System

### Tailwind CSS Utilities

- Standard Tailwind classes for layout, spacing, and typography
- Consistent design tokens through utility classes
- Responsive design with Tailwind breakpoints

## Development Guidelines

### Adding New Components

1. Use `forwardRef` for all components
2. Extend appropriate base types (HTML or Headless UI)
3. Include `displayName` for debugging
4. Use `clsx` for conditional styling
5. Follow existing patterns for consistency
6. Export from `index.ts`

### Styling Guidelines

1. Use Tailwind utilities as the primary styling method
2. Use CSS custom properties for theme values
3. Apply consistent focus styles across interactive elements
4. Maintain design system consistency through shared classes

### TypeScript Guidelines

1. Extend base types rather than redefining
2. Use generic types when components need flexibility
3. Provide proper type inference for component props
4. Include JSDoc comments for complex props when needed
