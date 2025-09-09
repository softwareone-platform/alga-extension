import { useAgreement } from "@features/agreements/hooks";
import { ActionItem, Actions } from "@ui/actions";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { useParams } from "react-router";
import { Agreement as AgreementType } from "@swo/mp-api-model";

function AgreementActions() {
  return (
    <Actions>
      <ActionItem>Edit</ActionItem>
    </Actions>
  );
  XMLDocument;
}

function AgreementSummary({ agreement }: { agreement: AgreementType }) {
  return (
    <Card className="flex flex-row">
      <div>
        <label className="block text-sm font-semibold text-black">
          Agreement ID
        </label>
        <div className="text-sm text-black">{agreement.id}</div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-black">
          Product
        </label>
        <div className="text-sm text-black">{agreement.product?.name}</div>
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
