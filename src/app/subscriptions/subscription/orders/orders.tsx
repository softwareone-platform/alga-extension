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
import { DateTimeCell } from "@features/dates";
import { Order } from "@swo/mp-api-model";
import { BillingConfig } from "@lib/alga";
import { ConsumerLink } from "@features/consumers";

const OrderRow = ({
  order,
  billingConfig,
}: {
  order: Order;
  billingConfig?: BillingConfig | null;
}) => {
  return (
    <TableRow key={order.id}>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.type || "—"}</TableCell>
      <TableCell>{order.agreement?.name || "—"}</TableCell>
      <TableCell>{order.product?.name || "—"}</TableCell>
      <TableCell>
        <ConsumerLink
          id={billingConfig?.consumer?.id!}
          name={billingConfig?.consumer?.name!}
        />
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
            <OrderRow
              key={order.id}
              order={order}
              billingConfig={billingConfig}
            />
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
