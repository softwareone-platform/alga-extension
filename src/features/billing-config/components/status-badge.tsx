import { BillingConfigStatus } from "@lib/alga/billing-config/models";
import { Badge } from "@alga-psa/ui-kit";

export const BillingConfigStatusBadge = ({
  status,
}: {
  status?: BillingConfigStatus;
}) => {
  if (!status) return <span>—</span>;

  let tone: "default" | "success" = "default";

  if (status === "active") tone = "success";
  if (status === "unconfigured") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
};
