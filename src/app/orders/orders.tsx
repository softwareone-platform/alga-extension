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
import { Icon } from "@ui/icon";
import { MarkupCell, PriceWithMarkupCell } from "@features/markup";
import { useOrders, OrderStatusBadge } from "@features/orders";
import { AgreementCell } from "@features/agreements";
import { useBillingConfigs } from "@features/billing-config";
import { BillingConfig } from "@lib/alga";

const ProductCell = ({
  name,
  iconUrl,
}: {
  name?: string;
  iconUrl?: string;
}) => {
  return (
    <TableCell className="gap-4 w-full items-center">
      <Icon iconUrl={iconUrl} alt={name} className="size-8" />
      <span className="truncate">{name || "—"}</span>
    </TableCell>
  );
};

export function Orders() {
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching } = useOrders({ offset });

  const { billingConfigs } = useBillingConfigs(
    orders.map((order) => order.agreement?.id ?? "").filter(Boolean)
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
            <TableRow key={order.id} link={`/orders/${order.id}`}>
              <TableCell>
                <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
                  {order.id!}
                </span>
              </TableCell>
              <TableCell>{order.type || "—"}</TableCell>
              <AgreementCell
                name={order.agreement?.name}
                id={order.agreement?.id}
              />
              <ProductCell
                name={order.product?.name}
                iconUrl={order.product?.icon}
              />
              <TableCell></TableCell>
              <TableCell>{order.price?.SPxY || "—"}</TableCell>
              <MarkupCell
                markup={billingConfigsById[order.agreement?.id!]?.markup}
              />
              <PriceWithMarkupCell
                price={order.price?.SPxY}
                markup={billingConfigsById[order.agreement?.id!]?.markup}
              />
              <TableCell>{order.price?.currency || "—"}</TableCell>
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
