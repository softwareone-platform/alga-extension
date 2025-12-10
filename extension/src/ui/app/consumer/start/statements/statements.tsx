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
import { useStatements } from "@features/statements";
import { AgreementCell } from "@features/agreements";
import { ProductCell } from "@features/products";
import { useBillingConfigsByConsumer } from "@features/billing-config";
import { BillingConfig } from "@lib/alga-proxy";
import { Statement } from "@swo/mp-api-model/billing";

const StatementRow = ({
  statement,
  billingConfig,
}: {
  statement: Statement;
  billingConfig?: BillingConfig;
}) => (
  <TableRow link={`/consumer/statements/${statement.id}`}>
    <TableCell>
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {statement.id!}
      </span>
    </TableCell>
    <TableCell>{statement.type || "—"}</TableCell>
    <AgreementCell
      name={statement.agreement?.name}
      id={statement.agreement?.id}
    />
    <ProductCell
      name={statement.product?.name}
      iconUrl={statement.product?.icon}
    />
    <TableCell></TableCell>
    <PriceWithMarkupCell
      price={statement.price?.totalSP}
      markup={billingConfig?.markup}
    />
    <TableCell>{statement.price?.currency?.sale || "—"}</TableCell>
  </TableRow>
);

export function Statements() {
  const [offset, setOffset] = useState(0);

  const { billingConfigs } = useBillingConfigsByConsumer(
    "eeca06d2-a0f2-42a5-a33d-ecd7db5430d0"
  );

  const { statements, pagination, isFetching } = useStatements(
    { offset },
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
      <Table className="grid-cols-[minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Statement Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Invoice</TableHeaderCell>
            <TableHeaderCell>Total RP</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements?.map((statement) => (
            <StatementRow
              key={statement.id}
              statement={statement}
              billingConfig={billingConfigsById[statement.agreement?.id!]}
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
