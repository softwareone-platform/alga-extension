import { useOrder } from "@features/orders";
import { Audit } from "@ui/audit";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";

export function Details() {
  const { id } = useParams<{ id: string }>();
  const { order } = useOrder(id!);

  if (!order) return <></>;

  const { created, updated } = order.audit!;

  return (
    <Card className="flex flex-col">
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
    </Card>
  );
}