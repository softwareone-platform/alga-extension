import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useMemo } from "react";
import { useBillingConfig } from "@features/billing-config";
import { withMarkup } from "@features/markup";
import { OrderStatusBadge, useOrder } from "@features/orders";
import { ConsumerLink } from "@features/consumers";

function OrderSummary({ id }: { id: string }) {
  const { order, isPending: isOrderPending } = useOrder(id);
  const { billingConfig, isPending: isBillingConfigPending } = useBillingConfig(
    order?.agreement?.id
  );

  const totalRP = useMemo(
    () => withMarkup(order?.price?.SPxY, billingConfig?.markup),
    [order?.price?.SPxY, billingConfig?.markup]
  );

  if (isOrderPending || isBillingConfigPending) return <div>Loading...</div>;

  if (!order) return <></>;

  return (
    <Card className="flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Type</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{order.type}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{order.agreement?.name}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={order.product?.icon}
            alt={order.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {order.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow text-sm">
          <ConsumerLink
            id={billingConfig?.consumer?.id!}
            name={billingConfig?.consumer?.name!}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{order.price?.SPxY || "—"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Margin</label>
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
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {order.price?.currency || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Created</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {order.audit?.created?.at
              ? new Date(order.audit.created.at).toLocaleDateString()
              : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Order() {
  const { id } = useParams<{ id: string }>();
  const { order, isPending } = useOrder(id!);
  if (isPending) return <div>Loading...</div>;

  if (!order) return <div>Order not found</div>;

  const { status } = order;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{id}</h1>
          {!!status && <OrderStatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button variant="white" onClick={() => {}}>
            View in SoftwareOne
          </Button>
        </div>
      </header>
      <OrderSummary id={id!} />
      <Tabs>
        <NavLink to="items">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Items</Tabs.Tab>}
        </NavLink>
        <NavLink to="details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
