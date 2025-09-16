import { Card } from "@ui/card";
import {
  SubscriptionStatusBadge,
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
import { Link } from "@ui/link";
import { useMemo } from "react";
import { TermsEntity } from "@swo/mp-api-model";
import { RPxYCell } from "@features/rpxy";

const PeriodCell = ({ period }: { period: TermsEntity["period"] }) => {
  const text = useMemo(() => {
    if (period === "1m") return "Monthly";
    if (period === "1y") return "Yearly";
    if (period === "one-time") return "One-time";
    return "—";
  }, [period]);

  return <TableCell>{text}</TableCell>;
};

const CommitmentCell = ({
  commitment,
}: {
  commitment: TermsEntity["commitment"];
}) => {
  const text = useMemo(() => {
    if (commitment === "1m") return "1 month";
    if (commitment === "1y") return "1 year";
    if (commitment === "3y") return "3 years";
    return "—";
  }, [commitment]);

  return <TableCell>{text}</TableCell>;
};

export function Subscriptions() {
  const { id } = useParams<{ id: string }>();
  const { subscriptions } = useSWOAgreementSubscriptions(id!);
  const { agreement: algaAgreement } = useAlgaAgreement(id!);

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
              <TableCell className="flex flex-col gap-0.5 items-start">
                <Link
                  className="truncate"
                  href={`/agreements/${id}/subscriptions/${subscription.id}`}
                  target="_blank"
                >
                  {subscription.name}
                </Link>
                <span className="text-xs text-text-500 truncate">
                  {subscription.id}
                </span>
              </TableCell>
              <TableCell>{subscription.price?.SPxM || "—"}</TableCell>
              <TableCell>{subscription.price?.SPxY || "—"}</TableCell>
              <RPxYCell
                SPxY={subscription.price?.SPxM}
                markup={algaAgreement?.markup}
              />
              <RPxYCell
                SPxY={subscription.price?.SPxY}
                markup={algaAgreement?.markup}
              />
              <PeriodCell period={subscription.terms?.period} />
              <CommitmentCell commitment={subscription.terms?.commitment} />
              <TableCell>{subscription.price?.currency || "—"}</TableCell>
              <TableCell>
                <SubscriptionStatusBadge status={subscription.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
