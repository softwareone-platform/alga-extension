import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { useParams } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableContainer } from "@/ui/ui/table";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useSubscription } from "@features/subscriptions";
import { Price, PriceWithMarkup } from "@features/price";
import { AgreementLine } from "@swo/mp-api-model";
import { BillingConfig } from "@/shared/billing-configs";

type ItemRow = AgreementLine & { billingConfig?: BillingConfig | null };

const createColumns = (currency?: string): ColumnDef<ItemRow>[] => [
  {
    accessorKey: 'item',
    header: 'Name',
    minSize: 160,
    size: 200,
    cell: ({ row: { original } }) => {
      const { item } = original;
      if (!item?.name && !item?.id) return <span>—</span>;
      return (
        <div className="flex flex-col gap-0.5 items-start relative w-full">
          <span className="block truncate w-full">{item?.name || "—"}</span>
          <span className="block text-xs text-text-500 truncate w-full">{item?.id || "—"}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.quantity || "—"}</span>
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.item?.unit?.name || "—"}</span>
  },
  {
    accessorKey: 'unitRP',
    header: 'Unit RP',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <Price currency={currency} value={original.price?.unitSP} />
  },
  {
    accessorKey: 'rpxm',
    header: 'RPxM',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => (
      <PriceWithMarkup currency={currency} value={original.price?.SPxM} markup={original.billingConfig?.markup} />
    )
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => (
      <PriceWithMarkup currency={currency} value={original.price?.SPxY} markup={original.billingConfig?.markup} />
    )
  },
];

export function Items() {
  const { id } = useParams<{ id: string }>();
  const { subscription, isPending } = useSubscription(id!);
  const { billingConfig } = useBillingConfigByAgreement(
    subscription?.agreement?.id!
  );
  const items = subscription?.lines ?? [];

  const [columnSizing, setColumnSizing] = useState({});

  const itemsWithConfig = useMemo<ItemRow[]>(
    () => items.map((item) => ({ ...item, billingConfig })),
    [items, billingConfig]
  );

  const columns = createColumns(subscription?.price?.currency);

  const table = useReactTable({
    data: itemsWithConfig,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (isPending) return <>Loading...</>;

  if (!items || items.length === 0) return <>No items found.</>;

  return (
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
                <tr
                  key={row.id}
                  className="border-border-200 border-b text-sm text-text-700"
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
      </TableContainer>
    </Card>
  );
}
