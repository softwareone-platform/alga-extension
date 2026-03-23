import { Card } from "@alga-psa/ui-kit";
import { useAgreement } from "@features/agreements";
import { useParams } from "react-router";
import { useBillingConfigByAgreement } from "@features/billing-config";

function PlanService({
  serviceName,
  serviceUrl,
}: {
  serviceName?: string;
  serviceUrl?: string;
}) {
  return (
    <Card className="w-fit!">
      <h2 className="text-lg font-semibold text-black mb-4">Plan Service</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Agreement</label>
        <div className="flex gap-2 items-center">
          {!serviceName && <span className="text-sm text-black">—</span>}
          {serviceName && (
            <a
              href={serviceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {serviceName}
            </a>
          )}
        </div>
        <label className="text-sm font-semibold text-black">Service</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">-</span>
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
  const { billingConfig } = useBillingConfigByAgreement(id!);
  const { agreement } = useAgreement(id!);

  return (
    <Card className="flex flex-row gap-6 items-start">
      <PlanService
        serviceName={agreement?.name}
        serviceUrl={`https://portal.platform.softwareone.com/commerce/agreements/${id!}`}
      />
      <Markup markup={billingConfig?.markup} />
    </Card>
  );
}
