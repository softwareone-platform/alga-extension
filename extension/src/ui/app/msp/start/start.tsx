import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import { Button } from "@alga-psa/ui-kit";
import { useAccount } from "@features/account";
import { Tabs } from "@ui/tabs";
import { ErrorCard } from "@ui/error-card";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Dialog, DialogPanel, DialogTitle } from "@ui/dialog";
import {
  useExtensionDetails,
  useExtensionDetailsMutation,
} from "@features/extension";
import { Badge } from "@alga-psa/ui-kit";
import { ActionItem, Actions } from "@ui/actions";
import { Input, Textarea } from "@ui/input";
import { ExtensionStatus } from "@/shared/extension-details";

function StatusBadge({
  status,
  hasError,
}: {
  status: ExtensionStatus;
  hasError: boolean;
}) {
  if (hasError) return <Badge tone="danger">Error</Badge>;

  if (status === "unconfigured")
    return <Badge tone="default">Unconfigured</Badge>;
  if (status === "disabled") return <Badge tone="warning">Disabled</Badge>;
  if (status === "active") return <Badge tone="success">Active</Badge>;

  return <></>;
}

function SettingsActions() {
  const { details } = useExtensionDetails();

  const { saveDetails } = useExtensionDetailsMutation();

  const [isDisabledOpen, setIsDisabledOpen] = useState(false);
  const [isEnabledOpen, setIsEnabledOpen] = useState(false);

  const [note, setNote] = useState("");

  const isConfigured = !!details?.endpoint && !!details?.hasToken;

  const canEnable = isConfigured && details?.status !== "active";
  const canDisable = isConfigured && details?.status !== "disabled";

  const setStatus = (status: "active" | "disabled") => {
    saveDetails({
      note,
      status,
    });
    setNote("");
    setIsEnabledOpen(false);
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
            <Button variant="outline" onClick={() => setIsEnabledOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setStatus("active")}>Enable</Button>
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
            <Button variant="outline" onClick={() => setIsDisabledOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setStatus("disabled")}>Disable</Button>
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

  const [endpoint, setEndpoint] = useState<string>(details?.endpoint || "");
  const [token, setToken] = useState<string>(
    details?.hasToken ? "token-placeholder" : ""
  );
  const [note, setNote] = useState<string>(details?.note || "");

  useEffect(() => {
    setEndpoint(details?.endpoint || "");
    setToken(details?.hasToken ? "token-placeholder" : "");
    setNote(details?.note || "");
  }, [details]);

  const handleSave = () => {
    saveDetails({
      endpoint,
      token,
      note,
    });
    onClose();
  };

  const handleCancel = () => {
    setEndpoint(details?.endpoint || "");
    setToken(details?.hasToken ? "token-placeholder" : "");
    setNote(details?.note || "");
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
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />

          <label className="text-sm font-medium">API Token</label>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <label className="text-sm font-medium self-start">Note</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DrawerPanel>
    </Drawer>
  );
}

export function Start() {
  const { error } = useAccount();
  const { isLoading, details } = useExtensionDetails();

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !details) return <></>;

  return (
    <div className="w-full flex flex-col p-8 gap-8">
      <header className="w-full flex justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold">SoftwareOne</h1>
          <StatusBadge status={details.status} hasError={!!error} />
        </div>
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
          <SettingsActions />
        </div>
      </header>

      {error && <ErrorCard>{error.message}</ErrorCard>}

      <SettingsEditor isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Tabs>
        {details.status !== "unconfigured" && (<>
          <NavLink to="/start/agreements">
            {({ isActive }) => (
              <Tabs.Tab isActive={isActive}>Agreements</Tabs.Tab>
            )}
          </NavLink>
          <NavLink to="/start/subscriptions">
            {({ isActive }) => (
              <Tabs.Tab isActive={isActive}>Subscriptions</Tabs.Tab>
            )}
          </NavLink>
          <NavLink to="/start/orders">
            {({ isActive }) => <Tabs.Tab isActive={isActive}>Orders</Tabs.Tab>}
          </NavLink>
          <NavLink to="/start/statements">
            {({ isActive }) => (
              <Tabs.Tab isActive={isActive}>Statements</Tabs.Tab>
            )}
          </NavLink>
        </>)}
        <NavLink to="/start/settings">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Settings</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />
    </div>
  );
}
