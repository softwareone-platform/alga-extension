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
import { useBillingConfig } from "@features/billing-config";
import { useSubscriptionItems } from "@features/subscriptions";
import { PriceWithMarkupCell } from "@features/markup";

const ItemCell = ({ name, id }: { name?: string; id?: string }) => {
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
  const { items, subscription, isPending } = useSubscriptionItems(id!);
  const { billingConfig } = useBillingConfig(subscription?.agreement?.id!);

  if (isPending) return <>Loading...</>;

  if (!items || items.length === 0) return <>No items found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Quantity</TableHeaderCell>
            <TableHeaderCell>Unit</TableHeaderCell>
            <TableHeaderCell>Unit RP</TableHeaderCell>
            <TableHeaderCell>RPxM</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id}>
              <ItemCell name={item.item?.name} id={item.item?.id} />
              <TableCell>{item.quantity || "—"}</TableCell>
              <TableCell>{item.item?.unit?.name || "—"}</TableCell>
              <TableCell>{item.price?.unitSP || "—"}</TableCell>
              <PriceWithMarkupCell
                price={item.price?.SPxM}
                markup={billingConfig?.markup}
              />
              <PriceWithMarkupCell
                price={item.price?.SPxY}
                markup={billingConfig?.markup}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
