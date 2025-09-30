import { useAgreement } from "@features/agreements";
import { Audit } from "@ui/audit";
import { Card } from "@ui/card";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { useBillingConfig } from "@features/billing-config";

export function Details() {
  const { id } = useParams<{ id: string }>();
  const { agreement } = useAgreement(id!);
  const { billingConfig } = useBillingConfig(id!);

  if (!agreement) return <></>;

  const { created, updated, active, terminated } = agreement.audit!;
  const { updatedAt: algaUpdatedAt } = billingConfig || {};

  const updatedAt =
    algaUpdatedAt &&
    (!updated?.at || dayjs(algaUpdatedAt).isAfter(dayjs(updated.at)))
      ? algaUpdatedAt
      : updated?.at;

  const { note } = billingConfig || {};

  return (
    <Card className="flex flex-col">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={created?.at} by={created?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={updatedAt} by={updated?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Activated
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={active?.at} by={active?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Terminated
        </label>
        <div className="text-sm text-gray-500">
          <Audit at={terminated?.at} by={terminated?.by?.name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Note
        </label>
        <div className="text-sm text-gray-500">{note || "—"}</div>
      </div>
    </Card>
  );
}
