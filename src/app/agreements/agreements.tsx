import { Link, useNavigate } from "react-router";
import {
  useSWOAgreements,
  useAlgaAgreements,
  AgreementStatusBadge,
} from "@features/agreements";
import { Agreement as AlgaAgreement } from "@lib/alga";
import { useMemo } from "react";
import { Card } from "@ui/card";
import { AgreementStatus } from "@swo/mp-api-model";

const NameCell = ({
  name,
  id,
  status,
}: {
  name?: string;
  id?: string;
  status?: AgreementStatus;
}) => {
  return (
    <div className="grid grid-cols-[auto_auto] gap-y-0.5 w-full">
      <Link
        to={`/agreements/${id}`}
        className="text-sm text-blue-500 hover:text-blue-600 truncate"
      >
        {name}
      </Link>
      <span className="row-span-2 justify-self-end">
        <AgreementStatusBadge status={status} />
      </span>
      <span className="text-xs text-gray-500 truncate">{id}</span>
    </div>
  );
};

export function Agreements() {
  const { agreements: swoAgreements } = useSWOAgreements();
  const { agreements: algaAgreements } = useAlgaAgreements(
    (swoAgreements || []).map((agreement) => agreement.id!)
  );

  const navigate = useNavigate();

  const algaAgreementsById = useMemo(
    () =>
      algaAgreements?.reduce((acc, agreement) => {
        acc[agreement.id!] = agreement;
        return acc;
      }, {} as Record<string, AlgaAgreement>),
    [algaAgreements]
  );

  console.log(algaAgreementsById);

  return (
    <Card>
      <h1>Agreements</h1>
      <table className="w-full grid grid-cols-[1fr_1fr_1fr_160px_100px_100px_100px_120px_100px]">
        <thead className="contents">
          <tr className="contents">
            <th>Name</th>
            <th>Product</th>
            <th>Billing config ID</th>
            <th>Customer</th>
            <th>SPxY</th>
            <th>Markup</th>
            <th>RPxY</th>
            <th>Operations</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody className="contents">
          {swoAgreements?.map((agreement) => (
            <tr
              className="contents"
              key={agreement.id}
              onClick={() => navigate(`/agreements/${agreement.id}`)}
            >
              <td>
                <NameCell
                  name={agreement.name}
                  id={agreement.id}
                  status={agreement.status}
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
