import { useSubscription } from "@features/subscriptions";
import { Audit } from "@ui/audit";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";

export function Details() {
  const { id } = useParams<{ id: string }>();
  const { subscription } = useSubscription(id!);

  if (!subscription) return <></>;

  const { created, updated, active, terminated, expired, renewed } =
    subscription.audit!;

  return (
    <Card className="flex flex-col">
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

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Expired
        </label>
        <Audit at={expired?.at} by={expired?.by?.name} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Renewed
        </label>
        <Audit at={renewed?.at} by={renewed?.by?.name} />
      </div>
    </Card>
  );
}
