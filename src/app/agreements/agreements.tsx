import { useAgreements, AgreementStatusBadge } from "@features/agreements";
import { BillingConfig } from "@lib/alga";
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
import { MarkupCell, PriceWithMarkupCell } from "@features/markup";
import { useBillingConfigs } from "@features/billing-config";

const NameCell = ({
  name,
  id,
  status,
}: {
  name?: string;
  id: string;
  status?: AgreementStatus;
}) => {
  return (
    <TableCell className="grid grid-cols-[auto_auto] gap-y-0.5 gap-x-2 w-full">
      <span className="text-sm text-blue-500 hover:text-blue-600 truncate">
        {name ?? "—"}
      </span>
      <span className="row-span-2 justify-self-end">
        <AgreementStatusBadge status={status} />
      </span>
      <span className="text-xs text-text-500 truncate">{id}</span>
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

export function Agreements() {
  const [offset, setOffset] = useState(0);
  const { agreements, pagination, isFetching } = useAgreements({ offset });
  const { billingConfigs } = useBillingConfigs(
    agreements.map((agreement) => agreement.id!)
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
              <MarkupCell markup={billingConfigsById[agreement.id!]?.markup} />
              <PriceWithMarkupCell
                price={agreement.price?.SPxY}
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
