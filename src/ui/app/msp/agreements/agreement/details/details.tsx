import { useAgreement } from "@features/agreements";
import { Audit } from "@ui/audit";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";

export function Details() {
  const { id } = useParams<{ id: string }>();
  const { agreement } = useAgreement(id!);

  if (!agreement) return <></>;

  const { created, updated, active, terminated } = agreement.audit!;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>
        <Audit at={created?.at} by={created?.by?.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <Audit at={updated?.at} by={updated?.by?.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Activated
        </label>
        <Audit at={active?.at} by={active?.by?.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Terminated
        </label>
        <Audit at={terminated?.at} by={terminated?.by?.name} />
      </div>
    </Card>
  );
}
