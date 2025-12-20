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
import { useBillingConfigByAgreement } from "@features/billing-config";
import { useSubscriptionOrders } from "@features/subscriptions";
import { PriceWithMarkupCell } from "@features/markup";
import { useState } from "react";
import { OrderStatusBadge } from "@features/orders";
import { DateTimeCell } from "@features/dates";
import { Order } from "@swo/mp-api-model";
import { ConsumerLink, useConsumer } from "@features/consumers";
import { Link } from "@ui/link";

const OrderRow = ({ order }: { order: Order }) => {
  const { billingConfig } = useBillingConfigByAgreement(order?.agreement?.id);
  const { consumer } = useConsumer(billingConfig?.consumerId!);
  return (
    <TableRow key={order.id} link={`/msp/orders/${order.id}`}>
      <TableCell>
        <Link className="truncate" href={`/msp/orders/${order.id}`}>
          {order.id}
        </Link>
      </TableCell>
      <TableCell>{order.type || "—"}</TableCell>
      <TableCell>{order.agreement?.name || "—"}</TableCell>
      <TableCell>{order.product?.name || "—"}</TableCell>
      <TableCell>
        <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
      </TableCell>
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
  );
};

export function Orders() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching, isPending } = useSubscriptionOrders(
    id!,
    {
      offset,
    }
  );

  if (isPending) return <></>;

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
            <OrderRow key={order.id} order={order} />
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
