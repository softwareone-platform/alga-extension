import { useSettings } from "./settings-context";

export function Settings() {
  const { settings, setSettings } = useSettings();

  return (
    <>
      <div>
        <h1>SoftwareOne</h1>
        <span>{settings.status}</span>
      </div>
      <div>
        <button onClick={() => setSettings({ ...settings, status: "active" })}>
          Edit
        </button>
      </div>
    </>
  );
}
