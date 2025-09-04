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
};

export type SWOStatus = "unconfigured" | "active" | "disabled" | "error";

export type SettingsContextType = {
  settings: SWOSettings;
  status?: SWOStatus;
  disable: () => void;
  enable: () => void;
  error: () => void;
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
  };
};

const saveSettingsToStorage = (settings: SWOSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<SWOSettings>(getSettings);
  const [status, setStatus] = useState<SWOStatus>();
  const navigate = useNavigate();

  const disable = () => {
    setStatus("disabled");
  };

  const enable = () => {
    setStatus(
      !settings.token || !settings.endpoint ? "unconfigured" : "active"
    );
  };

  const error = () => {
    if (status !== "active") {
      throw new Error(
        "Cannot put extension in error state. Extension is not enabled. "
      );
    }
    setStatus("error");
  };

  useEffect(() => {
    saveSettingsToStorage(settings);
    enable();

    if (!settings.token) {
      navigate("/settings");
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        status,
        error,
        setSettings,
        disable,
        enable,
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
