import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { OrderStatusBadge, useAgreementOrders } from "@features/agreements";
import { useParams, useNavigate } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Price, PriceWithMarkup } from "@features/price";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { formatDateTime } from "@features/dates";
import { Order } from "@swo/mp-api-model";
import { BillingConfig } from "@/shared/billing-configs";

type OrderRow = Order & { billingConfig?: BillingConfig | null };

const columns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: 'id',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <span className="block truncate text-blue-500 hover:text-blue-600">
        {original.id}
      </span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span className="truncate block">{original.type || "—"}</span>
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    minSize: 100,
    size: 120,
    cell: () => <span className="truncate block">CONSUMER</span>
  },
  {
    accessorKey: 'spxy',
    header: 'SPxY',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <Price currency={original.price?.currency} value={original.price?.SPxY} />
  },
  {
    accessorKey: 'markup',
    header: 'Markup',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => (
      <span>{original.billingConfig?.markup ? `${original.billingConfig.markup}%` : "—"}</span>
    )
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => (
      <PriceWithMarkup currency={original.price?.currency} value={original.price?.SPxY} markup={original.billingConfig?.markup} />
    )
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.currency || "—"}</span>
  },
  {
    accessorKey: 'created',
    header: 'Created',
    minSize: 120,
    size: 150,
    cell: ({ row: { original } }) => (
      <span className="truncate block">{original.audit?.created?.at ? formatDateTime(original.audit.created.at) : "—"}</span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => <OrderStatusBadge status={original.status} />
  },
];

export function Orders() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching, isPending } = useAgreementOrders(
    id!,
    {
      offset,
    }
  );
  const { billingConfig } = useBillingConfigByAgreement(id!);

  const [columnSizing, setColumnSizing] = useState({});

  const ordersWithConfig = useMemo<OrderRow[]>(
    () => orders?.map((order) => ({ ...order, billingConfig })) ?? [],
    [orders, billingConfig]
  );

  const table = useReactTable({
    data: ordersWithConfig,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (isPending) return <></>;

  if (orders.length === 0) return <>No Orders found.</>;

  return (
    <Card>
      <TableContainer>
        <div className="w-full overflow-x-scroll relative">
          <table style={{ width: table.getTotalSize(), minWidth: '100%' }} className="relative table-fixed">
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
                  onClick={() => navigate(`/orders/${row.original.id}`)}
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
