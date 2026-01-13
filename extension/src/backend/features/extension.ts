import {
  ExtensionDetails,
  ExtensionDetailsChange,
} from "@/shared/extension-details";
import { storage } from "../lib/alga";

const STORAGE_NAMESPACE = "swo.extension";
const STORAGE_KEY = "details";

const toDetails = (
  change: ExtensionDetailsChange,
  existing: ExtensionDetails
): ExtensionDetails => {
  const isConfigured =
    !!(change.token || existing.token) &&
    !!(change.endpoint || existing.endpoint);

  let status = existing.status;
  let activatedAt = existing.audit.activatedAt;
  let disabledAt = existing.audit.disabledAt;

  if (!isConfigured) {
    status = "unconfigured";
  }

  if (isConfigured && status === "unconfigured") {
    status = "active";
    activatedAt = new Date().toISOString();
  }

  if (isConfigured && status !== "active" && change.status === "active") {
    status = "active";
    activatedAt = new Date().toISOString();
  }
  if (isConfigured && status !== "disabled" && change.status === "disabled") {
    status = "disabled";
    disabledAt = new Date().toISOString();
  }

  return {
    ...existing,
    ...change,
    status,
    audit: {
      createdAt: existing.audit.createdAt,
      updatedAt: new Date().toISOString(),
      activatedAt,
      disabledAt,
    },
  };
};

export const extension = {
  getDetails: (): ExtensionDetails => {
    const details = storage.get<ExtensionDetails>(
      STORAGE_NAMESPACE,
      STORAGE_KEY
    );
    return (
      details || {
        endpoint: "",
        token: "",
        note: "",
        status: "unconfigured",
        audit: {
          createdAt: new Date().toISOString(),
        },
      }
    );
  },
  saveDetails: (change: ExtensionDetailsChange): ExtensionDetails => {
    const existing = extension.getDetails();
    const newDetails = toDetails(change, existing);
    storage.put(STORAGE_NAMESPACE, STORAGE_KEY, newDetails);
    return newDetails;
  },
};

export type Extension = typeof extension;
