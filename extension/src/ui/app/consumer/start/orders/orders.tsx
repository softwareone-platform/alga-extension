import { useMemo, useState } from "react";
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
import { PriceWithMarkupCell } from "@features/markup";
import { useOrders, OrderStatusBadge } from "@features/orders";
import { AgreementCell } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useBillingConfigsByConsumer } from "@features/billing-config";
import { BillingConfig } from "@lib/alga";
import { Order } from "@swo/mp-api-model";

const OrderRow = ({
  order,
  billingConfig,
}: {
  order: Order;
  billingConfig?: BillingConfig;
}) => (
  <TableRow link={`/consumer/orders/${order.id}`}>
    <TableCell>
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {order.id!}
      </span>
    </TableCell>
    <TableCell>{order.type || "—"}</TableCell>
    <AgreementCell name={order.agreement?.name} id={order.agreement?.id} />
    <ProductCell name={order.product?.name} iconUrl={order.product?.icon} />
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

export function Orders() {
  const [offset, setOffset] = useState(0);
  const { billingConfigs } = useBillingConfigsByConsumer(
    "eeca06d2-a0f2-42a5-a33d-ecd7db5430d0"
  );

  const { orders, pagination, isFetching } = useOrders(
    {
      offset,
    },
    billingConfigs?.map((bc) => bc.agreementId!) ?? []
  );

  const billingConfigsById =
    useMemo(
      () =>
        billingConfigs?.reduce(
          (acc, billingConfig) => ({
            ...acc,
            [billingConfig!.agreementId!]: billingConfig,
          }),
          {} as Record<string, BillingConfig>
        ),
      [billingConfigs]
    ) || {};

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(100px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Order ID</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              billingConfig={billingConfigsById[order.agreement?.id!]}
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
