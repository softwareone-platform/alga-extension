import { OrderStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

export const OrderStatusBadge = ({ status }: { status?: OrderStatus }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Failed") tone = "danger";
  if (status === "Draft") tone = "default";
  if (status === "Deleted") tone = "default";
  if (status === "Processing") tone = "warning";
  if (status === "Querying") tone = "warning";
  if (status === "Completed") tone = "success";
  if (status === "Quoted") tone = "default";
  if (status === "New") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
};
