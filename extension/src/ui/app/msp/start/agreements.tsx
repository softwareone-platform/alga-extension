import { useAgreements, AgreementStatusBadge } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useState } from "react";
import { Card } from "@ui/card";
import { Agreement, AgreementStatus } from "@swo/mp-api-model";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { withMarkup } from "@features/markup";
import { ConsumerLink, useConsumer } from "@features/consumers";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";
import { useNavigate } from "react-router";

const NameCell = ({
  name,
  id,
  status,
}: {
  name?: string | null;
  id: string;
  status?: AgreementStatus | null;
}) => {
  return (
    <div className="grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2 w-full">
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {name ?? "—"}
      </span>
      <span className="row-span-2 justify-self-end">
        <AgreementStatusBadge status={status} />
      </span>
      <span className="text-xs text-text-500 truncate">{id}</span>
    </div>
  );
};

const ConsumerCell = ({ agreementId }: { agreementId?: string }) => {
  const { billingConfig } = useBillingConfigByAgreement(agreementId);
  const { consumer } = useConsumer(billingConfig?.consumerId);
  return <ConsumerLink id={consumer?.id!} name={consumer?.name!} />;
};

const BillingConfigIdCell = ({ agreementId }: { agreementId?: string }) => {
  const { billingConfig } = useBillingConfigByAgreement(agreementId);
  return <span>{billingConfig?.id || "—"}</span>;
};

const MarkupCell = ({ agreementId }: { agreementId?: string }) => {
  const { billingConfig } = useBillingConfigByAgreement(agreementId);
  return <span>{billingConfig?.markup ? `${billingConfig.markup}%` : "—"}</span>;
};

const PriceWithMarkupCell = ({ agreementId, price }: { agreementId?: string; price?: number | null }) => {
  const { billingConfig } = useBillingConfigByAgreement(agreementId);
  return <span>{withMarkup(price, billingConfig?.markup)}</span>;
};

const OperationsCell = ({ agreementId }: { agreementId?: string }) => {
  const { billingConfig } = useBillingConfigByAgreement(agreementId);
  if (billingConfig?.operations === "managed") return <span>Managed</span>;
  if (billingConfig?.operations === "self-service") return <span>Self-service</span>;
  return <span>—</span>;
};

const columns: ColumnDef<Agreement>[] = [
  {
    accessorKey: "name",
    header: "Name",
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <NameCell name={original.name} id={original.id!} status={original.status} />
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
    cell: ({ row: { original } }) => <BillingConfigIdCell agreementId={original.id} />,
  },
  {
    accessorKey: "consumer",
    header: "Consumer",
    minSize: 100,
    size: 160,
    cell: ({ row: { original } }) => <ConsumerCell agreementId={original.id} />,
  },
  {
    accessorKey: "spxy",
    header: "SPxY",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => <span>{original.price?.SPxY || "—"}</span>,
  },
  {
    accessorKey: "markup",
    header: "Markup",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => <MarkupCell agreementId={original.id} />,
  },
  {
    accessorKey: "rpxy",
    header: "RPxY",
    minSize: 100,
    size: 100,
    cell: ({ row: { original } }) => (
      <PriceWithMarkupCell agreementId={original.id} price={original.price?.SPxY} />
    ),
  },
  {
    accessorKey: "operations",
    header: "Operations",
    minSize: 120,
    size: 120,
    cell: ({ row: { original } }) => <OperationsCell agreementId={original.id} />,
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
  const { agreements, pagination, isFetching } = useAgreements({ offset });
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
        <Pagination
          onPageChange={(page) => setOffset((page - 1) * (pagination.limit ?? 0))}
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableContainer>
    </Card>
  );
}
