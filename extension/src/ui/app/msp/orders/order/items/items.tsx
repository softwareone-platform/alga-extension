import { Card } from "@ui/card";
import { useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@ui/table";
import { PriceWithMarkupCell } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useOrder } from "@features/orders";
import { Badge } from "@alga-psa/ui-kit";

export const ItemStatusBadge = ({ status }: { status?: string }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Draft") tone = "default";
  if (status === "Pending") tone = "warning";
  if (status === "Published") tone = "success";
  if (status === "Error") tone = "danger";

  return <Badge tone={tone}>{status}</Badge>;
};

const NameCell = ({ name, id }: { name?: string; id?: string }) => {
  if (!name && !id) return <TableCell>—</TableCell>;
  return (
    <TableCell className="flex flex-col gap-0.5 items-start relative w-full">
      <span className="truncate w-full">{name || "—"}</span>
      <span className="text-xs text-text-500 truncate w-full">{id || "—"}</span>
    </TableCell>
  );
};

export function Items() {
  const { id } = useParams<{ id: string }>();
  const { order } = useOrder(id!);
  const { billingConfig } = useBillingConfigByAgreement(order?.agreement?.id!);

  if (!order) return <>Loading...</>;

  const lines = order.lines || [];

  if (lines.length === 0) return <>No Items found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Quantity</TableHeaderCell>
            <TableHeaderCell>Unit</TableHeaderCell>
            <TableHeaderCell>SPxM</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>RPxM</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line, index) => (
            <TableRow key={line.item?.id || index}>
              <NameCell name={line.item?.name} id={line.item?.id} />
              <TableCell>{line.quantity || "—"}</TableCell>
              <TableCell>{line.item?.unit?.name || "—"}</TableCell>
              <TableCell>{line.price?.SPxM || "—"}</TableCell>
              <TableCell>{line.price?.SPxY || "—"}</TableCell>
              <PriceWithMarkupCell
                price={line.price?.SPxM}
                markup={billingConfig?.markup}
              />
              <PriceWithMarkupCell
                price={line.price?.SPxY}
                markup={billingConfig?.markup}
              />
              <TableCell>
                <ItemStatusBadge status={line.item?.status as any} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
