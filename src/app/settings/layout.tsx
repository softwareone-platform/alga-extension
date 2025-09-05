import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import { SWOStatus, useSettings, type SWOSettings } from "./_shared";
import { Button } from "@ui/button";
import { useAccount } from "./_shared/account-context";
import { clsx } from "clsx";
import { Tabs } from "@ui/tabs";
import { ErrorCard } from "@ui/error-card";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Drawer, DrawerPanel, DrawerTitle } from "@ui/drawer";
import { Dialog, DialogPanel, DialogTitle } from "@ui/dialog";

function StatusBadge({ status }: { status?: SWOStatus }) {
  if (!status) return <></>;

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
  const { status, enable } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const canEnable = status === "disabled";
  const canDisable = status === "active";

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
            <MenuItem>
              <a className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer">
                Enable
              </a>
            </MenuItem>
          )}
          {canDisable && (
            <MenuItem>
              <a
                className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                Disable
              </a>
            </MenuItem>
          )}
          <MenuItem>
            <a className="block data-focus:bg-gray-100 data-focus:rounded py-1 px-3 cursor-pointer">
              View documentation
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel>
          <DialogTitle onClose={() => setIsOpen(false)}>
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
            />
          </div>
          <div className="flex justify-end gap-6">
            <Button variant="white" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Disable</Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}

export function SettingsLayout() {
  const { error: accountError, isLoading } = useAccount();
  const { settings, status, setSettings, error } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [editedSettings, setEditedSettings] = useState<SWOSettings>(settings);

  useEffect(() => {
    if (accountError) {
      error();
    }
  }, [accountError]);

  const handleSave = () => {
    setSettings(editedSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    setIsOpen(false);
  };

  return (
    <div className="w-full flex flex-col p-8 gap-8">
      <section className="w-full flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">SoftwareOne</h1>
          {!isLoading && <StatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-6">
          <Button
            onClick={() => {
              setEditedSettings(settings);
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
          <Actions />
        </div>
      </section>

      {accountError && <ErrorCard>{accountError.message}</ErrorCard>}

      <Tabs>
        <NavLink to="/settings/general">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>General</Tabs.Tab>}
        </NavLink>
        <NavLink to="/settings/settings">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Settings</Tabs.Tab>}
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
              value={editedSettings.endpoint}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  endpoint: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg text-sm border-gray-300 focus:outline-none"
            />

            <label className="text-sm font-medium">API Token</label>
            <input
              type="password"
              value={editedSettings.token}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  token: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-sm font-medium self-start">Note</label>
            <textarea
              value={editedSettings.note}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
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
