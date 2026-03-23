import { Button } from "@alga-psa/ui-kit";
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
import { Price, PriceWithMarkup } from "@features/price";
import { useForm } from "react-hook-form";
import type { Subscription, AgreementLine, Order } from "@swo/mp-api-model";
import { useSubscriptionUpdate } from "./hooks";
import { useAgreement } from "../agreements";
import { OrderStatusBadge } from "@features/orders/status-badge";
import { useNavigate } from "react-router";

type ManageFormValues = {
  lines: Record<string, number>;
};

function OrderConfirmation({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const onViewOrder = () => {
    navigate(`/orders/${order.id}`);
    onClose();
  };

  return (
    <>
      <p className="text-sm text-text-700">
        Your order has been confirmed. Below is the order number. You can click to see more
        details or continue to the orders page.
      </p>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">Order</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-base font-medium">{order.id}</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={onViewOrder}>
          View order
        </Button>
      </div>
    </>
  );
}

function SubscriptionManagementForm({
  subscription,
  onClose,
  onSuccess,
}: {
  subscription: Subscription;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}) {
  const { billingConfig } = useBillingConfigByAgreement(subscription.agreement?.id!);
  const { updateSubscriptionAsync, isPending } = useSubscriptionUpdate(subscription);

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

  const onSubmit = async (data: ManageFormValues) => {
    const hasChanges = items.some(
      (line) => data.lines[line.id!] !== defaultValues.lines[line.id!]
    );

    if (!hasChanges) {
      onClose();
      return;
    }

    const order = await updateSubscriptionAsync(Object.entries(data.lines).map(([id, quantity]) => ({
      id,
      quantity,
    })));

    onSuccess(order);
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
          <Price currency={original.price?.currency} value={original.price?.SPxM} />
        ),
      },
      {
        accessorKey: "spxy",
        header: "SPxY",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <Price currency={original.price?.currency} value={original.price?.SPxY} />
        ),
      },
      {
        accessorKey: "rpxm",
        header: "RPxM",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <PriceWithMarkup currency={original.price?.currency} value={original.price?.SPxM} markup={billingConfig?.markup} />
        ),
      },
      {
        accessorKey: "rpxy",
        header: "RPxY",
        minSize: 100,
        size: 120,
        cell: ({ row: { original } }) => (
          <PriceWithMarkup currency={original.price?.currency} value={original.price?.SPxY} markup={billingConfig?.markup} />
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
    <>
      {isPending && <div className="fixed inset-0 z-[9999] bg-transparent" />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TableContainer>
          <div className="w-full overflow-x-scroll relative">
            <table
              style={{ width: table.getTotalSize(), minWidth: '100%' }}
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
          <Button type="submit" disabled={isPending}>{isPending ? "Placing order..." : "Place Order"}</Button>
        </div>
      </form>
    </>
  );
}

export function SubscriptionManagementDialog({
  isOpen,
  onClose,
  subscription,
}: {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}) {
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogPanel className="w-[90vw]">
        <DialogTitle onClose={handleClose}>
          {confirmedOrder ? "Order confirmation" : "Manage Subscription"}
        </DialogTitle>
        {confirmedOrder ? (
          <OrderConfirmation order={confirmedOrder} onClose={handleClose} />
        ) : (
          <SubscriptionManagementForm
            subscription={subscription}
            onClose={handleClose}
            onSuccess={setConfirmedOrder}
          />
        )}
      </DialogPanel>
    </Dialog>
  );
}

export function SubscriptionManagement({
  subscription,
}: {
  subscription: Subscription;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { agreement } = useAgreement(subscription?.agreement?.id!);

  const canManage = agreement?.status === "Active" && subscription.lines && subscription.lines.length > 0;

  if (!canManage) return <></>;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Manage</Button>
      <SubscriptionManagementDialog
        subscription={subscription}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
