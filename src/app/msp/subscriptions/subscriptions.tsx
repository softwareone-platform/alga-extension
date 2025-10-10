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
import { MarkupCell, PriceWithMarkupCell } from "@features/markup";
import {
  useSubscriptions,
  SubscriptionStatusBadge,
  BILLING_PERIODS,
} from "@features/subscriptions";
import { AgreementCell } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useBillingConfigs } from "@features/billing-config";
import { BillingConfig } from "@lib/alga";
import { ConsumerLink } from "@features/consumers";
import { Subscription } from "@swo/mp-api-model";

const SubscriptionRow = ({
  subscription,
  billingConfig,
}: {
  subscription: Subscription;
  billingConfig?: BillingConfig;
}) => {
  return (
    <TableRow link={`/subscriptions/${subscription.id}`}>
      <TableCell>
        <span className="truncate">{subscription.name || "—"}</span>
      </TableCell>
      <ProductCell
        name={subscription.product?.name}
        iconUrl={subscription.product?.icon}
      />
      <TableCell>
        <ConsumerLink
          id={billingConfig?.consumer?.id!}
          name={billingConfig?.consumer?.name!}
        />
      </TableCell>
      <AgreementCell
        name={subscription.agreement?.name}
        id={subscription.agreement?.id}
      />
      <TableCell>{subscription.price?.SPxY || "—"}</TableCell>
      <MarkupCell markup={billingConfig?.markup} />
      <PriceWithMarkupCell
        price={subscription.price?.SPxY}
        markup={billingConfig?.markup}
      />
      <TableCell>
        {subscription.terms?.period
          ? BILLING_PERIODS[subscription.terms?.period]
          : "—"}
      </TableCell>
      <TableCell>{subscription.terms?.commitment || "—"}</TableCell>
      <TableCell>{subscription.price?.currency || "—"}</TableCell>
      <TableCell>
        <SubscriptionStatusBadge status={subscription.status} />
      </TableCell>
    </TableRow>
  );
};

export function Subscriptions() {
  const [offset, setOffset] = useState(0);
  const { subscriptions, pagination, isFetching } = useSubscriptions({
    offset,
  });

  const { billingConfigs } = useBillingConfigs(
    subscriptions
      .map((subscription) => subscription.agreement?.id ?? "")
      .filter(Boolean)
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
      <Table className="grid-cols-[minmax(192px,auto)_minmax(100px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Consumer</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>Markup</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Billing period</TableHeaderCell>
            <TableHeaderCell>Commitment</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              billingConfig={billingConfigsById[subscription.agreement?.id!]}
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
