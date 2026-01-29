import { Button, LinkButton } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableContainer } from "@/ui/ui/table";
import {
  BillingConfigStatusBadge,
  useBillingConfigByAgreement,
} from "@features/billing-config";
import { withMarkup } from "@features/markup";
import {
  SubscriptionStatusBadge,
  useSubscription,
  BILLING_PERIODS,
} from "@features/subscriptions";
import { useConsumer } from "@features/consumers";
import { Link } from "@/ui/ui/link";
import { SWO_PORTAL_URL } from "@/ui/config";
import { Dialog, DialogPanel, DialogTitle } from "@/ui/ui";
import type { Subscription, AgreementLine } from "@swo/mp-api-model";

function SubscriptionSummary({ id }: { id: string }) {
  const { subscription, isPending: isSubscriptionPending } =
    useSubscription(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(subscription?.agreement?.id);
  const { consumer } = useConsumer(billingConfig?.consumerId!);

  const totalRP = useMemo(
    () => withMarkup(subscription?.price?.SPxY, billingConfig?.markup),
    [subscription?.price?.SPxY, billingConfig?.markup]
  );

  if (isSubscriptionPending || isBillingConfigPending)
    return <div>Loading...</div>;

  if (!subscription) return <></>;

  return (
    <Card className="flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Subscription ID
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{subscription.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={subscription.product?.icon}
            alt={subscription.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {subscription.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Billing config
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{billingConfig?.id || "—"}</span>
          <BillingConfigStatusBadge status={billingConfig?.status} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow text-sm">
          <Link to={consumer?.id ? `/consumers/${consumer.id}` : undefined}>{consumer?.name}</Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {subscription.price?.SPxY || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Markup</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {billingConfig?.markup ? `${billingConfig.markup}%` : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{totalRP}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Billing period
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {subscription.terms?.period
              ? BILLING_PERIODS[subscription.terms?.period]
              : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Commitment period
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {subscription.terms?.commitment || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {subscription.price?.currency || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Manage({
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
            defaultValue={original.quantity}
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
    [billingConfig?.markup]
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
          <Button onClick={() => alert("감사합니다.")}>Place Order</Button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}

export function Subscription() {
  const { id } = useParams<{ id: string }>();
  const { subscription, isPending } = useSubscription(id!);
  const [isManageOpen, setIsManageOpen] = useState(false);

  if (isPending) return <div>Loading...</div>;

  if (!subscription) return <div>Subscription not found</div>;

  const { status } = subscription;

  const canManage = subscription.lines && subscription.lines.length > 0;

  return (
    <>
      <div className="w-full flex flex-col p-6 gap-8">
        <header className="w-full flex justify-between gap-10">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-semibold">{subscription.name}</h1>
            {!!status && <SubscriptionStatusBadge status={status} />}
          </div>
          <div className="flex items-center gap-6">
            <Button onClick={() => setIsManageOpen(true)}>Manage</Button>
            <LinkButton
              variant="white"
              href={`${SWO_PORTAL_URL}/commerce/subscriptions/${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in SoftwareOne
            </LinkButton>
          </div>
        </header>
        <SubscriptionSummary id={id!} />
        {canManage && (
          <Manage
            subscription={subscription}
            isOpen={isManageOpen}
            onClose={() => setIsManageOpen(false)}
          />
        )}
        <Tabs>
          <NavLink to="items">
            {({ isActive }) => <Tabs.Tab isActive={isActive}>Items</Tabs.Tab>}
          </NavLink>
          <NavLink to="orders">
            {({ isActive }) => <Tabs.Tab isActive={isActive}>Orders</Tabs.Tab>}
          </NavLink>
          <NavLink to="details">
            {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
          </NavLink>
        </Tabs>
        <Outlet />
      </div>
    </>
  );
}
