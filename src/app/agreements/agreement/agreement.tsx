import { ActionItem, Actions } from "@ui/actions";
import { Button } from "@ui/button";
import { useParams } from "react-router";

function AgreementActions() {
  return (
    <Actions>
      <ActionItem>Edit</ActionItem>
    </Actions>
  );
}

export function Agreement() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <section className="w-full flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{id}</h1>
        </div>
        <div className="flex items-center gap-6">
          <Button>Edit</Button>
          <AgreementActions />
        </div>
      </section>
    </div>
  );
}
