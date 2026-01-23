import { useState } from "react";
import { Card } from "@ui/card";
import { useNavigate, useParams } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table-next";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useSubscriptionOrders } from "@features/subscriptions";
import { withMarkup } from "@features/markup";
import { OrderStatusBadge } from "@features/orders";
import { formatDateTime } from "@features/dates";
import { Order } from "@swo/mp-api-model";
import { ConsumerLink, useConsumer } from "@features/consumers";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <span className="text-blue-500 hover:text-blue-600 truncate">
        {original.id}
      </span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.type || "—"}</span>
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    minSize: 160,
    size: 160,
    cell: ({ row: { original } }) => <span>{original.agreement?.name || "—"}</span>
  },
  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 160,
    size: 160,
    cell: ({ row: { original } }) => <span>{original.product?.name || "—"}</span>
  },
  {
    accessorKey: 'consumer',
    header: 'Customer',
    minSize: 160,
    size: 160,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.agreement?.id);
      const { consumer } = useConsumer(billingConfig?.consumerId!);
      return <ConsumerLink id={consumer?.id!} name={consumer?.name!} />;
    }
  },
  {
    accessorKey: 'spxy',
    header: 'SPxY',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => <span>{original.price?.SPxY || "—"}</span>
  },
  {
    accessorKey: 'markup',
    header: 'Markup',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.agreement?.id);
      return <span>{billingConfig?.markup ? `${billingConfig.markup}%` : "—"}</span>;
    }
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.agreement?.id);
      const priceWithMarkup = withMarkup(original.price?.SPxY, billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
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
    minSize: 140,
    size: 160,
    cell: ({ row: { original } }) => (
      <span>{formatDateTime(original.audit?.created?.at) || "—"}</span>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 120,
    size: 140,
    cell: ({ row: { original } }) => <OrderStatusBadge status={original.status} />
  },
];

export function Orders() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching, isPending } = useSubscriptionOrders(
    id!,
    { offset }
  );
  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: orders ?? [],
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (isPending) return <></>;

  if (orders.length === 0) return <>No orders found.</>;

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
          onPageChange={(page) =>
            setOffset((page - 1) * (pagination.limit ?? 0))
          }
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableContainer>
    </Card>
  );
}
