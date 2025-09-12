import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, NavLink } from "react-router";
import { Button } from "@ui/button";
import { useAccount } from "@features/account";
import { Tabs } from "@ui/tabs";
import { ErrorCard } from "@ui/error-card";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Dialog, DialogPanel, DialogTitle } from "@ui/dialog";
import { ExtensionDetailsChanges, ExtensionStatus } from "@lib/extension-data";
import {
  useExtensionDetails,
  useExtensionDetailsMutation,
  useExtensionStatusMutations,
} from "@features/extension";
import { Badge } from "@alga-psa/ui-kit";
import { ActionItem, Actions } from "@ui/actions";
import { Input, Textarea } from "@ui/input";

function StatusBadge({ status }: { status?: ExtensionStatus | "error" }) {
  if (!status) return <></>;

  if (status === "error") return <Badge tone="danger">Error</Badge>;
  if (status === "unconfigured")
    return <Badge tone="default">Unconfigured</Badge>;
  if (status === "disabled") return <Badge tone="warning">Disabled</Badge>;

  return <Badge tone="success">Active</Badge>;
}

function SettingsActions({
  status,
}: {
  status: ExtensionStatus | "error" | undefined;
}) {
  const { enable, disable } = useExtensionStatusMutations();

  const [isDisabledOpen, setIsDisabledOpen] = useState(false);
  const [isEnabledOpen, setIsEnabledOpen] = useState(false);

  const [note, setNote] = useState("");

  const canEnable = status === "disabled";
  const canDisable = status === "active";

  const enableExtension = () => {
    enable(note);
    setNote("");
    setIsEnabledOpen(false);
  };

  const disableExtension = () => {
    disable(note);
    setNote("");
    setIsDisabledOpen(false);
  };

  return (
    <>
      <Actions>
        {canEnable && (
          <ActionItem onClick={() => setIsEnabledOpen(true)}>Enable</ActionItem>
        )}
        {canDisable && (
          <ActionItem onClick={() => setIsDisabledOpen(true)}>
            Disable
          </ActionItem>
        )}
        <ActionItem>View documentation</ActionItem>
      </Actions>

      <Dialog open={isEnabledOpen} onClose={() => setIsEnabledOpen(false)}>
        <DialogPanel>
          <DialogTitle onClose={() => setIsEnabledOpen(false)}>
            Enable Extension
          </DialogTitle>
          <div className="text-sm">
            Are you sure you want to enable the SoftwareOne extension? If so,
            leave a note as to why and continue.
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <label className="font-medium">Note</label>
            <Textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-6">
            <Button variant="white" onClick={() => setIsEnabledOpen(false)}>
              Cancel
            </Button>
            <Button onClick={enableExtension}>Enable</Button>
          </div>
        </DialogPanel>
      </Dialog>

      <Dialog open={isDisabledOpen} onClose={() => setIsDisabledOpen(false)}>
        <DialogPanel>
          <DialogTitle onClose={() => setIsDisabledOpen(false)}>
            Disable Extension
          </DialogTitle>
          <div className="text-sm">
            Are you sure you want to disable the SoftwareOne extension? If so,
            leave a note as to why and continue.
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <label className="font-medium">Note</label>
            <Textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-6">
            <Button variant="white" onClick={() => setIsDisabledOpen(false)}>
              Cancel
            </Button>
            <Button onClick={disableExtension}>Disable</Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
function SettingsEditor({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { details } = useExtensionDetails();
  const { saveDetails } = useExtensionDetailsMutation();

  const defaults = useRef<ExtensionDetailsChanges>({
    endpoint: "",
    token: "",
    note: "",
  });

  const [editedDetails, setEditedDetails] = useState<ExtensionDetailsChanges>(
    details || defaults.current
  );

  useEffect(() => {
    setEditedDetails(details || defaults.current);
  }, [details]);

  const handleSave = () => {
    saveDetails(editedDetails);
    onClose();
  };

  const handleCancel = () => {
    setEditedDetails(details || defaults.current);
    onClose();
  };

  return (
    <Drawer open={isOpen} onClose={handleCancel}>
      <DrawerPanel>
        <DrawerTitle onClose={handleCancel}>SoftwareOne Settings</DrawerTitle>

        <div className="grid grid-cols-[auto_380px] gap-10 items-center">
          <label className="text-sm font-medium">API Endpoint</label>
          <Input
            type="text"
            value={editedDetails.endpoint}
            onChange={(e) =>
              setEditedDetails((v) => ({
                ...v,
                endpoint: e.target.value,
              }))
            }
          />

          <label className="text-sm font-medium">API Token</label>
          <Input
            type="password"
            value={editedDetails.token}
            onChange={(e) =>
              setEditedDetails((v) => ({
                ...v,
                token: e.target.value,
              }))
            }
          />

          <label className="text-sm font-medium self-start">Note</label>
          <Textarea
            value={editedDetails.note}
            onChange={(e) =>
              setEditedDetails((v) => ({
                ...v,
                note: e.target.value,
              }))
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

export function Settings() {
  const { error } = useAccount();
  const { details, isLoading } = useExtensionDetails();
  const { saveDetails } = useExtensionDetailsMutation();

  const status = useMemo<ExtensionStatus | "error" | undefined>(
    () => (error ? "error" : details?.status),
    [details?.status, error]
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (details: ExtensionDetailsChanges) => {
    saveDetails(details);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (isLoading) return <></>;

  return (
    <div className="w-full flex flex-col p-8 gap-8">
      <header className="w-full flex justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">SoftwareOne</h1>
          {!!status && <StatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
          <SettingsActions status={status} />
        </div>
      </header>

      {error && <ErrorCard>{error.message}</ErrorCard>}

      <SettingsEditor isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Tabs>
        <NavLink to="general">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>General</Tabs.Tab>}
        </NavLink>
        <NavLink to="details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
