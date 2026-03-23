import { OrderStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";

export const OrderStatusBadge = ({ status }: { status?: OrderStatus }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "New") tone = "default";
  if (status === "Draft") tone = "default";
  if (status === "Deleted") tone = "danger";
  if (status === "Processing") tone = "default";
  if (status === "Querying") tone = "default";
  if (status === "Failed") tone = "danger";
  if (status === "Completed") tone = "success";
  if (status === "Quoted") tone = "warning";

  return <Badge tone={tone}>{status}</Badge>;
};