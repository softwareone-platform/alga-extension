import { useState } from "react";
import { Card } from "@alga-psa/ui-kit";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui";
import { Price, PriceWithMarkup } from "@features/price";
import {
  useSubscriptions,
  SubscriptionStatusBadge,
  BILLING_PERIODS,
} from "@features/subscriptions";
import { Agreement } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { useConsumer } from "@features/consumers";
import { Link } from "@/ui/ui/link";
import { Subscription } from "@swo/mp-api-model";
import { useNavigate } from "react-router";

const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original: { name } } }) => (
      <span className="block truncate">{name || "—"}</span>
    )
  },
  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 100,
    size: 160,
    cell: ({ row: { original: { product } } }) => (
      <ProductCell name={product?.name} iconUrl={product?.icon} />
    )
  },
  {
    accessorKey: 'consumer',
    header: 'Consumer',
    minSize: 100,
    size: 160,
    cell: ({ row: { original: { agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      const { consumer } = useConsumer(billingConfig?.consumerId);
      return <Link to={consumer?.clientId ? `/consumers/${consumer.clientId}` : undefined}>{consumer?.clientName}</Link>;
    }
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    minSize: 100,
    size: 160,
    cell: ({ row: { original: { agreement } } }) => (
      <Agreement name={agreement?.name} id={agreement?.id} />
    )
  },
  {
    accessorKey: 'spxy',
    header: 'SPxY',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { price } } }) => <Price currency={price?.currency} value={price?.SPxY} />
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
      return <PriceWithMarkup currency={price?.currency} value={price?.SPxY} markup={billingConfig?.markup} />;
    }
  },
  {
    accessorKey: 'billingPeriod',
    header: 'Billing period',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { terms } } }) => (
      <span>{terms?.period ? BILLING_PERIODS[terms.period] : "—"}</span>
    )
  },
  {
    accessorKey: 'commitment',
    header: 'Commitment',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { terms } } }) => <span>{terms?.commitment || "—"}</span>
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 100,
    size: 128,
    cell: ({ row: { original: { price } } }) => <span>{price?.currency || "—"}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 100,
    size: 120,
    cell: ({ row: { original: { status } } }) => <SubscriptionStatusBadge status={status} />
  },
];

export function Subscriptions() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const { subscriptions, pagination, isFetching, isPending } = useSubscriptions({
    offset,
  });

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: subscriptions ?? [],
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
                  onClick={() => navigate(`/subscriptions/${row.original.id}`)}
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
