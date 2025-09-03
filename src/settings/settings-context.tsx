import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";

export type SWOSettings = {
  endpoint: string;
  token: string;
  note: string;
  status: "unconfigured" | "active" | "disabled" | "error";
};

export type SettingsContextType = {
  settings: SWOSettings;
  setSettings: (settings: SWOSettings) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

type SettingsProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = "SWO-SETTINGS";

const getSettings = (): SWOSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    endpoint: "",
    token: "",
    note: "",
    status: "unconfigured",
  };
};

const saveSettingsToStorage = (settings: SWOSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<SWOSettings>(getSettings);
  const navigate = useNavigate();

  useEffect(() => {
    saveSettingsToStorage(settings);

    if (!settings.token) {
      navigate("/settings");
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider"
    );
  }
  return context;
};
