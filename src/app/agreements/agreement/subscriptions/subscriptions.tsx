import { Card } from "@ui/card";
import {
  useAlgaAgreement,
  useSWOAgreementSubscriptions,
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
import { calculateRPxY } from "../../utils";

export function Subscriptions() {
  const { id } = useParams<{ id: string }>();
  const { subscriptions } = useSWOAgreementSubscriptions(id!);
  const { agreement: algaAgreement } = useAlgaAgreement(id!);

  console.log(subscriptions, algaAgreement?.markup);

  if (!subscriptions) return <>Loading...</>;

  if (subscriptions.length === 0) return <>No Subscriptons found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>SPxM</TableHeadCell>
            <TableHeadCell>SPxY</TableHeadCell>
            <TableHeadCell>RPxM</TableHeadCell>
            <TableHeadCell>RPxY</TableHeadCell>
            <TableHeadCell>Billing period</TableHeadCell>
            <TableHeadCell>Commitment</TableHeadCell>
            <TableHeadCell>Currency</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.price?.SPxM}</TableCell>
              <TableCell>{subscription.price?.SPxY}</TableCell>
              <TableCell>
                {calculateRPxY(subscription.price?.SPxM, algaAgreement?.markup)}
              </TableCell>
              <TableCell>
                {calculateRPxY(subscription.price?.SPxY, algaAgreement?.markup)}
              </TableCell>
              <TableCell>{subscription.terms?.period}</TableCell>
              <TableCell>{subscription.terms?.commitment}</TableCell>
              <TableCell>{subscription.price?.currency}</TableCell>
              <TableCell>{subscription.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
