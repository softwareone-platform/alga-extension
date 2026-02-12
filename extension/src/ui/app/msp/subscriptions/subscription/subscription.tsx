import { Button, LinkButton } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useMemo, useState } from "react";
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
import { Loader } from "@/ui/ui";
import { useAgreement } from "@/ui/features/agreements";
import { SubscriptionManage } from "./subscription-manage";

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
    return <Card className="flex flex-row justify-between"><Loader /></Card>;

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

export function Subscription() {
  const { id } = useParams<{ id: string }>();
  const { subscription, isPending } = useSubscription(id!);
  const { agreement } = useAgreement(subscription?.agreement?.id!);
  const [isManageOpen, setIsManageOpen] = useState(false);

  if (isPending) return <div>Loading...</div>;

  if (!subscription) return <div>Subscription not found</div>;

  const { status } = subscription;

  let canManage = agreement?.status === "Active" && subscription.lines && subscription.lines.length > 0;
  canManage = true;

  return (
    <>
      <SubscriptionManage
        subscription={subscription}
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
      />
      <div className="w-full flex flex-col p-6 gap-8">
        <header className="w-full flex justify-between gap-10">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-semibold">{subscription.name}</h1>
            {!!status && <SubscriptionStatusBadge status={status} />}
          </div>
          <div className="flex items-center gap-6">
            {canManage && (
              <Button onClick={() => setIsManageOpen(true)}>Manage</Button>
            )}
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
