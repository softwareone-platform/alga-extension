import { AgreementStatusBadge } from "@features/agreements";
import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { AgreementStatus } from "@swo/mp-api-model";
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
import { RPxYCell } from "@features/rpxy";

const NameCell = ({ id }: { id: string }) => {
  return (
    <TableCell className="grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2 w-full">
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {id ?? "—"}
      </span>
    </TableCell>
  );
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

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Billing config ID</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>SPxY</TableHeaderCell>
            <TableHeaderCell>Markup</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Operations</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements?.map((agreement) => (
            <TableRow key={agreement.id} link={`/agreements/${agreement.id}`}>
              <NameCell
                name={agreement.name}
                id={agreement.id!}
                status={agreement.status}
              />

              <ProductCell
                name={agreement.product?.name}
                iconUrl={agreement.product?.icon}
              />
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{agreement.price?.SPxY || "—"}</TableCell>
              <TableCell>
                {billingConfigsById[agreement.id!]?.markup
                  ? `${billingConfigsById[agreement.id!]?.markup}%`
                  : "—"}
              </TableCell>
              <RPxYCell
                SPxY={agreement.price?.SPxY}
                markup={billingConfigsById[agreement.id!]?.markup}
              />
              <TableCell>
                {billingConfigsById[agreement.id!]?.operations == "managed" && (
                  <span>Managed</span>
                )}
                {billingConfigsById[agreement.id!]?.operations ==
                  "self-service" && <span>Self-service</span>}
                {!billingConfigsById[agreement.id!]?.operations && (
                  <span>—</span>
                )}
              </TableCell>
              <TableCell>{agreement.price?.currency || "—"}</TableCell>
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
