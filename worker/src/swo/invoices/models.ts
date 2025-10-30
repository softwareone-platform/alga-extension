import type { PlatformObjectEvent } from "@swo/mp-api-model";

export type InvoiceStatus = "Issued" | "Paid" | "Overdue";

export type InvoiceLine = {
  id: string;
  description: string;
  description2: string;
  unitOfMeasure?: string;
  period: {
    start: string;
    end: string;
  };
  price: {
    unitPrice: number;
    amount: number;
    amountIncludingVat: number;
    quantity: number;
    purchaseCurrencyCode: string;
  };
};

export type Invoice = {
  id: string;
  countryCode: string;
  documentNo: string;
  status: InvoiceStatus;
  agreement: {
    id: string;
  };
  lines: InvoiceLine[];
  audit: {
    created?: PlatformObjectEvent | null;
    updated?: PlatformObjectEvent | null;
  };
};
