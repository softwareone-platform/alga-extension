import { Button } from "@ui/button";
import { Dialog, DialogPanel, DialogTitle } from "@/ui/ui";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableContainer } from "@/ui/ui/table";
import {
  useBillingConfigByAgreement,
} from "@features/billing-config";
import { withMarkup } from "@features/markup";
import { useForm } from "react-hook-form";
import type { Subscription, AgreementLine } from "@swo/mp-api-model";

type ManageFormValues = {
  lines: Record<string, number>;
};

export function SubscriptionManage({
  isOpen,
  onClose,
  subscription,
}: {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}) {
  const { billingConfig } = useBillingConfigByAgreement(
    subscription.agreement?.id!
  );

  const items = subscription.lines || [];

  const defaultValues = useMemo<ManageFormValues>(
    () => ({
      lines: Object.fromEntries(
        items.map((line) => [line.id!, line.quantity ?? 0])
      ),
    }),
    [items]
  );

  const { register, handleSubmit } = useForm<ManageFormValues>({
    defaultValues,
  });

  const onSubmit = (data: ManageFormValues) => {
    console.log("New quantities:", data.lines);
  };

  const columns: ColumnDef<AgreementLine>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        minSize: 160,
        size: 192,
        cell: ({ row: { original } }) => (
          <span>{original.item?.name || "—"}</span>
        ),
      },
      {
        accessorKey: "currentQty",
        header: "Current Qty",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <span>{original.quantity || "—"}</span>
        ),
      },
      {
        accessorKey: "newQty",
        header: "New Qty",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <input
            type="number"
            min={original.quantity}
            {...register(`lines.${original.id!}`, {
              valueAsNumber: true,
              min: original.quantity ?? 0,
            })}
            className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
          />
        ),
      },
      {
        accessorKey: "unit",
        header: "Unit",
        minSize: 80,
        size: 100,
        cell: ({ row: { original } }) => (
          <span>{original.item?.unit?.name || "—"}</span>
        ),
      },
      {
        accessorKey: "spxm",
        header: "SPxM",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <span>{original.price?.SPxM || "—"}</span>
        ),
      },
      {
        accessorKey: "spxy",
        header: "SPxY",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <span>{original.price?.SPxY || "—"}</span>
        ),
      },
      {
        accessorKey: "rpxm",
        header: "RPxM",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <span>{withMarkup(original.price?.SPxM, billingConfig?.markup)}</span>
        ),
      },
      {
        accessorKey: "rpxy",
        header: "RPxY",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <span>{withMarkup(original.price?.SPxY, billingConfig?.markup)}</span>
        ),
      },
    ],
    [billingConfig?.markup, register]
  );

  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: items,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogPanel className="w-[90vw]">
        <DialogTitle onClose={onClose}>Manage Subscription</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer>
            <div className="w-full overflow-x-scroll relative">
              <table
                style={{ width: table.getTotalSize() }}
                className="relative table-fixed"
              >
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-border-200 border-b">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="relative py-3 px-6 text-left text-xs font-medium tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                            style={{
                              background: header.column.getIsResizing()
                                ? "#2563eb"
                                : "transparent",
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-border-200 border-b text-sm text-text-700"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="py-3 px-6 items-center"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableContainer>

          <div className="flex justify-end gap-6 mt-4">
            <Button type="submit">Place Order</Button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  );
}