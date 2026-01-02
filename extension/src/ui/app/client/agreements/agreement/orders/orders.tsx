import { Card } from "@ui/card";
import { OrderStatusBadge, useAgreementOrders } from "@features/agreements";
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
import { Link } from "@ui/link";
import { PriceWithMarkupCell } from "@features/markup";
import { useState } from "react";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { DateTimeCell } from "@features/dates";

export function Orders() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching, isPending } = useAgreementOrders(
    id!,
    {
      offset,
    }
  );
  const { billingConfig } = useBillingConfigByAgreement(id!);

  if (isPending) return <></>;

  if (orders.length === 0) return <>No Orders found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>Markup</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  className="truncate"
                  href={`/orders/${order.id}`}
                  target="_blank"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.type || "—"}</TableCell>
              <TableCell>CONSUMER</TableCell>
              <TableCell>{order.price?.SPxY || "—"}</TableCell>
              <TableCell>
                {billingConfig?.markup ? `${billingConfig.markup}%` : "—"}
              </TableCell>
              <PriceWithMarkupCell
                price={order.price?.SPxY}
                markup={billingConfig?.markup}
              />
              <TableCell>{order.price?.currency || "—"}</TableCell>
              <DateTimeCell dateTime={order.audit?.created?.at} />
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
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
