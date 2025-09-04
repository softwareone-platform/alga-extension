import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { SWOStatus, useSettings, type SWOSettings } from "./_shared";
import { Button } from "@ui/button";
import { useAccount } from "./_shared/account-context";
import { clsx } from "clsx";
import { Tabs } from "@ui/tabs";
import { ErrorCard } from "@ui/error-card";

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

export function SettingsLayout() {
  const { error: accountError } = useAccount();
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
          <StatusBadge status={status} />
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
          <Button variant="white">Actions</Button>
        </div>
      </section>

      {accountError && <ErrorCard>{accountError.message}</ErrorCard>}

      <Tabs>
        <NavLink to="/settings/general">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>General</Tabs.Tab>}
        </NavLink>
        <NavLink to="/settings/details">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Details</Tabs.Tab>}
        </NavLink>
        <NavLink to="/settings/settings">
          {({ isActive }) => <Tabs.Tab isActive={isActive}>Settings</Tabs.Tab>}
        </NavLink>
      </Tabs>
      <Outlet />

      <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-200 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="h-full w-[600px] bg-white shadow-xl flex flex-col py-6 px-10 gap-10 duration-200 ease-out data-[closed]:translate-x-full"
          >
            <DialogTitle className="flex justify-between">
              <div className="text-3xl font-semibold">SoftwareOne Settings</div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </DialogTitle>

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
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
