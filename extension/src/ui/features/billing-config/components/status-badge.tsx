import { BillingConfigStatus } from "@/lib/billing-config";
import { Badge } from "@alga-psa/ui-kit";

export const BillingConfigStatusBadge = ({
  status,
}: {
  status?: BillingConfigStatus;
}) => {
  status = status ?? "unconfigured";

  let tone: "default" | "success" = "default";

  if (status === "active") tone = "success";
  if (status === "unconfigured") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
};
