import { useState } from "react";
import { Card } from "@ui/card";
import { useParams } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableContainer } from "@/ui/ui/table";
import { withMarkup } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useOrder } from "@features/orders";
import { Badge } from "@alga-psa/ui-kit";
import { OrderLine } from "@swo/mp-api-model";
import { BillingConfig } from "@/shared/billing-configs";

export const ItemStatusBadge = ({ status }: { status?: string }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Draft") tone = "default";
  if (status === "Pending") tone = "warning";
  if (status === "Published") tone = "success";
  if (status === "Error") tone = "danger";

  return <Badge tone={tone}>{status}</Badge>;
};

type ItemRow = OrderLine & { billingConfig?: BillingConfig | null };

const columns: ColumnDef<ItemRow>[] = [
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
          <span className="text-xs text-text-500 block truncate w-full">{item?.id || "—"}</span>
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
    accessorKey: 'rpxm',
    header: 'RPxM',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => {
      const priceWithMarkup = withMarkup(original.price?.SPxM, original.billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => {
      const priceWithMarkup = withMarkup(original.price?.SPxY, original.billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => <ItemStatusBadge status={original.item?.status as any} />
  },
];

export function Items() {
  const { id } = useParams<{ id: string }>();
  const { order } = useOrder(id!);
  const { billingConfig } = useBillingConfigByAgreement(order?.agreement?.id!);

  const [columnSizing, setColumnSizing] = useState({});

  if (!order) return <>Loading...</>;

  const lines = order.lines || [];

  if (lines.length === 0) return <>No Items found.</>;

  const itemsWithConfig: ItemRow[] = lines.map((line) => ({ ...line, billingConfig }));

  const table = useReactTable({
    data: itemsWithConfig,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

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
