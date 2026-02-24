import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";

import { useBillingConfigByAgreement } from "@features/billing-config";
import { PriceWithMarkup } from "@features/price";
import {
  SubscriptionManagement,
  SubscriptionStatusBadge,
  useSubscription,
  BILLING_PERIODS,
} from "@features/subscriptions";

function SubscriptionSummary({ id }: { id: string }) {
  const { subscription, isPending: isSubscriptionPending } =
    useSubscription(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(subscription?.agreement?.id);

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
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black"><PriceWithMarkup currency={subscription?.price?.currency} value={subscription?.price?.SPxY} markup={billingConfig?.markup} /></span>
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

export function Subscription() {
  const { id } = useParams<{ id: string }>();
  const { subscription, isPending } = useSubscription(id!);
  const { billingConfig } = useBillingConfigByAgreement(subscription?.agreement?.id);
  if (isPending) return <div>Loading...</div>;

  if (!subscription) return <div>Subscription not found</div>;

  const { status } = subscription;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{subscription.name}</h1>
          {!!status && <SubscriptionStatusBadge status={status} />}
        </div>
        {billingConfig?.operations === "self-service" && (
          <SubscriptionManagement subscription={subscription} />
        )}
      </header>
      <SubscriptionSummary id={id!} />
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
  );
}
