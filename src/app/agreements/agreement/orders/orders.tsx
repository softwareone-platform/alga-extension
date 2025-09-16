import { Card } from "@ui/card";
import {
  OrderStatusBadge,
  useAlgaAgreement,
  useSWOAgreementOrders,
} from "@features/agreements";
import { useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@ui/table";
import { Link } from "@ui/link";
import { RPxYCell } from "@features/rpxy";
import { useMemo } from "react";
import dayjs from "dayjs";

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
  const { orders } = useSWOAgreementOrders(id!);
  const { agreement: algaAgreement } = useAlgaAgreement(id!);

  console.log(orders, algaAgreement?.markup);

  if (!orders) return <>Loading...</>;

  if (orders.length === 0) return <>No Orders found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Agreement</TableHeadCell>
            <TableHeadCell>Customer</TableHeadCell>
            <TableHeadCell>SPxY</TableHeadCell>
            <TableHeadCell>Markup</TableHeadCell>
            <TableHeadCell>RPxY</TableHeadCell>
            <TableHeadCell>Currency</TableHeadCell>
            <TableHeadCell>Created</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableRow>
        </TableHead>
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
                {algaAgreement?.markup ? `${algaAgreement.markup}%` : "—"}
              </TableCell>
              <RPxYCell
                SPxY={order.price?.SPxY}
                markup={algaAgreement?.markup}
              />
              <TableCell>{order.price?.currency || "—"}</TableCell>
              <CreatedCell createdAt={order.audit?.created?.at} />
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
