import {
  ExtensionDetails,
  ExtensionDetailsChange,
} from "@/shared/extension-details";
import { StorageClient } from "../storage-client";

const STORAGE_KEY = "settings";
const STORAGE_NAMESPACE = "swo";

export class ExtensionService {
  private readonly storage: StorageClient;

  constructor() {
    this.storage = new StorageClient(STORAGE_NAMESPACE);
  }

  getDetails(): ExtensionDetails {
    const details = this.storage.get<ExtensionDetails>(STORAGE_KEY);
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
  }

  saveDetails(data: ExtensionDetailsChange): ExtensionDetails {
    const details = this.getDetails();

    const isConfigured = !!data.token && !!data.endpoint;

    let status = details.status;
    let activatedAt = details.audit.activatedAt;
    let disabledAt = details.audit.disabledAt;

    if (!isConfigured) {
      status = "unconfigured";
    }
    if (
      isConfigured &&
      data.status === "active" &&
      details.status !== "active"
    ) {
      status = "active";
      activatedAt = new Date().toISOString();
    }
    if (
      isConfigured &&
      data.status === "disabled" &&
      details.status !== "disabled"
    ) {
      status = "disabled";
      disabledAt = new Date().toISOString();
    }

    const newDetails = {
      ...details,
      ...data,
      status,
      audit: {
        createdAt: details.audit.createdAt,
        updatedAt: new Date().toISOString(),
        activatedAt,
        disabledAt,
      },
    };

    this.storage.put(STORAGE_KEY, newDetails);
    return newDetails;
  }
}
