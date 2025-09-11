import {
  useAgreement,
  useAgreementSettings,
  useAgreementSettingsMutation,
} from "@features/agreements/hooks";
import { ActionItem, Actions } from "@ui/actions";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Icon } from "@ui/icon";
import { NavLink, Outlet, useParams } from "react-router";
import {
  Agreement as AgreementType,
  AgreementStatus as AgreementStatusType,
} from "@swo/mp-api-model";
import { Badge } from "@alga-psa/ui-kit";
import { Tabs } from "@ui/tabs";
import { AgreementSettings } from "@features/agreements";
import { useEffect, useState } from "react";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Input, Textarea } from "@ui/forms";

function AgreementActions() {
  return (
    <Actions>
      <ActionItem>Edit</ActionItem>
    </Actions>
  );
}

function StatusBadge({ status }: { status?: AgreementStatusType }) {
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

function AgreementSummary({
  agreement,
  settings,
}: {
  agreement: AgreementType;
  settings: AgreementSettings;
}) {
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
          <span className="text-sm text-black">{settings.markup}%</span>
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

function AgreementSettingsDrawer({
  isOpen,
  onCancel,
  onSaved,
  settings,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSaved: (details: AgreementSettings) => void;
  settings: AgreementSettings;
}) {
  const [editedSettings, setEditedSettings] =
    useState<AgreementSettings>(settings);

  useEffect(() => {
    setEditedSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSaved(editedSettings);
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    onCancel();
  };

  return (
    <Drawer open={isOpen} onClose={handleCancel}>
      <DrawerPanel>
        <DrawerTitle onClose={handleCancel}>SoftwareOne Settings</DrawerTitle>

        <div className="grid grid-cols-[auto_380px] gap-10 items-center">
          <label className="text-sm font-medium">Markup</label>
          <div className="border border-[var(--alga-border)] bg-[var(--alga-bg)] text-[var(--alga-fg)] rounded-[var(--alga-radius)]">
            <Input
              type="number"
              value={editedSettings.markup}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  markup: Number(e.target.value),
                })
              }
              className="border-none bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
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
  const { agreement, isPending } = useAgreement(id!);
  const { settings, isLoading } = useAgreementSettings(id!);
  const { saveSettings } = useAgreementSettingsMutation(id!);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (settings: AgreementSettings) => {
    saveSettings(settings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (isPending || isLoading) return <div>Loading...</div>;

  const { name, status } = agreement;

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
      <AgreementSummary agreement={agreement} settings={settings} />
      <AgreementSettingsDrawer
        isOpen={isOpen}
        onCancel={handleCancel}
        onSaved={handleSave}
        settings={settings}
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
