import { forwardRef, HTMLAttributes, useState } from "react";
import { Card } from "@ui/card";
import { useStatements } from "@features/statements";
import { InvoiceStatus, Statement } from "@/shared/statements";
import { Badge } from "@alga-psa/ui-kit";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/ui/ui";
import { cn } from "@/ui/utils";
import { Agreement } from "@/ui/features/agreements";
import { Product } from "@/ui/features/products";
import { ConsumerLink, useConsumer } from "@/ui/features/consumers";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { withMarkup } from "@/ui/features/markup";

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
    <Card>
      <table style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ width: header.getSize(), position: 'relative' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: '5px',
                      cursor: 'col-resize',
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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length}>
              <Pagination
                onPageChange={(page) =>
                  setOffset((page - 1) * (pagination.limit ?? 0))
                }
                totalItems={pagination.total ?? 0}
                isLoading={isFetching}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
}


export type PaginationProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  onPageChange: (page: number) => void;
  startPage?: number;
  pageSize?: number;
  totalItems: number;
  isLoading?: boolean;
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      onPageChange,
      startPage,
      pageSize,
      totalItems,
      className,
      isLoading,
      ...props
    },
    ref
  ) => {
    const totalPages = Math.ceil(totalItems / (pageSize ?? 10)) || 1;
    const [page, setPage] = useState(startPage ?? 1);

    const setCurrentPage = (page: number) => {
      setPage(page);
      onPageChange(page);
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex justify-between items-center w-full",
          className
        )}
      >
        <Button
          variant="white"
          onClick={() => setCurrentPage(Math.max(page - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm text-text-700">
          Page {page} of {totalPages} ({totalItems} total records)
        </span>
        <Button
          variant="white"
          onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    );
  }
);