import { Card } from "@ui/card";
import { Link, useParams } from "react-router";
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
import {
  useSubscription,
  useSubscriptionOrders,
} from "@features/subscriptions";
import { PriceWithMarkupCell } from "@features/markup";
import { useState } from "react";
import { OrderStatusBadge } from "@features/orders";
import { DateTimeCell } from "@features/dates";
import { Order } from "@swo/mp-api-model";
import { BillingConfig } from "@/shared/billing-configs";

const OrderRow = ({
  order,
  billingConfig,
}: {
  order: Order;
  billingConfig?: BillingConfig | null;
}) => {
  return (
    <TableRow key={order.id} link={`/orders/${order.id}`}>
      <TableCell>
        <Link
          to={`/orders/${order.id}`}
          className="text-blue-500 hover:text-blue-600 truncate"
        >
          {order.id}
        </Link>
      </TableCell>
      <TableCell>{order.type || "—"}</TableCell>
      <TableCell>{order.agreement?.name || "—"}</TableCell>
      <TableCell>{order.product?.name || "—"}</TableCell>
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
  const { orders, pagination, isFetching, isPending } = useSubscriptionOrders(
    id!,
    {
      offset,
    }
  );
  const { billingConfig } = useBillingConfigByAgreement(
    subscription?.agreement?.id
  );

  if (isPending) return <></>;

  if (orders.length === 0) return <>No orders found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
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
