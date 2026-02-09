import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui/loader";
import { withMarkup } from "@features/markup";
import { useStatements } from "@features/statements";
import { Agreement } from "@features/agreements";
import { ProductCell } from "@features/products";
import { BillingConfig } from "@/shared/billing-configs";
import { Statement } from "@swo/mp-api-model/billing";
import { useBillingConfigs } from "@/ui/features/billing-config/hooks";
import { useNavigate } from "react-router";

type StatementRow = Statement & { billingConfig?: BillingConfig };

const columns: ColumnDef<StatementRow>[] = [
  {
    accessorKey: 'id',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <span className="text-sm text-blue-500 hover:text-blue-600 block truncate">
        {original.id!}
      </span>
    )
  },
  {
    accessorKey: 'type',
    header: 'Statement Type',
    minSize: 120,
    size: 150,
    cell: ({ row: { original } }) => <span>{original.type || "—"}</span>
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
    accessorKey: 'product',
    header: 'Product',
    minSize: 160,
    size: 160,
    cell: ({ row: { original } }) => (
      <ProductCell name={original.product?.name} iconUrl={original.product?.icon} />
    )
  },
  {
    accessorKey: 'invoice',
    header: 'Invoice',
    minSize: 100,
    size: 120,
    cell: () => <span></span>
  },
  {
    accessorKey: 'totalRP',
    header: 'Total RP',
    minSize: 100,
    size: 128,
    cell: ({ row: { original } }) => {
      const priceWithMarkup = withMarkup(original.price?.totalSP, original.billingConfig?.markup);
      return <span>{priceWithMarkup || "—"}</span>;
    }
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 80,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.currency?.sale || "—"}</span>
  },
];

export function Statements() {
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

  const { statements, pagination, isFetching, isPending } = useStatements({ offset });

  const [columnSizing, setColumnSizing] = useState({});

  const statementsWithConfig = useMemo<StatementRow[]>(
    () =>
      statements?.map((statement) => ({
        ...statement,
        billingConfig: billingConfigsById[statement.agreement?.id!],
      })) ?? [],
    [statements, billingConfigsById]
  );

  const table = useReactTable({
    data: statementsWithConfig,
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
                  onClick={() => navigate(`/statements/${row.original.id}`)}
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
