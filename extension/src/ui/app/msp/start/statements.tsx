import { useState } from "react";
import { Card } from "@ui/card";
import { useStatements } from "@features/statements";
import { InvoiceStatus, Statement } from "@/shared/statements";
import { Badge } from "@alga-psa/ui-kit";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Agreement } from "@/ui/features/agreements";
import { Product } from "@/ui/features/products";
import { ConsumerLink, useConsumer } from "@/ui/features/consumers";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { withMarkup } from "@/ui/features/markup";
import { Pagination, TableContainer } from "@/ui/ui/table-next";

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
    size: 192,
    cell: ({ row: { original: { id } } }) => <span className="block text-sm text-blue-500 hover:text-blue-600 truncate">{id}</span>
  },
  {
    accessorKey: 'statementType',
    header: 'Statement Type',
    size: 150,
    cell: ({ row: { original: { type } } }) => <span>{type || "—"}</span>
  },
  {
    accessorKey: 'agreement',
    header: 'Agreement',
    cell: ({ row: { original: { agreement } } }) => <Agreement name={agreement?.name} id={agreement?.id} />
  },

  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row: { original: { product } } }) => <Product name={product?.name} iconUrl={product?.icon} />
  },
  {
    accessorKey: 'consumer',
    header: 'Consumer',
    cell: ({ row: { original: { agreement } } }) => {
      const { billingConfig } = useBillingConfigByAgreement(agreement?.id);
      const { consumer } = useConsumer(billingConfig?.consumerId);
      return <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
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
    cell: ({ row: { original: { price } } }) => <span>{price?.totalSP || "—"}</span>
  },
  {
    accessorKey: 'markup',
    header: 'Markup',
    cell: ({ row: { original: { price } } }) => <span>{price?.markup ? `${price.markup}%` : "—"}</span>
  },
  {
    accessorKey: 'totalRP',
    header: 'Total RP',
    cell: ({ row: { original: { price } } }) => {
      const priceWithMarkup = withMarkup(price?.totalSP, price?.markup);
      return <span>{priceWithMarkup || "—"}</span>
    }
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
    cell: ({ row: { original: { price } } }) => <span>{price?.currency?.sale || "—"}</span>
  },
  {
    accessorKey: 'algaInvoiceStatus',
    header: 'Alga Invoice Status',
    cell: ({ row: { original: { algaInvoiceStatus } } }) => <AlgaInvoiceStatusBadge status={algaInvoiceStatus} />
  }
];

export function Statements() {
  const [offset, setOffset] = useState(0);
  const { statements: data, pagination, isFetching } = useStatements({ offset });

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
    <Card className="w-fit min-w-full">
      <TableContainer>
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
              <tr key={row.id} className="border-border-200 border-b text-sm text-text-700">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{ width: cell.column.getSize() }} className="py-3 px-6  items-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
