import { useState } from "react";
import { Card } from "@ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui/loader";
import { OrderStatusBadge, useAgreementOrders } from "@features/agreements";
import { useParams, useNavigate } from "react-router";
import { withMarkup } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { Order } from "@swo/mp-api-model";
import dayjs from "dayjs";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original: { id } } }) => (
      <span className="block text-blue-500 hover:text-blue-600 truncate">
        {id}
      </span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    minSize: 80,
    size: 100,
    cell: ({ row: { original: { type } } }) => <span className="truncate block">{type || "—"}</span>
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    minSize: 100,
    size: 128,
    cell: () => <span className="truncate block">CONSUMER</span>
  },
  {
    accessorKey: 'spxy',
    header: 'SPxY',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { price } } }) => <span>{price?.SPxY || "—"}</span>
  },
  {
    accessorKey: 'markup',
    header: 'Markup',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      return <span>{billingConfig?.markup ? `${billingConfig.markup}%` : "—"}</span>;
    }
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { price, agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      const priceWithMarkup = withMarkup(price?.SPxY, billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { price } } }) => <span>{price?.currency || "—"}</span>
  },
  {
    accessorKey: 'created',
    header: 'Created',
    minSize: 120,
    size: 140,
    cell: ({ row: { original: { audit } } }) => {
      const dateTime = audit?.created?.at;
      if (!dateTime) return <span>—</span>;
      const date = dayjs(dateTime).format("MM/DD/YYYY");
      const time = dayjs(dateTime).format("HH:mm");
      return (
        <div className="flex flex-col gap-0.5 justify-center items-start">
          <span>{date}</span>
          <span className="text-xs text-text-500">{time}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 120,
    size: 140,
    cell: ({ row: { original: { status } } }) => <OrderStatusBadge status={status} />
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

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: orders ?? [],
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (!isPending && orders.length === 0) return <>No Orders found.</>;

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
        {isPending && (
          <div className="flex items-center justify-center py-3 px-6 border-b border-border-200">
            <Loader />
          </div>
        )}
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
