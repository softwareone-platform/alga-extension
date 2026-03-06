import { Card } from "@alga-psa/ui-kit";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";

import { useAgreement, AgreementStatusBadge } from "@features/agreements";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { PriceWithMarkup } from "@features/price";

function AgreementSummary({ id }: { id: string }) {
  const { agreement, isPending: isAgreementPending } = useAgreement(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(id);

  if (isAgreementPending || isBillingConfigPending)
    return <div>Loading...</div>;

  if (!agreement) return <div>Agreement not found</div>;

  return (
    <Card className="flex flex-row justify-between gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{agreement.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.product?.icon}
            alt={agreement.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.vendor?.icon}
            alt={agreement.vendor?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.vendor?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black"><PriceWithMarkup currency={agreement?.price?.currency} value={agreement?.price?.SPxY} markup={billingConfig?.markup} /></span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.price?.currency || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Agreement() {
  const { id } = useParams<{ id: string }>();
  const { agreement, isPending } = useAgreement(id!);

  if (isPending) return <div>Loading...</div>;

  if (!agreement) return <div>Agreement not found</div>;

  const { name, status } = agreement;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{name}</h1>
          {!!status && <AgreementStatusBadge status={status} />}
        </div>
      </header>
      <AgreementSummary id={id!} />
      <Tabs>
        <NavLink to="subscriptions">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Subscriptions</Tabs.Tab>
          )}
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
