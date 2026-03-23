import { Card, Tabs } from "@alga-psa/ui-kit";
import { Icon } from "@ui/icon";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Loader, PageLoader } from "@/ui/ui/loaders";

import { useBillingConfigByAgreement } from "@features/billing-config";
import { PriceWithMarkup } from "@features/price";
import { useStatement } from "@features/statements";

function StatementSummary({ id }: { id: string }) {
  const { statement, isPending: isAgreementPending } = useStatement(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(statement?.agreement?.id);

  if (isAgreementPending || isBillingConfigPending)
    return <Loader />;

  if (!statement) return <></>;

  return (
    <Card className="flex flex-row justify-between gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Type</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{statement.type}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{statement.agreement?.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={statement.product?.icon}
            alt={statement.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {statement.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Total RP</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black"><PriceWithMarkup currency={statement?.price?.currency?.sale} value={statement?.price?.totalSP} markup={billingConfig?.markup} /></span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {statement.price?.currency?.sale || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Statement() {
  const { id } = useParams<{ id: string }>();
  const { statement, isPending } = useStatement(id!);
  const navigate = useNavigate();
  const location = useLocation();
  if (isPending) return <PageLoader />;

  if (!statement) return <div>Statement not found</div>;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{id}</h1>
        </div>
      </header>
      <StatementSummary id={id!} />
      <Tabs
        tabs={[
          { key: "charges", label: "Charges", content: null },
          { key: "details", label: "Details", content: null },
        ]}
        activeKey={location.pathname.split("/").pop() || "charges"}
        onChange={(key) => navigate(key)}
      />
      <Outlet />
    </div>
  );
}
