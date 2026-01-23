---
name: migrate-table
description: Migrate table components from legacy @ui/table to TanStack Table
argument-hint: [file-path]
disable-model-invocation: true
---

Migrate the table component in $ARGUMENTS from the legacy `@ui/table` implementation to TanStack Table.

## Migration Steps

### 1. Update Imports

Replace:
```tsx
import { Pagination, Table, TableBody, TableCell, TableFooter, TableHeader, TableHeaderCell, TableRow } from "@ui/table";
```

With:
```tsx
import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table-next";
import { useNavigate } from "react-router";
```

### 2. Define Column Configuration

Convert grid template columns and header cells into a `ColumnDef[]` array:

```tsx
const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: 'fieldName',
    header: 'Header Text',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => <span>{original.fieldName}</span>
  },
];
```

### 3. Convert Cell Components

Replace `<TableCell>` wrapper components with plain renderers. For cells needing hooks:

```tsx
{
  accessorKey: 'consumer',
  header: 'Consumer',
  cell: ({ row: { original } }) => {
    const { data } = useHook(original.id);
    return <Component data={data} />;
  }
}
```

### 4. Set Up Table Instance

```tsx
export function YourComponent() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const { data, pagination, isFetching } = useYourDataHook({ offset });
  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: data ?? [],
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });
  // ...
}
```

### 5. Convert JSX Structure

Replace `<Table>` with `<TableContainer>` + native `<table>`:

```tsx
<Card>
  <TableContainer>
    <div className="w-full overflow-x-scroll relative">
      <table style={{ width: table.getTotalSize() }} className="relative table-fixed">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-border-200 border-b">
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ width: header.getSize() }} className="relative py-3 px-6 text-left text-xs font-medium tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                    style={{ background: header.column.getIsResizing() ? '#2563eb' : 'transparent' }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onClick={() => navigate(`/your-route/${row.original.id}`)}
              className="border-border-200 border-b text-sm text-text-700 cursor-pointer hover:bg-primary-50"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ width: cell.column.getSize() }} className="py-3 px-6 items-center">
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

### 6. Row Navigation

Use row click with `useNavigate` (preferred). Entire row is clickable with `hover:bg-primary-50`.

## Column Width Mapping

| Grid Template | TanStack Property |
|---------------|-------------------|
| `minmax(192px, auto)` | `{ minSize: 160, size: 192 }` |
| `minmax(150px, auto)` | `{ minSize: 120, size: 150 }` |
| `minmax(0, auto)` | `{ minSize: 100, size: 160 }` |

## Reference

See migrated example: `extension/src/ui/app/msp/start/orders.tsx`
