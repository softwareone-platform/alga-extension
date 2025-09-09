import { useExtensionDetails } from "@features/extension";
import { Card } from "@ui/card";
import dayjs from "dayjs";

export function Details() {
  const { details } = useExtensionDetails();

  return (
    <Card className="flex flex-col">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>
        <div className="text-sm text-gray-500">
          {dayjs(details.createdAt).format("HH:mm MM/DD/YYYY") || "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <div className="text-sm text-gray-500">
          {dayjs(details.updatedAt).format("HH:mm MM/DD/YYYY") || "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Activated
        </label>
        <div className="text-sm text-gray-500">
          {dayjs(details.activatedAt).format("HH:mm MM/DD/YYYY") || "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Disabled
        </label>
        <div className="text-sm text-gray-500">
          {dayjs(details.disabledAt).format("HH:mm MM/DD/YYYY") || "—"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Note
        </label>
        <div className="text-sm text-gray-500">{details.note || "—"}</div>
      </div>
    </Card>
  );
}
