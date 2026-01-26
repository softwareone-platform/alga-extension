import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { useParams } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { withMarkup } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useStatement, useStatementCharges } from "@features/statements";
import { formatDateTime } from "@features/dates";
import { Charge } from "@swo/mp-api-model/billing";
import { BillingConfig } from "@/shared/billing-configs";

type ChargeRow = Charge & { billingConfig?: BillingConfig | null };

const columns: ColumnDef<ChargeRow>[] = [
  {
    accessorKey: 'id',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => <span>{original.id}</span>
  },
  {
    accessorKey: 'subscription',
    header: 'Subscription',
    minSize: 160,
    size: 200,
    cell: ({ row: { original } }) => {
      const { subscription } = original;
      if (!subscription?.name) return <span>—</span>;
      return (
        <div className="flex flex-col gap-0.5 items-start relative w-full">
          <span className="block truncate w-full">{subscription?.name || "—"}</span>
          <span className="block text-xs text-text-500 truncate w-full">{subscription?.id || "—"}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'item',
    header: 'Item',
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
    accessorKey: 'startDate',
    header: 'Start Date',
    minSize: 120,
    size: 150,
    cell: ({ row: { original } }) => (
      <span>{original.period?.start ? formatDateTime(original.period.start) : "—"}</span>
    )
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    minSize: 120,
    size: 150,
    cell: ({ row: { original } }) => (
      <span>{original.period?.end ? formatDateTime(original.period.end) : "—"}</span>
    )
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.quantity || "—"}</span>
  },
  {
    accessorKey: 'rp',
    header: 'RP',
    minSize: 100,
    size: 128,
    cell: ({ row: { original } }) => {
      const priceWithMarkup = withMarkup(original.price?.SPx1, original.billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
];

export function Charges() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { statement } = useStatement(id!);
  const { charges, pagination, isFetching, isPending } = useStatementCharges(
    id!,
    {
      offset,
    }
  );
  const { billingConfig } = useBillingConfigByAgreement(
    statement?.agreement?.id!
  );

  const [columnSizing, setColumnSizing] = useState({});

  const chargesWithConfig = useMemo<ChargeRow[]>(
    () => charges?.map((charge) => ({ ...charge, billingConfig })) ?? [],
    [charges, billingConfig]
  );

  const table = useReactTable({
    data: chargesWithConfig,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (isPending) return <></>;

  if (charges.length === 0) return <>No Charges found.</>;

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
        <Pagination
          onPageChange={(page: number) =>
            setOffset((page - 1) * (pagination.limit ?? 0))
          }
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableContainer>
    </Card>
  );
}
