import { StatementStatus } from "@swo/mp-api-model/billing";
import { Badge } from "@alga-psa/ui-kit";

export const StatementStatusBadge = ({
  status,
}: {
  status?: StatementStatus;
}) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Pending") tone = "warning";
  if (status === "Generated") tone = "default";
  if (status === "Queued") tone = "default";
  if (status === "Error") tone = "danger";
  if (status === "Cancelled") tone = "danger";
  if (status === "Issued") tone = "success";
  if (status === "Generating") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
};
