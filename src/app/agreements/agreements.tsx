import {
  useSWOAgreements,
  useAlgaAgreements,
  AgreementStatusBadge,
} from "@features/agreements";
import { Agreement as AlgaAgreement } from "@lib/alga";
import { useMemo } from "react";
import { Card } from "@ui/card";
import { AgreementStatus } from "@swo/mp-api-model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@ui/table";
import { Icon } from "@ui/icon";
import { calculateRPxY } from "./utils";

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
        {name || "—"}
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
  const { agreements: swoAgreements } = useSWOAgreements();
  const { agreements: algaAgreements } = useAlgaAgreements(
    (swoAgreements || []).map((agreement) => agreement.id!)
  );

  const algaAgreementsById =
    useMemo(
      () =>
        algaAgreements?.reduce((acc, agreement) => {
          acc[agreement.id!] = agreement;
          return acc;
        }, {} as Record<string, AlgaAgreement>),
      [algaAgreements]
    ) || {};

  return (
    <Card>
      <Table className="grid-cols-[minmax(192px,auto)_minmax(192px,auto)_minmax(150px,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)_minmax(0,auto)]">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Product</TableHeadCell>
            <TableHeadCell>Billing config ID</TableHeadCell>
            <TableHeadCell>Customer</TableHeadCell>
            <TableHeadCell>SPxY</TableHeadCell>
            <TableHeadCell>Markup</TableHeadCell>
            <TableHeadCell>RPxY</TableHeadCell>
            <TableHeadCell>Operations</TableHeadCell>
            <TableHeadCell>Currency</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {swoAgreements?.map((agreement) => (
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
                {algaAgreementsById[agreement.id!]?.markup
                  ? `${algaAgreementsById[agreement.id!]?.markup}%`
                  : "—"}
              </TableCell>
              <TableCell>
                {calculateRPxY(
                  agreement.price?.SPxY || 0,
                  algaAgreementsById[agreement.id!]?.markup || 0
                )}
              </TableCell>
              <TableCell>
                {algaAgreementsById[agreement.id!]?.operations == "managed" && (
                  <span>Managed</span>
                )}
                {algaAgreementsById[agreement.id!]?.operations ==
                  "self-service" && <span>Self-service</span>}
                {!algaAgreementsById[agreement.id!]?.operations && (
                  <span>—</span>
                )}
              </TableCell>
              <TableCell>{agreement.price?.currency || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
