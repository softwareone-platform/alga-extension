import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { useSettings } from "./settings-context";
import type { SWOSettings } from "./settings-context";

export function Settings() {
  const { settings, setSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [editedSettings, setEditedSettings] = useState<SWOSettings>(settings);

  const handleSave = () => {
    setSettings(editedSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    setIsOpen(false);
  };

  return (
    <>
      <section className="w-full flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold">SoftwareOne</h1>
          <span>{settings.status}</span>
        </div>
        <div>
          <button
            onClick={() => {
              setEditedSettings(settings);
              setIsOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      </section>

      <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="h-full w-[600px] bg-white shadow-xl flex flex-col py-6 px-10 gap-10">
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

            <div className="grid grid-cols-[auto_380px] gap-10">
              <label className="block text-sm font-medium mb-2">
                API Endpoint
              </label>
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

              <label className="block text-sm font-medium mb-2">
                API Token
              </label>
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

              <label className="block text-sm font-medium mb-2">Note</label>
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
              <button
                onClick={handleCancel}
                className="rounded-lg border-0 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-normal"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg border-0 px-4 py-2 bg-gray-700 text-white text-sm font-normal"
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
