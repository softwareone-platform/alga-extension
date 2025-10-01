import { SubscriptionStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

export const SubscriptionStatusBadge = ({ status }: { status?: SubscriptionStatus }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Active") tone = "success";
  if (status === "Updating") tone = "warning";
  if (status === "Terminating") tone = "warning";
  if (status === "Terminated") tone = "danger";
  if (status === "Expired") tone = "danger";

  return <Badge tone={tone}>{status}</Badge>;
};
