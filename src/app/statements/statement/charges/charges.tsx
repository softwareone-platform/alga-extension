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
import { useStatementCharges } from "@features/statements";

const NameCell = ({ name, id }: { name?: string; id?: string }) => {
  if (!name && !id) return <TableCell>—</TableCell>;
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
  const { charges, pagination, isFetching } = useStatementCharges(id!, {
    offset,
  });
  const { billingConfig } = useBillingConfig(id!);

  if (!charges) return <>Loading...</>;

  if (charges.length === 0) return <>No Charges found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto]">
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
          {charges?.map((charge) => (
            <TableRow key={charge.id}>
              <NameCell name={charge.item?.name} id={charge.item?.id} />
              <TableCell>{charge.quantity || "—"}</TableCell>
              <TableCell>{charge.item?.unit?.name || "—"}</TableCell>
              <TableCell>{charge.price?.SPx1 || "—"}</TableCell>
              <PriceWithMarkupCell
                price={charge.price?.SPx1}
                markup={billingConfig?.markup}
              />
              <TableCell>{"—"}</TableCell>
              <TableCell>{"—"}</TableCell>
              <TableCell>{charge.order?.status || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <Pagination
            onPageChange={(page) =>
              setOffset((page - 1) * (pagination.limit ?? 0))
            }
            totalItems={pagination.total ?? 0}
            isLoading={isFetching}
          />
        </TableFooter>
      </Table>
    </Card>
  );
}
