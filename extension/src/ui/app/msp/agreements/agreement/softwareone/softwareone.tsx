import { Card } from "@alga-psa/ui-kit";
import { Icon } from "@ui/icon";
import {
  Agreement as AgreementType,
  SellerQueryModel,
} from "@swo/mp-api-model";
import { AgreementStatusBadge, useAgreement } from "@features/agreements";
import { Price } from "@features/price";
import { useParams } from "react-router";

function Agreement({ agreement }: { agreement: AgreementType }) {
  return (
    <Card className="w-fit">
      <h2 className="text-lg font-semibold text-black mb-4">Agreement</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">{agreement.id}</span>
          <AgreementStatusBadge status={agreement.status} />
        </div>

        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center">
          <Icon
            iconUrl={agreement.product?.icon}
            alt={agreement.product?.name}
            className="size-4"
          />
          <span className="text-sm text-black">
            {agreement.product?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center">
          <Icon
            iconUrl={agreement.vendor?.icon}
            alt={agreement.vendor?.name}
            className="size-4"
          />
          <span className="text-sm text-black">
            {agreement.vendor?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Licensee</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.licensee?.name || "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">SPxM</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            <Price currency={agreement.price?.currency} value={agreement.price?.SPxM} />
          </span>
        </div>

        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            <Price currency={agreement.price?.currency} value={agreement.price?.SPxY} />
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {agreement.price?.currency || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Seller({ seller }: { seller: SellerQueryModel }) {
  return (
    <Card className="w-fit!">
      <h2 className="text-lg font-semibold text-black mb-4">Seller</h2>
      <div className="grid grid-cols-[auto_auto] gap-4">
        <label className="text-sm font-semibold text-black">Name</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">{seller.name || "—"}</span>
        </div>

        <label className="text-sm font-semibold text-black">ID</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">{seller.id || "—"}</span>
        </div>

        <label className="text-sm font-semibold text-black">Address</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {seller.address
              ? `${seller.address.addressLine1}, ${seller.address.city}, ${seller.address.postCode}`
              : "—"}
          </span>
        </div>

        <label className="text-sm font-semibold text-black">Country</label>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-black">
            {seller.address?.country || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function SoftwareOne() {
  const { id } = useParams<{ id: string }>();
  const { agreement, isPending } = useAgreement(id!);

  if (isPending) return <></>;
  if (!agreement) return <div>Agreement not found</div>;

  return (
    <Card className="flex flex-row gap-6 items-start">
      <Agreement agreement={agreement} />
      {agreement.seller && <Seller seller={agreement.seller} />}
    </Card>
  );
}
