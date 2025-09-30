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
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useBillingConfig } from "@features/billing-config";

const CreatedCell = ({
  createdAt,
}: {
  createdAt: string | null | undefined;
}) => {
  if (!createdAt) return <TableCell>—</TableCell>;

  const date = useMemo(() => {
    return dayjs(createdAt).format("MM/DD/YYYY");
  }, [createdAt]);

  const time = useMemo(() => {
    return dayjs(createdAt).format("HH:mm");
  }, [createdAt]);

  return (
    <TableCell className="flex flex-col gap-0.5 items-start">
      <span>{date}</span>
      <span className="text-xs text-text-500">{time}</span>
    </TableCell>
  );
};

export function Orders() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { orders, pagination, isFetching } = useAgreementOrders(id!, {
    offset,
  });
  const { billingConfig } = useBillingConfig(id!);

  if (!orders) return <>Loading...</>;

  if (orders.length === 0) return <>No Orders found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
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
                  href={`/agreements/${id}/orders/${order.id}`}
                  target="_blank"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.type || "—"}</TableCell>
              <TableCell>AGREEMENT</TableCell>
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
