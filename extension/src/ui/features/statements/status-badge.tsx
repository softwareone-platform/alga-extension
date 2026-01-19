import { Badge } from "@alga-psa/ui-kit";
import { InvoiceStatus } from "@/shared/statements";

export const AlgaInvoiceStatusBadge = ({
  status,
}: {
  status?: InvoiceStatus | null;
}) => {
  if (!status) return <></>;

  if (status === "no-invoice")
    return <Badge tone={"default"}>Cannot invoice</Badge>;
  if (status === "to-invoice")
    return <Badge tone={"warning"}>To invoice</Badge>;
  if (status === "invoiced") return <Badge tone={"success"}>Invoiced</Badge>;

  return <></>;
};
