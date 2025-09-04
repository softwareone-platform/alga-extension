import { Link } from "react-router";
import { useAgreements } from "./_shared";

export function Agreements() {
  const { data } = useAgreements();

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
