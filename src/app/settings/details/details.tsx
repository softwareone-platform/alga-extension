import { Card } from "@ui/card";

export function Details() {
  return (
    <Card>
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Created
        </label>
        <div className="text-sm text-gray-500">-</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Updated
        </label>
        <div className="text-sm text-gray-500">-</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Activated
        </label>
        <div className="text-sm text-gray-500">-</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Disabled
        </label>
        <div className="text-sm text-gray-500">-</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Note
        </label>
        <div className="text-sm text-gray-500">-</div>
      </div>
    </Card>
  );
}
