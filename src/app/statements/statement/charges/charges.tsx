import { Card } from "@ui/card";
import { useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Pagination,
} from "@ui/table";
import { PriceWithMarkupCell } from "@features/markup";
import { useState } from "react";
import { useBillingConfig } from "@features/billing-config";
import { useStatement, useStatementCharges } from "@features/statements";
import { DateTimeCell } from "@features/dates";

const ItemCell = ({ name, id }: { name?: string; id?: string }) => {
  if (!name && !id) return <TableCell>—</TableCell>;
  return (
    <TableCell className="flex flex-col gap-0.5 items-start relative w-full">
      <span className="truncate w-full">{name || "—"}</span>
      <span className="text-xs text-text-500 truncate w-full">{id || "—"}</span>
    </TableCell>
  );
};

const SubscriptionCell = ({ name, id }: { name?: string; id?: string }) => {
  if (!name) return <TableCell>—</TableCell>;
  return (
    <TableCell className="flex flex-col gap-0.5 items-start relative w-full">
      <span className="truncate w-full">{name || "—"}</span>
      <span className="text-xs text-text-500 truncate w-full">{id || "—"}</span>
    </TableCell>
  );
};

export function Charges() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { statement } = useStatement(id!);
  const { charges, pagination, isFetching } = useStatementCharges(id!, {
    offset,
  });
  const { billingConfig } = useBillingConfig(statement?.agreement?.id!);

  if (!charges) return <>Loading...</>;

  if (charges.length === 0) return <>No Charges found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Subscription</TableHeaderCell>
            <TableHeaderCell>Item</TableHeaderCell>
            <TableHeaderCell>Start Date</TableHeaderCell>
            <TableHeaderCell>End Date</TableHeaderCell>
            <TableHeaderCell>Quantity</TableHeaderCell>
            <TableHeaderCell>SP</TableHeaderCell>
            <TableHeaderCell>RP</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges?.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.id}</TableCell>
              <SubscriptionCell
                name={charge.subscription?.name}
                id={charge.subscription?.id}
              />
              <ItemCell name={charge.item?.name} id={charge.item?.id} />
              <DateTimeCell dateTime={charge.period?.start} />
              <DateTimeCell dateTime={charge.period?.end} />
              <TableCell>{charge.quantity || "—"}</TableCell>
              <TableCell>{charge.price?.SPx1 || "—"}</TableCell>
              <PriceWithMarkupCell
                price={charge.price?.SPx1}
                markup={billingConfig?.markup}
              />
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Pagination
              onPageChange={(page) =>
                setOffset((page - 1) * (pagination.limit ?? 0))
              }
              totalItems={pagination.total ?? 0}
              isLoading={isFetching}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
