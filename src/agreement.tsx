import { useParams } from "react-router";

export default function Agreement() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Agreement Details</h1>
      <p>Agreement ID: {id}</p>
      <p>Agreement component - coming soon</p>
    </div>
  );
}