import { useAgreements, AgreementStatusBadge } from "@features/agreements";
import { ProductCell } from "@features/products";
import { BillingConfig } from "@/lib/billing-config";
import { useMemo, useState } from "react";
import { Card } from "@ui/card";
import { Agreement, AgreementStatus } from "@swo/mp-api-model";
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
import { useBillingConfigs } from "@/ui/features/billing-config";

const NameCell = ({
  name,
  id,
  status,
}: {
  name?: string | null;
  id: string;
  status?: AgreementStatus | null;
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

const AgreementRow = ({
  agreement,
  billingConfig,
}: {
  agreement: Agreement;
  billingConfig?: BillingConfig;
}) => {
  return (
    <TableRow link={`/consumer/agreements/${agreement.id}`}>
      <NameCell
        name={agreement.name}
        id={agreement.id!}
        status={agreement.status}
      />

      <ProductCell
        name={agreement.product?.name}
        iconUrl={agreement.product?.icon}
      />
      <PriceWithMarkupCell
        price={agreement.price?.SPxY}
        markup={billingConfig?.markup}
      />
      <TableCell>{agreement.price?.currency || "—"}</TableCell>
    </TableRow>
  );
};

export function Agreements() {
  const [offset, setOffset] = useState(0);

  const { billingConfigs } = useBillingConfigs();
  const billingConfigsById =
    useMemo(
      () =>
        billingConfigs
          ?.filter(
            (bc) =>
              bc.consumerId === "eeca06d2-a0f2-42a5-a33d-ecd7db5430d0" &&
              bc.status === "active" &&
              bc.operations === "self-service"
          )
          .reduce(
            (acc, billingConfig) => ({
              ...acc,
              [billingConfig.agreementId!]: billingConfig,
            }),
            {} as Record<string, BillingConfig>
          ),
      [billingConfigs]
    ) || {};

  const { agreements, pagination, isFetching } = useAgreements(
    { offset },
    Object.keys(billingConfigsById)
  );

  return (
    <Card>
      <Table className="grid-cols-[minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>RPxY</TableHeaderCell>
            <TableHeaderCell>Currency</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements?.map((agreement) => (
            <AgreementRow
              key={agreement.id}
              agreement={agreement}
              billingConfig={billingConfigsById[agreement.id!]}
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
