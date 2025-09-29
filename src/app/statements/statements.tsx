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
import { useStatements } from "@features/statements";
import { useBillingConfigs } from "@features/billing-config";
import { BillingConfig } from "@lib/alga";
import { StatementStatus } from "@swo/mp-api-model/billing";
import { Badge } from "@alga-psa/ui-kit";

const StatementStatusBadge = ({ status }: { status?: StatementStatus }) => {
  if (!status) return <span>—</span>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Pending") tone = "warning";
  if (status === "Generated") tone = "default";
  if (status === "Queued") tone = "default";
  if (status === "Error") tone = "danger";
  if (status === "Cancelled") tone = "danger";
  if (status === "Issued") tone = "success";
  if (status === "Generating") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
};

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

export function Statements() {
  const [offset, setOffset] = useState(0);
  const { statements, pagination, isFetching } = useStatements({ offset });

  const { billingConfigs } = useBillingConfigs(
    statements.map((statement) => statement.agreement?.id ?? "").filter(Boolean)
  );

  const billingConfigsById =
    useMemo(
      () =>
        billingConfigs?.reduce(
          (acc, billingConfig) => ({
            ...acc,
            [billingConfig.id!]: billingConfig,
          }),
          {} as Record<string, BillingConfig>
        ),
      [billingConfigs]
    ) || {};

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
            <TableHeaderCell>Subscription</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Consumer</TableHeaderCell>
            <TableHeaderCell>Invoice</TableHeaderCell>
            <TableHeaderCell>Total SP</TableHeaderCell>
            <TableHeaderCell>Markup</TableHeaderCell>
            <TableHeaderCell>Total RP</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statements?.map((statement) => (
            <TableRow key={statement.id} link={`/statements/${statement.id}`}>
              <TableCell>
                <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
                  {statement.id!}
                </span>
              </TableCell>

              <TableCell></TableCell>
              <TableCell></TableCell>
              <ProductCell
                name={statement.product?.name}
                iconUrl={statement.product?.icon}
              />
              <TableCell></TableCell>
              <TableCell></TableCell>

              <TableCell>{statement.price?.totalSP || "—"}</TableCell>
              <MarkupCell
                markup={billingConfigsById[statement.agreement?.id!]?.markup}
              />
              <PriceWithMarkupCell
                price={statement.price?.totalSP}
                markup={billingConfigsById[statement.agreement?.id!]?.markup}
              />
              <TableCell>{statement.price?.currency?.sale || "—"}</TableCell>
              <TableCell>
                <StatementStatusBadge status={statement.status} />
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
