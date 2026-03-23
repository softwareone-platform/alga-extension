import { useState } from "react";
import { Card } from "@alga-psa/ui-kit";
import { useStatements } from "@features/statements";
import { InvoiceStatus, Statement } from "@/shared/statements";
import { Badge } from "@alga-psa/ui-kit";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Agreement } from "@/ui/features/agreements";
import { ProductCell } from "@/ui/features/products";
import { useConsumer } from "@/ui/features/consumers";
import { Link } from "@/ui/ui/link";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { Price, PriceWithMarkup } from "@features/price";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui";
import { useNavigate } from "react-router";

export const AlgaInvoiceStatusBadge = ({
  status,
}: {
  status?: InvoiceStatus;
}) => {
  if (!status) return <></>;

  if (status === "no-invoice")
    return <Badge tone={"default"}>Cannot invoice</Badge>;
  if (status === "to-invoice")
    return <Badge tone={"warning"}>To invoice</Badge>;
  if (status === "invoiced") return <Badge tone={"success"}>Invoiced</Badge>;

  return <></>;
};

const columns: ColumnDef<Statement>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original: { id } } }) => <span className="block text-sm text-blue-500 hover:text-blue-600 truncate">{id}</span>
  },
  {
    accessorKey: 'statementType',
    header: 'Statement Type',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { type } } }) => <span>{type || "—"}</span>
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { agreement } } }) => <Agreement name={agreement?.name} id={agreement?.id} />
  },

  {
    accessorKey: 'product',
    header: 'Product',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { product } } }) => <ProductCell name={product?.name} iconUrl={product?.icon} />
  },
  {
    accessorKey: 'consumer',
    header: 'Consumer',
    minSize: 160,
    size: 160,
    cell: ({ row: { original: { agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      const { consumer } = useConsumer(billingConfig?.consumerId);
      return <Link to={consumer?.id ? `/consumers/${consumer.id}` : undefined}>{consumer?.name}</Link>
    }
  },
  {
    accessorKey: 'invoice',
    header: 'Invoice',
    cell: () => <span>todo</span>
  },
  {
    accessorKey: 'totalSP',
    header: 'Total SP',
    minSize: 128,
    size: 128,
    cell: ({ row: { original: { price } } }) => <Price currency={price?.currency?.sale} value={price?.totalSP} />
  },
  {
    accessorKey: 'markup',
    header: 'Markup',
    minSize: 128,
    size: 128,
    cell: ({ row: { original: { agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      return <span>{billingConfig?.markup ? `${billingConfig.markup}%` : "—"}</span>
    }
  },
  {
    accessorKey: 'totalRP',
    header: 'Total RP',
    minSize: 128,
    size: 128,
    cell: ({ row: { original: { price } } }) => (
      <PriceWithMarkup currency={price?.currency?.sale} value={price?.totalSP} markup={price?.markup} />
    )
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    minSize: 128,
    size: 128,
    cell: ({ row: { original: { price } } }) => <span>{price?.currency?.sale || "—"}</span>
  },
  {
    accessorKey: 'algaInvoiceStatus',
    header: 'Alga Invoice Status',
    minSize: 180,
    size: 180,
    cell: ({ row: { original: { algaInvoiceStatus } } }) => <AlgaInvoiceStatusBadge status={algaInvoiceStatus} />
  }
];

export function Statements() {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const { statements: data, pagination, isFetching, isPending } = useStatements({ offset });

  const [columnSizing, setColumnSizing] = useState({});

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
                  onClick={() => navigate(`/statements/${row.original.id}`)}
                  className="border-border-200 border-b text-sm text-text-700 cursor-pointer hover:bg-primary-50"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ width: cell.column.getSize() }} className="py-3 px-6  items-center">
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
