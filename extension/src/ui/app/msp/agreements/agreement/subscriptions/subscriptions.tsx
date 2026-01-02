import { Card } from "@ui/card";
import {
  SubscriptionStatusBadge,
  useAgreementSubscriptions,
} from "@features/agreements";
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
import { Link, useParams } from "react-router";
import { useMemo, useState } from "react";
import { TermsEntity } from "@swo/mp-api-model";
import { PriceWithMarkupCell } from "@features/markup";
import { useBillingConfigByAgreement } from "@features/billing-config";
import { BILLING_PERIODS } from "@features/subscriptions";

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
  const [offset, setOffset] = useState(0);
  const { subscriptions, pagination, isFetching, isPending } =
    useAgreementSubscriptions(id!, { offset });
  const { billingConfig } = useBillingConfigByAgreement(id!);

  if (isPending) return <></>;

  if (subscriptions.length === 0) return <>No Subscriptons found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>SPxM</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>RPxM</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Billing period</TableHeaderCell>
            <TableHeaderCell>Commitment</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell className="flex flex-col gap-0.5 items-start">
                <Link
                  className="truncate text-blue-500 hover:text-blue-600"
                  to={`/subscriptions/${subscription.id}`}
                >
                  {subscription.name}
                </Link>
                <span className="text-xs text-text-500 truncate">
                  {subscription.id}
                </span>
              </TableCell>
              <TableCell>{subscription.price?.SPxM || "—"}</TableCell>
              <TableCell>{subscription.price?.SPxY || "—"}</TableCell>
              <PriceWithMarkupCell
                price={subscription.price?.SPxM}
                markup={billingConfig?.markup}
              />
              <PriceWithMarkupCell
                price={subscription.price?.SPxY}
                markup={billingConfig?.markup}
              />
              <TableCell>
                {subscription.terms?.period
                  ? BILLING_PERIODS[subscription.terms?.period]
                  : "—"}
              </TableCell>
              <CommitmentCell commitment={subscription.terms?.commitment} />
              <TableCell>{subscription.price?.currency || "—"}</TableCell>
              <TableCell>
                <SubscriptionStatusBadge status={subscription.status} />
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
