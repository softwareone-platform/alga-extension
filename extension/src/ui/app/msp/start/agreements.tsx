import { useAgreements, AgreementStatusBadge } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useState } from "react";
import { Card } from "@ui/card";
import { Agreement } from "@swo/mp-api-model";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Price, PriceWithMarkup } from "@features/price";
import { useConsumer } from "@features/consumers";
import { Link } from "@/ui/ui/link";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { useNavigate } from "react-router";
import { Loader } from "@/ui/ui";

const columns: ColumnDef<Agreement>[] = [
  {
    accessorKey: "name",
    header: "Name",
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <div className="grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2 w-full">
        <span className="block text-sm text-blue-500 hover:text-blue-600 truncate">
          {original.name ?? "—"}
        </span>
        <span className="row-span-2 justify-self-end">
          <AgreementStatusBadge status={original.status} />
        </span>
        <span className="block text-xs text-text-500 truncate">{original.id}</span>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: "Product",
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <ProductCell name={original.product?.name} iconUrl={original.product?.icon} />
    ),
  },
  {
    accessorKey: "billingConfigId",
    header: "Billing config ID",
    minSize: 120,
    size: 160,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.id);
      return <span className="truncate block">{billingConfig?.id || "—"}</span>;
    },
  },
  {
    accessorKey: "consumer",
    header: "Consumer",
    minSize: 100,
    size: 160,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.id);
      const { consumer } = useConsumer(billingConfig?.consumerId);
      return <Link to={consumer?.id ? `/consumers/${consumer.id}` : undefined}>{consumer?.name}</Link>;
    },
  },
  {
    accessorKey: "spxy",
    header: "SPxY",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => <Price currency={original.price?.currency} value={original.price?.SPxY} />,
  },
  {
    accessorKey: "markup",
    header: "Markup",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.id);
      return <span>{billingConfig?.markup ? `${billingConfig.markup}%` : "—"}</span>;
    },
  },
  {
    accessorKey: "rpxy",
    header: "RPxY",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.id);
      return <PriceWithMarkup currency={original.price?.currency} value={original.price?.SPxY} markup={billingConfig?.markup} />;
    },
  },
  {
    accessorKey: "operations",
    header: "Operations",
    minSize: 120,
    size: 120,
    cell: ({ row: { original } }) => {
      const { billingConfig } = useBillingConfigByAgreement(original.id);
      if (billingConfig?.operations === "managed") return <span className="truncate block">Managed</span>;
      if (billingConfig?.operations === "self-service") return <span className="truncate block">Self-service</span>;
      return <span>—</span>;
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.currency || "—"}</span>,
  },
];

export function Agreements() {
  const [offset, setOffset] = useState(0);
  const { agreements, pagination, isFetching, isPending } = useAgreements({ offset });
  const navigate = useNavigate();

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: agreements ?? [],
    columns,
    columnResizeMode: "onChange",
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
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-border-200 border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="relative py-3 px-6 text-left text-xs font-medium tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        style={{
                          background: header.column.getIsResizing() ? "#2563eb" : "transparent",
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-border-200 border-b text-sm text-text-700 cursor-pointer hover:bg-primary-50" onClick={() => navigate(`/agreements/${row.original.id}`)}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="py-3 px-6 items-center"
                    >
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
          onPageChange={(page) => setOffset((page - 1) * (pagination.limit ?? 0))}
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableContainer>
    </Card>
  );
}
