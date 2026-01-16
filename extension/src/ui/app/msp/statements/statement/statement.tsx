import { LinkButton, Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { Tabs } from "@ui/tabs";
import { useMemo } from "react";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { withMarkup } from "@features/markup";
import { useStatement, useStatementActions } from "@features/statements";
import { ConsumerLink, useConsumer } from "@features/consumers";
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

  const totalRP = useMemo(
    () => withMarkup(statement?.price?.totalSP, billingConfig?.markup),
    [statement?.price?.totalSP, billingConfig?.markup]
  );

  const { consumer } = useConsumer(billingConfig?.consumerId);

  if (isAgreementPending || isBillingConfigPending)
    return <div>Loading...</div>;

  if (!statement) return <></>;

  return (
    <Card className="flex flex-row justify-between">
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
          <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Total SP</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {statement.price?.totalSP || "—"}
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
          <span className="text-sm text-black">{totalRP}</span>
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

  const { createInvoice, createInvoiceStatus } = useStatementActions(id!);

  const statementStatus = useMemo(() => {
    if (createInvoiceStatus === "pending") return "invoicing";
    return statement?.algaInvoiceStatus;
  }, [createInvoiceStatus, statement?.algaInvoiceStatus]);

  if (isPending) return <div>Loading...</div>;
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
      <Tabs>
        <NavLink to="charges">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Charges</Tabs.Tab>}
        </NavLink>
        <NavLink to="details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
