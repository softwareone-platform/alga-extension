import { useSettings } from "./settings-context";

export function Settings() {
  const { settings, setSettings } = useSettings();

  return (
    <section className="w-full flex justify-between">
      <div>
        <h1>SoftwareOne</h1>
        <span>{settings.status}</span>
      </div>
      <div>
        <button onClick={() => setSettings({ ...settings, status: "active" })}>
          Edit
        </button>
      </div>
    </section>
  );
}
