import { LinkButton } from "@ui/button";
import { Button, Card, Tabs } from "@alga-psa/ui-kit";
import { Icon } from "@ui/icon";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useMemo } from "react";
import { Loader, PageLoader } from "@/ui/ui/loaders";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { Price, PriceWithMarkup } from "@features/price";
import { useStatement, useStatementActions } from "@features/statements";
import { useConsumer } from "@features/consumers";
import { Link } from "@/ui/ui/link";
import { SWO_PORTAL_URL } from "@/ui/config";
import { Badge } from "@alga-psa/ui-kit";
import { InvoiceStatus } from "@/shared/statements";

export const AlgaInvoiceStatusBadge = ({
  status,
}: {
  status?: InvoiceStatus | "invoicing";
}) => {
  if (!status) return <></>;

  if (status === "no-invoice")
    return <Badge tone={"default"}>Cannot invoice</Badge>;
  if (status === "to-invoice")
    return <Badge tone={"warning"}>To invoice</Badge>;
  if (status === "invoicing")
    return <Badge tone={"default"}>Invoicing...</Badge>;
  if (status === "invoiced") return <Badge tone={"success"}>Invoiced</Badge>;

  return <></>;
};

function StatementSummary({ id }: { id: string }) {
  const { statement, isPending: isAgreementPending } = useStatement(id);
  const { billingConfig, isPending: isBillingConfigPending } =
    useBillingConfigByAgreement(statement?.agreement?.id);

  const { consumer } = useConsumer(billingConfig?.consumerId);

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
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow text-sm">
          <Link to={consumer?.id ? `/consumers/${consumer.id}` : undefined}>{consumer?.name}</Link>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Total SP</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            <Price currency={statement.price?.currency?.sale} value={statement.price?.totalSP} />
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

  const { createInvoice, createInvoiceStatus } = useStatementActions(id!);

  const statementStatus = useMemo(() => {
    if (createInvoiceStatus === "pending") return "invoicing";
    return statement?.algaInvoiceStatus;
  }, [createInvoiceStatus, statement?.algaInvoiceStatus]);

  if (isPending) return <PageLoader />;
  if (!statement) return <div>Statement not found</div>;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between gap-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{id}</h1>
          <AlgaInvoiceStatusBadge status={statementStatus} />
        </div>
        <div className="flex items-center gap-6">
          {statement.algaInvoiceStatus === "to-invoice" && (
            <Button
              onClick={() => createInvoice()}
              disabled={createInvoiceStatus === "pending"}
            >
              {createInvoiceStatus === "pending" ? "Invoicing..." : "Invoice"}
            </Button>
          )}
          <LinkButton
            variant="white"
            href={`${SWO_PORTAL_URL}/billing/statements/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in SoftwareOne
          </LinkButton>
        </div>
      </header>
      <StatementSummary id={id!} />
      <Tabs
        tabs={[
          { key: "charges", label: "Charges", content: null },
          { key: "attachments", label: "Attachments", content: null },
          { key: "details", label: "Details", content: null },
        ]}
        activeKey={location.pathname.split("/").pop() || "charges"}
        onChange={(key) => navigate(key)}
      />
      <Outlet />
    </div>
  );
}
