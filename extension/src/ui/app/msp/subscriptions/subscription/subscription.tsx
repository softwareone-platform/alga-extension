import { Button, LinkButton } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@ui/table";
import {
  BillingConfigStatusBadge,
  useBillingConfig,
} from "@features/billing-config";
import { PriceWithMarkupCell, withMarkup } from "@features/markup";
import {
  SubscriptionStatusBadge,
  useSubscription,
  BILLING_PERIODS,
} from "@features/subscriptions";
import { ConsumerLink } from "@features/consumers";
import { SWO_PORTAL_URL } from "@/ui/config";
import { Dialog, DialogPanel, DialogTitle } from "@/ui/ui";
import type { Subscription } from "@swo/mp-api-model";

function SubscriptionSummary({ id }: { id: string }) {
  const { subscription, isPending: isSubscriptionPending } =
    useSubscription(id);
  const { billingConfig, isPending: isBillingConfigPending } = useBillingConfig(
    subscription?.agreement?.id
  );

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
          <ConsumerLink
            id={billingConfig?.consumer?.id!}
            name={billingConfig?.consumer?.name!}
          />
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
  const { billingConfig } = useBillingConfig(subscription.agreement?.id!);

  const items = subscription.lines || [];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogPanel className="w-[90vw]">
        <DialogTitle onClose={onClose}>Manage Subscription</DialogTitle>
        <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto]">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Current Qty</TableHeaderCell>
              <TableHeaderCell>New Qty</TableHeaderCell>
              <TableHeaderCell>Unit</TableHeaderCell>
              <TableHeaderCell>SPxM</TableHeaderCell>
              <TableHeaderCell>SPxY</TableHeaderCell>
              <TableHeaderCell>RPxM</TableHeaderCell>
              <TableHeaderCell>RPxY</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.item?.name || "—"}</TableCell>
                <TableCell>{item.quantity || "—"}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    defaultValue={item.quantity}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </TableCell>
                <TableCell>{item.item?.unit?.name || "—"}</TableCell>
                <TableCell>{item.price?.SPxM || "—"}</TableCell>
                <TableCell>{item.price?.SPxY || "—"}</TableCell>
                <PriceWithMarkupCell
                  price={item.price?.SPxM}
                  markup={billingConfig?.markup}
                />
                <PriceWithMarkupCell
                  price={item.price?.SPxY}
                  markup={billingConfig?.markup}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-6">
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
