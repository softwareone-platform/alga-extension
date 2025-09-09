import { useAgreement } from "@features/agreements/hooks";
import { ActionItem, Actions } from "@ui/actions";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { useParams } from "react-router";
import { Agreement as AgreementType } from "@swo/mp-api-model";

function AgreementActions() {
  return (
    <Actions>
      <ActionItem>Edit</ActionItem>
    </Actions>
  );
}

function AgreementSummary({ agreement }: { agreement: AgreementType }) {
  return (
    <Card className="flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{agreement.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.product?.icon}
            alt={agreement.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={agreement.vendor?.icon}
            alt={agreement.vendor?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {agreement.vendor?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">
          Billing config
        </label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">—</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Consumer</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.licensee?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.price?.SPxY || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Margin</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">—</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">—</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {agreement.price?.currency || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Operations</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">—</span>
        </div>
      </div>
    </Card>
  );
}

export function Agreement() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useAgreement(id!);

  if (isPending) return <div>Loading...</div>;

  const { name } = data!;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{name}</h1>
        </div>
        <div className="flex items-center gap-6">
          <Button>Edit</Button>
          <AgreementActions />
        </div>
      </header>
      <AgreementSummary agreement={data!} />
    </div>
  );
}
