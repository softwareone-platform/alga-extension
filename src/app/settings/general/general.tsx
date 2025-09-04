import { useAccount } from "../_shared/use-account";

export function General() {
  const { data: account } = useAccount();

  return (
    <div className="w-full bg-white rounded-2xl p-6 flex flex-col gap-6 border border-gray-200">
      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Account Name
        </label>
        <div className="text-sm text-gray-500">{account?.name || "-"}</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Account ID
        </label>
        <div className="text-sm text-gray-500">{account?.id || "-"}</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Company Description
        </label>
        <div className="text-sm text-gray-500">
          {account?.description || "-"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Company Website
        </label>
        <div className="text-sm text-gray-500">{account?.website || "-"}</div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          Headquarters address
        </label>
        {!account?.address && <div>-</div>}
        {account?.address && (
          <div className="text-sm text-gray-500 flex flex-col">
            <span>Address line1: {account?.address.addressLine1}</span>
            <span>Address line2: {account?.address.addressLine2}</span>
            <span>City: {account?.address.city}</span>
            <span>ZIP/post code: {account?.address.postCode}</span>
            <span>State: {account?.address.state}</span>
            <span>Country: {account?.address.country}</span>
          </div>
        )}
      </div>
    </div>
  );
}
