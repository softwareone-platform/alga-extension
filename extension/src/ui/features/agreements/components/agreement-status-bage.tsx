import { AgreementStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

export const AgreementStatusBadge = ({
  status,
}: {
  status?: AgreementStatus | null;
}) => {
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
};
