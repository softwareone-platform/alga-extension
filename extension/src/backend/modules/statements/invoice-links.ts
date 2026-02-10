import { storage } from "@/backend/lib/alga";
import { InvoiceLink } from "@/shared/invoices";

const STORAGE_NAMESPACE = "swo.invoice-links";
const STORAGE_KEY = "invoice-links";

export const invoiceLinks = {
  getLinks: (): InvoiceLink[] =>
    storage.get<{ all: InvoiceLink[] }>(STORAGE_NAMESPACE, STORAGE_KEY)?.all ??
    [],
  saveLinks: (all: InvoiceLink[]): InvoiceLink[] => {
    storage.put(STORAGE_NAMESPACE, STORAGE_KEY, { all });
    return all;
  },
};
