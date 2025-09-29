import { Card } from "@ui/card";
import { useAgreement, PLAN_SERVICES } from "@features/agreements";
import { PlanService as AlgaPlanService } from "@lib/alga";
import { Link } from "@ui/link";
import { useParams } from "react-router";
import { useBillingConfig } from "@features/billing-config";

function PlanService({
  planService,
  serviceName,
  serviceUrl,
}: {
  planService?: AlgaPlanService;
  serviceName?: string;
  serviceUrl?: string;
}) {
  return (
    <Card className="w-fit!">
      <h2 className="text-lg font-semibold text-black mb-4">Plan Service</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Service name</label>
        <div className="flex gap-2 items-center">
          {!serviceName && <span className="text-sm text-black">—</span>}
          {serviceName && (
            <Link
              href={serviceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              {serviceName}
            </Link>
          )}
        </div>
        <label className="text-sm font-semibold text-black">
          Unit of measure
        </label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {planService ? `${PLAN_SERVICES[planService]}` : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Markup({ markup }: { markup?: number }) {
  const hasMarkup = markup !== undefined;
  return (
    <Card className="w-fit!">
      <h2 className="text-lg font-semibold text-black mb-4">Markup</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Amount</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {hasMarkup ? `${markup}%` : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Billing() {
  const { id } = useParams<{ id: string }>();
  const { billingConfig } = useBillingConfig(id!);
  const { agreement } = useAgreement(id!);

  return (
    <Card className="flex flex-row gap-6 items-start">
      <PlanService
        planService={billingConfig?.planService}
        serviceName={agreement?.name}
        serviceUrl={`https://portal.platform.softwareone.com/commerce/agreements/${id!}`}
      />
      <Markup markup={billingConfig?.markup} />
    </Card>
  );
}
