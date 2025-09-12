import { ActionItem, Actions } from "@ui/actions";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import { AgreementStatus as SWOAgreementStatus } from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";
import { Tabs } from "@ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Input, Textarea } from "@ui/input";
import {
  useAlgaAgreement,
  useAlgaAgreementSettingsMutation,
  useSWOAgreement,
} from "@features/agreements";
import {
  AgreementChanges as AlgaAgreementChanges,
  Operations,
  PlanService,
} from "@lib/alga";
import { Radio, RadioGroup } from "@ui/radio";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@ui/listbox";

function AgreementActions() {
  return (
    <Actions>
      <ActionItem>Edit</ActionItem>
    </Actions>
  );
}

function StatusBadge({ status }: { status?: SWOAgreementStatus }) {
  if (!status) return <></>;

  let tone: "danger" | "default" | "success" | "warning" = "default";

  if (status === "Failed") tone = "danger";
  if (status === "Draft") tone = "default";
  if (status === "Provisioning") tone = "warning";
  if (status === "Updating") tone = "warning";
  if (status === "Active") tone = "success";
  if (status === "Terminated") tone = "default";
  if (status === "Deleted") tone = "default";

  return <Badge tone={tone}>{status}</Badge>;
}

function AgreementSummary({ id }: { id: string }) {
  const { agreement: swoAgreement, isPending: isSWOPending } =
    useSWOAgreement(id);
  const { agreement: algaAgreement, isPending: isAlgaPending } =
    useAlgaAgreement(id);

  const RPxY = useMemo(() => {
    if (!algaAgreement?.markup || !swoAgreement?.price?.SPxY) return undefined;

    const val = swoAgreement?.price?.SPxY * (1 + algaAgreement?.markup / 100);
    return (Math.round(val * 100) / 100).toFixed(2);
  }, [swoAgreement?.price?.SPxY, algaAgreement?.markup]);

  if (isSWOPending || isAlgaPending) return <div>Loading...</div>;

  if (!swoAgreement) return <div>Agreement not found</div>;

  return (
    <Card className="flex flex-row justify-between">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Agreement ID</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{swoAgreement.id}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Product</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={swoAgreement.product?.icon}
            alt={swoAgreement.product?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {swoAgreement.product?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Vendor</label>
        <div className="flex gap-2 items-center grow">
          <Icon
            iconUrl={swoAgreement.vendor?.icon}
            alt={swoAgreement.vendor?.name}
            className="size-8"
          />
          <span className="text-sm text-black">
            {swoAgreement.vendor?.name || "—"}
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
            {swoAgreement.licensee?.name || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">SPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {swoAgreement.price?.SPxY || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Markup</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {algaAgreement?.markup ? `${algaAgreement.markup}%` : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">RPxY</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">{RPxY || "—"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Currency</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {swoAgreement.price?.currency || "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-black">Operations</label>
        <div className="flex gap-2 items-center grow">
          <span className="text-sm text-black">
            {algaAgreement?.operations || "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

function AgreementEditor({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) {
  const defaults = useMemo<AlgaAgreementChanges>(
    () => ({
      id,
      consumerId: "",
      planService: "payg",
      operations: "self-service",
      markup: 0,
      note: "",
    }),
    [id]
  );

  const { agreement: algaAgreement } = useAlgaAgreement(id);

  const { saveAgreement } = useAlgaAgreementSettingsMutation();

  const [editedSettings, setEditedSettings] = useState<AlgaAgreementChanges>(
    algaAgreement || defaults
  );

  useEffect(() => {
    setEditedSettings(algaAgreement || defaults);
  }, [algaAgreement, defaults]);

  const handleSave = () => {
    saveAgreement(editedSettings);
    onClose();
  };

  const handleCancel = () => {
    setEditedSettings(algaAgreement || defaults);
    onClose();
  };

  return (
    <Drawer open={isOpen} onClose={handleCancel}>
      <DrawerPanel>
        <DrawerTitle onClose={handleCancel}>SoftwareOne Settings</DrawerTitle>

        <div className="grid grid-cols-[auto_380px] gap-10 items-center">
          <label className="text-sm font-medium">Plan Service</label>
          <div>
            <Listbox
              value={editedSettings.planService}
              onChange={(planService: PlanService) =>
                setEditedSettings({
                  ...editedSettings,
                  planService,
                })
              }
            >
              <ListboxButton>{editedSettings.planService}</ListboxButton>
              <ListboxOptions>
                <ListboxOption value="payg">Pay as you go (PAYG)</ListboxOption>
              </ListboxOptions>
            </Listbox>
          </div>
          <label className="text-sm font-medium">Markup</label>
          <div className="relative">
            <Input
              type="number"
              value={editedSettings.markup}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  markup: Number(e.target.value),
                })
              }
              className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] pr-13"
            />
            <span className="absolute right-0 top-[1px] h-[calc(100%-2px)] flex items-center justify-center text-sm border-l border-gray-300 w-10 px-2">
              %
            </span>
          </div>

          <label className="text-sm font-medium self-start">Operations</label>
          <RadioGroup
            value={editedSettings.operations}
            onChange={(operations: Operations) =>
              setEditedSettings({
                ...editedSettings,
                operations,
              })
            }
            aria-label="Operations"
          >
            <Radio value="self-service">
              <span>Self-service (Clients will see Agreement details)</span>
            </Radio>
            <Radio value="managed">
              <span>Managed (Not visible to Clients)</span>
            </Radio>
          </RadioGroup>

          <label className="text-sm font-medium self-start">Note</label>
          <Textarea
            value={editedSettings.note}
            onChange={(e) =>
              setEditedSettings({
                ...editedSettings,
                note: e.target.value,
              })
            }
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-6">
          <Button variant="white" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DrawerPanel>
    </Drawer>
  );
}

export function Agreement() {
  const { id } = useParams<{ id: string }>();
  const { agreement: swoAgreement, isPending: isSWOPending } = useSWOAgreement(
    id!
  );
  const [isOpen, setIsOpen] = useState(false);

  if (isSWOPending) return <div>Loading...</div>;

  if (!swoAgreement) return <div>Agreement not found</div>;

  const { name, status } = swoAgreement;

  return (
    <div className="w-full flex flex-col p-6 gap-8">
      <header className="w-full flex justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">{name}</h1>
          {!!status && <StatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
          <AgreementActions />
        </div>
      </header>
      <AgreementSummary id={id!} />
      <AgreementEditor
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id={id!}
      />
      <Tabs>
        <NavLink to="softwareone">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>SoftwareOne</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="subscriptions">
          {({ isActive }) => (
            <Tabs.Tab isActive={isActive}>Subscriptions</Tabs.Tab>
          )}
        </NavLink>
        <NavLink to="orders">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Orders</Tabs.Tab>}
        </NavLink>
        <NavLink to="consumer">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Consumer</Tabs.Tab>}
        </NavLink>
        <NavLink to="billing">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Billing</Tabs.Tab>}
        </NavLink>
        <NavLink to="details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
