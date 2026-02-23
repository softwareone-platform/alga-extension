import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui/loader";
import { PriceWithMarkup } from "@features/price";
import {
  useSubscriptions,
  SubscriptionStatusBadge,
  BILLING_PERIODS,
} from "@features/subscriptions";
import { Agreement } from "@features/agreements";
import { ProductCell } from "@features/products";
import { BillingConfig } from "@/shared/billing-configs";
import { Subscription } from "@swo/mp-api-model";
import { useBillingConfigs } from "@/ui/features/billing-config/hooks";
import { useNavigate } from "react-router";

type SubscriptionRow = Subscription & { billingConfig?: BillingConfig };

const columns: ColumnDef<SubscriptionRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <span className="text-sm text-blue-500 hover:text-blue-600 block truncate">{original.name || "—"}</span>
    )
  },
  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 100,
    size: 160,
    cell: ({ row: { original } }) => (
      <ProductCell name={original.product?.name} iconUrl={original.product?.icon} />
    )
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    minSize: 160,
    size: 160,
    cell: ({ row: { original } }) => (
      <Agreement name={original.agreement?.name} id={original.agreement?.id} />
    )
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 100,
    size: 128,
    cell: ({ row: { original } }) => (
      <PriceWithMarkup currency={original.price?.currency} value={original.price?.SPxY} markup={original.billingConfig?.markup} />
    )
  },
  {
    accessorKey: 'billingPeriod',
    header: 'Billing period',
    minSize: 100,
    size: 128,
    cell: ({ row: { original } }) => (
      <span>
        {original.terms?.period
          ? BILLING_PERIODS[original.terms?.period]
          : "—"}
      </span>
    )
  },
  {
    accessorKey: 'commitment',
    header: 'Commitment',
    minSize: 100,
    size: 128,
    cell: ({ row: { original } }) => <span>{original.terms?.commitment || "—"}</span>
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.currency || "—"}</span>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    minSize: 100,
    size: 120,
    cell: ({ row: { original } }) => <SubscriptionStatusBadge status={original.status} />
  },
];

export function Subscriptions() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const { billingConfigs } = useBillingConfigs();
  const billingConfigsById = useMemo(
    () =>
      billingConfigs?.reduce(
        (acc, billingConfig) => ({
          ...acc,
          [billingConfig.agreementId!]: billingConfig,
        }),
        {} as Record<string, BillingConfig>
      ) ?? {},
    [billingConfigs]
  );

  const { subscriptions, pagination, isFetching, isPending } = useSubscriptions(
    {
      offset,
    },
    Object.keys(billingConfigsById)
  );

  const [columnSizing, setColumnSizing] = useState({});

  const subscriptionsWithConfig = useMemo<SubscriptionRow[]>(
    () =>
      subscriptions?.map((subscription) => ({
        ...subscription,
        billingConfig: billingConfigsById[subscription.agreement?.id!],
      })) ?? [],
    [subscriptions, billingConfigsById]
  );

  const table = useReactTable({
    data: subscriptionsWithConfig,
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
