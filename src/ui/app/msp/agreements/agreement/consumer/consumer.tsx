import { useBillingConfigByAgreement } from "@features/billing-config";
import { useConsumer } from "@features/consumers";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";

const COMPANY_TYPES = {
  company: "Company",
  individual: "Individual",
};

export function Consumer() {
  const { id } = useParams<{ id: string }>();
  const { billingConfig } = useBillingConfigByAgreement(id);

  const { consumer } = useConsumer(billingConfig?.consumerId);

  return (
    <Card>
      <Card className="w-fit!">
        <h2 className="text-lg font-semibold text-black mb-4">Consumer</h2>
        <div className="grid grid-cols-[auto_auto] gap-4">
          <label className="text-sm font-semibold text-black">
            Client Name
          </label>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-black">{consumer?.name || "—"}</span>
          </div>
          <label className="text-sm font-semibold text-black">Type</label>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-black">
              {consumer?.type ? COMPANY_TYPES[consumer?.type] : "—"}
            </span>
          </div>
          <label className="text-sm font-semibold text-black">Website</label>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-black">
              {consumer?.website || "—"}
            </span>
          </div>
        </div>
      </Card>
    </Card>
  );
}
