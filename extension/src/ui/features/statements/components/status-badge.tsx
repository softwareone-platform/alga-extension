import { Badge } from "@alga-psa/ui-kit";
import { InvoiceStatus } from "@/shared/statements";

export const AlgaInvoiceStatusBadge = ({
  status,
}: {
  status?: InvoiceStatus | null;
}) => {
  if (!status) return <></>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "no-invoice") <Badge tone={tone}>Cannot invoice</Badge>;
  if (status === "to-invoice") <Badge tone={tone}>To invoice</Badge>;
  if (status === "invoiced") <Badge tone={tone}>Invoiced</Badge>;

  return <></>;
};
