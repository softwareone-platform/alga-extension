import { useStatement } from "@features/statements";
import { Audit } from "@ui/audit";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";

export function Details() {
  const { id } = useParams<{ id: string }>();
  const { statement } = useStatement(id!);

  if (!statement) return <></>;

  const {
    created,
    updated,
    generated,
    queued,
    error,
    cancelled,
    pending,
    issued,
    generating,
  } = statement.audit!;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>{" "}
        <Audit at={created?.at} by={created?.by?.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={updated?.at} by={updated?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Queued
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={queued?.at} by={queued?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Pending
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={pending?.at} by={pending?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Generating
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={generating?.at} by={generating?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Generated
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={generated?.at} by={generated?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Issued
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={issued?.at} by={issued?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Cancelled
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={cancelled?.at} by={cancelled?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Error
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={error?.at} by={error?.by?.name} />
        </div>
      </div>
    </Card>
  );
}
