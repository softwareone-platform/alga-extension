import { useExtensionDetails } from "@features/extension";
import { Card } from "@ui/card";
import dayjs from "dayjs";

export function Details() {
  const { details } = useExtensionDetails();

  const { createdAt, updatedAt, activatedAt, disabledAt, note } = details || {};

  return (
    <Card className="flex flex-col">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>
        <div className="text-sm text-gray-500">
          {createdAt ? dayjs(createdAt).format("HH:mm MM/DD/YYYY") : "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <div className="text-sm text-gray-500">
          {updatedAt ? dayjs(updatedAt).format("HH:mm MM/DD/YYYY") : "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Activated
        </label>
        <div className="text-sm text-gray-500">
          {activatedAt ? dayjs(activatedAt).format("HH:mm MM/DD/YYYY") : "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Disabled
        </label>
        <div className="text-sm text-gray-500">
          {disabledAt ? dayjs(disabledAt).format("HH:mm MM/DD/YYYY") : "—"}
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
