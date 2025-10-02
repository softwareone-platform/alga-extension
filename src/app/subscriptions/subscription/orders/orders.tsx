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
import { useBillingConfig } from "@features/billing-config";
import {
  useSubscription,
  useSubscriptionOrders,
} from "@features/subscriptions";
import { PriceWithMarkupCell } from "@features/markup";
import { useState } from "react";
import { OrderStatusBadge } from "@features/orders";
import { CreatedCell } from "@features/dates";

export function Orders() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { subscription } = useSubscription(id!);
  const { orders, pagination, isFetching } = useSubscriptionOrders(id!, {
    offset,
  });
  const { billingConfig } = useBillingConfig(subscription?.agreement?.id);

  if (!orders) return <>Loading...</>;

  if (orders.length === 0) return <>No orders found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
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
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.type || "—"}</TableCell>
              <TableCell>{order.agreement?.name || "—"}</TableCell>
              <TableCell>{order.product?.name || "—"}</TableCell>
              <TableCell>—</TableCell>
              <TableCell>{order.price?.SPxY || "—"}</TableCell>
              <TableCell>
                {billingConfig?.markup ? `${billingConfig.markup}%` : "—"}
              </TableCell>
              <PriceWithMarkupCell
                price={order.price?.SPxY}
                markup={billingConfig?.markup}
              />
              <TableCell>{order.price?.currency || "—"}</TableCell>
              <CreatedCell createdAt={order.audit?.created?.at} />
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
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
