import { memo, useMemo, useState } from "react";
import { Card } from "@ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui/loader";
import { useAgreements, AgreementStatusBadge } from "@features/agreements";
import { ProductCell } from "@features/products";
import { Agreement, AgreementStatus } from "@swo/mp-api-model";
import { PriceWithMarkup } from "@features/price";
import { useBillingConfigs } from "@/ui/features/billing-config";
import { BillingConfig } from "@/shared/billing-configs";
import { useNavigate } from "react-router";

type AgreementRow = Agreement & { billingConfig?: BillingConfig };

const NameCell = memo(function NameCell({
  name,
  id,
  status,
}: {
  name?: string | null;
  id: string;
  status?: AgreementStatus | null;
}) {
  return (
    <div className="grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2 w-full">
      <span className="text-sm text-blue-500 hover:text-blue-600 block truncate">
        {name ?? "—"}
      </span>
      <span className="row-span-2 justify-self-end">
        <AgreementStatusBadge status={status} />
      </span>
      <span className="text-xs text-text-500 block truncate">{id}</span>
    </div>
  );
});

const columns: ColumnDef<AgreementRow>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 200,
    size: 280,
    cell: ({ row: { original } }) => (
      <NameCell
        name={original.name}
        id={original.id!}
        status={original.status}
      />
    )
  },
  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 160,
    size: 200,
    cell: ({ row: { original } }) => (
      <ProductCell name={original.product?.name} iconUrl={original.product?.icon} />
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
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.currency || "—"}</span>
  },
];

export function Agreements() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const { billingConfigs } = useBillingConfigs();
  const billingConfigsById =
    useMemo(
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

  const agreementsIds = useMemo(() => Object.keys(billingConfigsById), [billingConfigsById]);

  const { agreements, pagination, isFetching, isPending } = useAgreements(
    { offset },
    agreementsIds
  );

  console.log(agreements, pagination, isFetching, isPending);

  const [columnSizing, setColumnSizing] = useState({});

  const data = useMemo(() => agreements.map(agreement => ({
    ...agreement,
    billingConfig: billingConfigsById[agreement.id!]
  })), [agreements, billingConfigsById]);

  const table = useReactTable({
    data,
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
                  onClick={() => navigate(`/agreements/${row.original.id}`)}
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
