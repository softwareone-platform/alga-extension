import { Link } from "react-router";
import "./agreements.css";
import { useAgreements } from "./hooks/use-agreements";

function Agreements() {
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

export default Agreements;
