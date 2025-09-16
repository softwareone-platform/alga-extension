import { SubscriptionStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

export const SubscriptionStatusBadge = ({
  status,
}: {
  status?: SubscriptionStatus;
}) => {
  if (!status) return <></>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Terminating") tone = "danger";
  if (status === "Terminated") tone = "danger";
  if (status === "Updating") tone = "warning";
  if (status === "Active") tone = "success";
  if (status === "Expired") tone = "danger";

  return <Badge tone={tone}>{status}</Badge>;
};
