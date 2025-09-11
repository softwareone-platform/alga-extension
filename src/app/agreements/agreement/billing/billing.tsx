import { Card } from "@ui/card";
import { useAlgaAgreement, useSWOAgreement } from "@features/agreements";
import { PlanService as AlgaPlanService } from "@lib/alga";
import { Link } from "@ui/link";

const PLAN_SERVICE_NAME = {
  payg: "Pay-as-you-go",
} as const;

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
            {planService ? `${PLAN_SERVICE_NAME[planService]}` : "—"}
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
  const id = "AGR-4258-9931-4515";
  const { agreement: algaAgreement } = useAlgaAgreement(id);
  const { agreement: swoAgreement } = useSWOAgreement(id);

  return (
    <Card className="flex flex-row gap-6 items-start">
      <PlanService
        planService={algaAgreement?.planService}
        serviceName={swoAgreement?.name}
        serviceUrl={`https://portal.platform.softwareone.com/commerce/agreements/${id}`}
      />
      <Markup markup={algaAgreement?.markup} />
    </Card>
  );
}
