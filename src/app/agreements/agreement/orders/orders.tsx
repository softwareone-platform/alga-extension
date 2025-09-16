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
import { useMemo } from "react";
import { RPxYCell } from "@features/rpxy";

const CreatedCell = ({
  commitment,
}: {
  commitment: "1m" | "1y" | "3y" | null | undefined;
}) => {
  const text = useMemo(() => {
    if (commitment === "1m") return "1 month";
    if (commitment === "1y") return "1 year";
    if (commitment === "3y") return "3 years";
    return "—";
  }, [commitment]);

  return <TableCell>{text}</TableCell>;
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
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Agreement</TableHeadCell>
            <TableHeadCell>Product</TableHeadCell>
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
              <TableCell className="flex flex-col gap-0.5 items-start">
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
              <TableCell>PRODUCT</TableCell>
              <TableCell>CONSUMER</TableCell>
              <TableCell>{order.price?.SPxY || "—"}</TableCell>
              <TableCell>{algaAgreement?.markup || "—"}</TableCell>
              <RPxYCell
                SPxY={order.price?.SPxY}
                markup={algaAgreement?.markup}
              />
              <TableCell>{order.price?.currency || "—"}</TableCell>
              <TableCell>CREATED</TableCell>
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
