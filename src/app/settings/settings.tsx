import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import { Button } from "@ui/button";
import { useAccount } from "@features/account";
import { clsx } from "clsx";
import { Tabs } from "@ui/tabs";
import { ErrorCard } from "@ui/error-card";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Button as HeadlessButton,
} from "@headlessui/react";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Dialog, DialogPanel, DialogTitle } from "@ui/dialog";
import { ExtensionDetails, ExtensionStatus } from "@lib/extension-data";
import {
  useExtensionDetails,
  useExtensionDetailsMutation,
  useExtensionDetailsMutations,
} from "@features/extension";
import { Badge } from "@alga-psa/ui-kit";

function StatusBadge({ status }: { status?: ExtensionStatus | "error" }) {
  if (!status) return <></>;

  if (status === "error") return <Badge tone="danger">Error</Badge>;
  if (status === "unconfigured")
    return <Badge tone="default">Unconfigured</Badge>;
  if (status === "disabled") return <Badge tone="warning">Disabled</Badge>;
  if (status === "active") return <Badge tone="success">Active</Badge>;

  return (
    <span
      className={clsx("text-sm px-2 py-0.5 rounded block", {
        "bg-success-1 text-success-4": status === "active",
        "bg-warning-1 text-warning-4": status === "disabled",
        "bg-danger-1 text-danger-4": status === "error",
        "bg-gray-200 text-gray-800": status === "unconfigured",
      })}
    >
      {status}
    </span>
  );
}

function Actions() {
  const { enable, disable } = useExtensionDetailsMutations();
  const {
    details: { status },
  } = useExtensionDetails();

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
      <Menu>
        <MenuButton as={Button} variant="white">
          Actions
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          className="bg-white border border-gray-200 rounded-lg p-1 outline-0 mt-1 text-sm shadow-xl"
        >
          {canEnable && (
            <MenuItem
              as={HeadlessButton}
              className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer w-full text-left"
              onClick={() => setIsEnabledOpen(true)}
            >
              Enable
            </MenuItem>
          )}
          {canDisable && (
            <MenuItem
              as={HeadlessButton}
              className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer w-full text-left"
              onClick={() => setIsDisabledOpen(true)}
            >
              Disable
            </MenuItem>
          )}
          <MenuItem>
            <a className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer">
              View documentation
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>

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
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
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
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
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

export function Settings() {
  const { error } = useAccount();
  const { details, isLoading } = useExtensionDetails();
  const { saveDetails } = useExtensionDetailsMutation();

  const [editedDetails, setEditedDetails] = useState<ExtensionDetails>(details);

  const [isOpen, setIsOpen] = useState(false);

  const [status, setStatus] = useState<ExtensionStatus | "error" | "">(
    details.status
  );

  useEffect(() => {
    setEditedDetails(details);
    setStatus(details.status);
  }, [details]);

  useEffect(() => {
    if (error) {
      setStatus("error");
    }
  }, [error]);

  const handleSave = () => {
    saveDetails(editedDetails);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedDetails(details);
    setIsOpen(false);
  };

  if (isLoading) return <></>;

  return (
    <div className="w-full flex flex-col p-8 gap-8">
      <section className="w-full flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">SoftwareOne</h1>
          {!!status && <StatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
          <Actions />
        </div>
      </section>

      {error && <ErrorCard>{error.message}</ErrorCard>}

      <Tabs>
        <NavLink to="/settings/general">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>General</Tabs.Tab>}
        </NavLink>
        <NavLink to="/settings/details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />

      <Drawer open={isOpen} onClose={handleCancel}>
        <DrawerPanel>
          <DrawerTitle onClose={handleCancel}>SoftwareOne Settings</DrawerTitle>

          <div className="grid grid-cols-[auto_380px] gap-10 items-center">
            <label className="text-sm font-medium">API Endpoint</label>
            <input
              type="text"
              value={editedDetails.endpoint}
              onChange={(e) =>
                setEditedDetails({
                  ...editedDetails,
                  endpoint: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg text-sm border-gray-300 focus:outline-none"
            />

            <label className="text-sm font-medium">API Token</label>
            <input
              type="password"
              value={editedDetails.token}
              onChange={(e) =>
                setEditedDetails({
                  ...editedDetails,
                  token: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-sm font-medium self-start">Note</label>
            <textarea
              value={editedDetails.note}
              onChange={(e) =>
                setEditedDetails({
                  ...editedDetails,
                  note: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
}
