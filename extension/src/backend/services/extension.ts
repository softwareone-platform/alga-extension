import { ExtensionDetails, ExtensionDetailsChange } from "@/lib/extension";
import { StorageClient } from "../storage-client";

const STORAGE_KEY = "settings";
const STORAGE_NAMESPACE = "swo";

export class ExtensionService {
  private readonly storage: StorageClient;

  constructor() {
    this.storage = new StorageClient(STORAGE_NAMESPACE);
  }

  getDetails(): ExtensionDetails | null {
    return this.storage.get<ExtensionDetails>(STORAGE_KEY);
  }

  saveDetails(data: ExtensionDetailsChange): ExtensionDetails {
    const details = this.getDetails() || {
      endpoint: "",
      token: "",
      note: "",
      status: "disabled",
      audit: {
        createdAt: new Date().toISOString(),
      },
    };

    const canActivate = !!data.token && !!data.endpoint;
    const status =
      canActivate && data.status === "active" ? "active" : details.status;

    const newDetails = {
      ...details,
      ...data,
      status,
      audit: {
        ...details.audit,
        updatedAt: new Date().toISOString(),
        activatedAt:
          status !== details.status && status === "active"
            ? new Date().toISOString()
            : details.audit.activatedAt,
        disabledAt:
          status !== details.status && status === "disabled"
            ? new Date().toISOString()
            : details.audit.disabledAt,
      },
    };

    this.storage.put(STORAGE_KEY, newDetails);
    return newDetails;
  }
}
