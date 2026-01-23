# Table Migration Guide: Custom Table to TanStack Table

## Overview

This document provides instructions for migrating table components from the legacy custom `@ui/table` implementation to the new TanStack Table-based approach using `@/ui/ui/table-next`.

---

## Key Differences Summary

| Aspect | Old (`@ui/table`) | New (TanStack + `table-next`) |
|--------|-------------------|-------------------------------|
| **Column Layout** | CSS Grid via className | `ColumnDef[]` with `size`/`minSize` |
| **Data Rendering** | Manual `.map()` over rows | `useReactTable` + `flexRender` |
| **Cell Content** | Direct JSX in `<TableCell>` | Cell function with row context |
| **Column Resizing** | Not supported | Built-in with resize handlers |
| **Navigation** | `<TableRow link={...}>` | Manual handling in cell |
| **Wrapper** | `<Table>` | `<TableContainer>` |
| **Pagination** | Inside `<TableFooter><TableRow>` | Direct child of `<TableContainer>` |

---

## Migration Steps

### Step 1: Update Imports

**Before:**
```tsx
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@ui/table";
```

**After:**
```tsx
import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table-next";
```

---

### Step 2: Define Column Configuration

Convert the grid template columns and header cells into a `ColumnDef` array.

**Before (grid template in className):**
```tsx
<Table className="grid-cols-[minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)]">
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Type</TableHeaderCell>
      <TableHeaderCell>Agreement</TableHeaderCell>
      <TableHeaderCell>Product</TableHeaderCell>
    </TableRow>
  </TableHeader>
```

**After (ColumnDef array):**
```tsx
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {original.name}
      </span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    minSize: 150,
    size: 150,
    cell: ({ row: { original } }) => <span>{original.type || "—"}</span>
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { agreement } } }) => (
      <Agreement name={agreement?.name} id={agreement?.id} />
    )
  },
  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { product } } }) => (
      <Product name={product?.name} iconUrl={product?.icon} />
    )
  },
];
```

---

### Step 3: Convert Custom Cell Components

Custom cell components that wrap `<TableCell>` need to be converted to plain rendering components.

**Before (wraps TableCell):**
```tsx
// AgreementCell wraps <TableCell>
<AgreementCell name={item.agreement?.name} id={item.agreement?.id} />
```

**After (plain component, no TableCell wrapper):**
```tsx
// Use Agreement component directly (or create one)
cell: ({ row: { original: { agreement } } }) => (
  <Agreement name={agreement?.name} id={agreement?.id} />
)
```

For cells that need hooks (e.g., fetching related data), define the cell inline:
```tsx
{
  accessorKey: 'consumer',
  header: 'Consumer',
  cell: ({ row: { original: { agreement } } }) => {
    const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
    const { consumer } = useConsumer(billingConfig?.consumerId);
    return <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
  }
}
```

---

### Step 4: Set Up Table Instance

Add the `useReactTable` hook and column sizing state:

```tsx
export function YourComponent() {
  const [offset, setOffset] = useState(0);
  const { data, pagination, isFetching } = useYourDataHook({ offset });

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  // ... render
}
```

---

### Step 5: Convert JSX Structure

**Before:**
```tsx
<Card>
  <Table className="grid-cols-[...]">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        {/* ... */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id} link={`/items/${item.id}`}>
          <TableCell>{item.name}</TableCell>
          {/* ... */}
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <Pagination
          onPageChange={(page) => setOffset((page - 1) * (pagination.limit ?? 0))}
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableRow>
    </TableFooter>
  </Table>
</Card>
```

**After:**
```tsx
<Card>
  <TableContainer>
    <div className="w-full overflow-x-scroll relative">
      <table style={{ width: table.getTotalSize() }} className="relative table-fixed">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-border-200 border-b">
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="relative py-3 px-6 text-left text-xs font-medium tracking-wider"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                    style={{
                      background: header.column.getIsResizing() ? '#2563eb' : 'transparent',
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-border-200 border-b text-sm text-text-700">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="py-3 px-6 items-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Pagination
      onPageChange={(page) => setOffset((page - 1) * (pagination.limit ?? 0))}
      totalItems={pagination.total ?? 0}
      isLoading={isFetching}
    />
  </TableContainer>
</Card>
```

---

### Step 6: Handle Row Navigation (if applicable)

The old `<TableRow link={...}>` prop is not available. Handle navigation in the cell or row click:

**Option A: Link in specific cell**
```tsx
{
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row: { original: { id, name } } }) => (
    <Link to={`/items/${id}`} className="text-blue-500 hover:text-blue-600">
      {name}
    </Link>
  )
}
```

**Option B: Row click handler (add to `<tr>`)** *(preferred)*
```tsx
<tr
  key={row.id}
  onClick={() => navigate(`/items/${row.original.id}`)}
  className="border-border-200 border-b text-sm text-text-700 cursor-pointer hover:bg-primary-50"
>
```
Use `hover:bg-primary-50` for consistent hover styling.

---

## Column Width Mapping

When converting CSS grid widths to TanStack column sizes:

| Grid Template | TanStack Property |
|---------------|-------------------|
| `minmax(192px, auto)` | `{ minSize: 160, size: 192 }` |
| `minmax(150px, auto)` | `{ minSize: 120, size: 150 }` |
| `minmax(0, auto)` | `{ minSize: 100, size: 160 }` (flexible) |
| `minmax(128px, auto)` | `{ minSize: 100, size: 128 }` |

---

## Checklist

- [ ] Update imports (remove `@ui/table`, add TanStack + `table-next`)
- [ ] Define `columns: ColumnDef<T>[]` array
- [ ] Convert cell components from `<TableCell>` wrappers to plain renderers
- [ ] Add `useReactTable` hook with `columnSizing` state
- [ ] Replace `<Table>` with `<TableContainer>` + `<table>`
- [ ] Use `flexRender` for headers and cells
- [ ] Add column resize handlers to `<th>` elements
- [ ] Move `<Pagination>` outside table, as direct child of `<TableContainer>`
- [ ] Handle row navigation if using `link` prop

---

## Example Migration Reference

**Old file:** [extension/src/ui/app/client/start/statements.tsx](extension/src/ui/app/client/start/statements.tsx)
**New file:** [extension/src/ui/app/msp/start/statements.tsx](extension/src/ui/app/msp/start/statements.tsx)
