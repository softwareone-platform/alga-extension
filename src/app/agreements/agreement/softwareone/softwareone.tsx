import { useAgreement } from "@features/agreements/hooks";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import {
  Agreement as AgreementType,
  AgreementStatus as AgreementStatusType,
} from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

function StatusBadge({ status }: { status?: AgreementStatusType }) {
  if (!status) return <></>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Failed") tone = "danger";
  if (status === "Draft") tone = "default";
  if (status === "Provisioning") tone = "warning";
  if (status === "Updating") tone = "warning";
  if (status === "Active") tone = "success";
  if (status === "Terminated") tone = "default";
  if (status === "Deleted") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
}

function Agreement({ agreement }: { agreement: AgreementType }) {
  return (
    <Card className="w-fit!">
      <h2 className="text-lg font-semibold text-black mb-4">Agreement</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">{agreement.id}</span>
          <StatusBadge status={agreement.status} />
        </div>

        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center">
          <Icon
            iconUrl={agreement.product?.icon}
            alt={agreement.product?.name}
            className="size-4"
          />
          <span className="text-sm text-black">
            {agreement.product?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center">
          <Icon
            iconUrl={agreement.vendor?.icon}
            alt={agreement.vendor?.name}
            className="size-4"
          />
          <span className="text-sm text-black">
            {agreement.vendor?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Licensee</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.licensee?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">SPxM</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.price?.SPxM || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.price?.SPxY || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.price?.currency || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function SoftwareOne() {
  const { data, isPending } = useAgreement("AGR-4258-9931-4515");

  if (isPending) return <div>Loading...</div>;
  if (!data) return <div>Agreement not found</div>;

  return (
    <Card>
      <Agreement agreement={data} />
    </Card>
  );
}
