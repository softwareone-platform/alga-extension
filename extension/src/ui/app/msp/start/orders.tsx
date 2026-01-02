import { useState } from "react";
import { Card } from "@ui/card";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@ui/table";
import { MarkupCell, PriceWithMarkupCell } from "@features/markup";
import { useOrders, OrderStatusBadge } from "@features/orders";
import { AgreementCell } from "@features/agreements";
import { ProductCell } from "@features/products";
import { Order } from "@swo/mp-api-model";
import { ConsumerLink, useConsumer } from "@features/consumers";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";

const OrderRow = ({ order }: { order: Order }) => {
  const { billingConfig } = useBillingConfigByAgreement(order?.agreement?.id);
  const { consumer } = useConsumer(billingConfig?.consumerId);
  return (
    <TableRow link={`/orders/${order.id}`}>
      <TableCell>
        <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
          {order.id!}
        </span>
      </TableCell>
      <TableCell>{order.type || "—"}</TableCell>
      <AgreementCell name={order.agreement?.name} id={order.agreement?.id} />
      <ProductCell name={order.product?.name} iconUrl={order.product?.icon} />
      <TableCell>
        <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
      </TableCell>
      <TableCell>{order.price?.SPxY || "—"}</TableCell>
      <MarkupCell markup={billingConfig?.markup} />
      <PriceWithMarkupCell
        price={order.price?.SPxY}
        markup={billingConfig?.markup}
      />
      <TableCell>{order.price?.currency || "—"}</TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
    </TableRow>
  );
};

export function Orders() {
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching } = useOrders({ offset });

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(100px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Order ID</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Consumer</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>Margin</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
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
