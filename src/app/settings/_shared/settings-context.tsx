import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
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
  status: SWOStatus;
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
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const [hasError, setError] = useState(false);

  const disable = () => {
    setEnabled(false);
  };

  const enable = () => {
    setEnabled(true);
  };

  const error = () => {
    setError(true);
  };

  const status = useMemo(() => {
    if (hasError) return "error";

    if (!settings.token || !settings.endpoint) return "unconfigured";

    if (!enabled) return "disabled";
    return "active";
  }, [enabled, hasError, settings]);

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
        status,
        setSettings,
        disable,
        enable,
        error,
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
