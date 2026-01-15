import { useState } from "react";
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
import { useStatements } from "@features/statements";
import { AlgaInvoiceStatusBadge } from "@/ui/features/statements/components";
import { AgreementCell } from "@features/agreements";
import { ProductCell } from "@features/products";
import { Statement } from "@/shared/statements";
import { ConsumerLink, useConsumer } from "@features/consumers";
import { useBillingConfigByAgreement } from "@/ui/features/billing-config";

const StatementRow = ({ statement }: { statement: Statement }) => {
  const { billingConfig } = useBillingConfigByAgreement(
    statement?.agreement?.id,
  );
  const { consumer } = useConsumer(billingConfig?.consumerId);

  return (
    <TableRow link={`/statements/${statement.id}`}>
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
      <TableCell>
        <ConsumerLink id={consumer?.id!} name={consumer?.name!} />
      </TableCell>
      <TableCell></TableCell>
      <TableCell>{statement.price?.totalSP || "—"}</TableCell>
      <MarkupCell markup={billingConfig?.markup} />
      <PriceWithMarkupCell
        price={statement.price?.totalSP}
        markup={billingConfig?.markup}
      />
      <TableCell>{statement.price?.currency?.sale || "—"}</TableCell>
      <TableCell>
        <AlgaInvoiceStatusBadge status={statement.alga.status} />
      </TableCell>
    </TableRow>
  );
};

export function Statements() {
  const [offset, setOffset] = useState(0);
  const { statements, pagination, isFetching } = useStatements({ offset });

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Statement Type</TableHeaderCell>
            <TableHeaderCell>Agreement</TableHeaderCell>
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
            <StatementRow key={statement.id} statement={statement} />
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
