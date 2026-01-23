import { useState, useMemo } from "react";
import { Card } from "@ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table-next";
import {
  SubscriptionStatusBadge,
  useAgreementSubscriptions,
} from "@features/agreements";
import { Link, useParams, useNavigate } from "react-router";
import { TermsEntity, Subscription } from "@swo/mp-api-model";
import { withMarkup } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { BILLING_PERIODS } from "@features/subscriptions";

const getCommitmentText = (commitment: TermsEntity["commitment"]) => {
  if (commitment === "1m") return "1 month";
  if (commitment === "1y") return "1 year";
  if (commitment === "3y") return "3 years";
  return "—";
};

const createColumns = (markup: number | null | undefined): ColumnDef<Subscription>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 180,
    size: 220,
    cell: ({ row: { original } }) => (
      <div className="flex flex-col gap-0.5 items-start">
        <Link
          className="truncate text-blue-500 hover:text-blue-600"
          to={`/subscriptions/${original.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {original.name}
        </Link>
        <span className="text-xs text-text-500 truncate">
          {original.id}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'spxm',
    header: 'SPxM',
    minSize: 80,
    size: 100,
    cell: ({ row: { original: { price } } }) => <span>{price?.SPxM || "—"}</span>
  },
  {
    accessorKey: 'spxy',
    header: 'SPxY',
    minSize: 80,
    size: 100,
    cell: ({ row: { original: { price } } }) => <span>{price?.SPxY || "—"}</span>
  },
  {
    accessorKey: 'rpxm',
    header: 'RPxM',
    minSize: 80,
    size: 100,
    cell: ({ row: { original: { price } } }) => {
      const priceWithMarkup = withMarkup(price?.SPxM, markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'rpxy',
    header: 'RPxY',
    minSize: 80,
    size: 100,
    cell: ({ row: { original: { price } } }) => {
      const priceWithMarkup = withMarkup(price?.SPxY, markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'period',
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
    cell: ({ row: { original: { terms } } }) => (
      <span>{getCommitmentText(terms?.commitment)}</span>
    )
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 80,
    size: 100,
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
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { subscriptions, pagination, isFetching, isPending } =
    useAgreementSubscriptions(id!, { offset });
  const { billingConfig } = useBillingConfigByAgreement(id!);

  const columns = useMemo(() => createColumns(billingConfig?.markup), [billingConfig?.markup]);

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: subscriptions ?? [],
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (isPending) return <></>;

  if (subscriptions.length === 0) return <>No Subscriptons found.</>;

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
