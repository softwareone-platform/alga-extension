import { Link } from "react-router";
import { useSWOAgreements } from "@features/swo-agreements";

export function Agreements() {
  const { data } = useSWOAgreements();

  return (
    <>
      <h1>Agreements</h1>
      {data?.map((agreement) => (
        <div key={agreement.id}>
          <Link to={`/agreements/${agreement.id}`}>{agreement.name}</Link>
        </div>
      ))}
    </>
  );
}
