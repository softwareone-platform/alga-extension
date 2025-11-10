# UI Components

Reusable, domain-agnostic UI components built on top of Headless UI and styled with Tailwind CSS.

## Components

### Form Controls
- **[Button](button.tsx)** - Button component with variants (primary, secondary, white)
- **[Input](input.tsx)** - Text input component
- **[Radio](radio.tsx)** - Radio button group component
- **[Listbox](listbox.tsx)** - Dropdown select component

### Layout & Navigation
- **[Card](card.tsx)** - Container component for content grouping
- **[Tabs](tabs.tsx)** - Tab navigation component
- **[Link](link.tsx)** - Link component

### Overlays
- **[Dialog](dialog.tsx)** - Modal dialog with title and close functionality
- **[Drawer](drawer.tsx)** - Side drawer/panel component

### Data Display
- **[Table](table.tsx)** - Table with header, body, rows, cells, and pagination
  - *Note: TableRow uses react-router navigation - to be refactored for true domain-agnosticism*
- **[Audit](audit.tsx)** - Displays timestamp and user info (borderline domain-specific)

### Actions & Utilities
- **[Actions](actions.tsx)** - Dropdown menu with action items
- **[Icon](icon.tsx)** - Icon wrapper component
- **[ErrorCard](error-card.tsx)** - Error state display component

## Dependencies

- **@headlessui/react** - Unstyled, accessible UI components
- **lucide-react** - Icon library
- **Tailwind CSS** - Styling

## Usage

All components are exported from [index.ts](index.ts) and can be imported as:

```tsx
import { Button, Table, Dialog } from '@/ui';
```
