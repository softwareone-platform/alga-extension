// import { createManualInvoice } from "alga:extension/invoicing";

// export type ManualInvoice = {
//   invoiceId: string;
//   invoiceNumber: string;
//   status: string;
//   subtotal: number;
//   tax: number;
//   total: number;
// };

// export type ManualInvoiceLine = {
//   serviceId: string;
//   quantity: number;
//   description: string;
//   rate: number;
// };

// export const createInvoice = (
//   clientId: string,
//   items: ManualInvoiceLine[]
// ): ManualInvoice => {
//   const {
//     success,
//     invoiceId,
//     invoiceNumber,
//     status,
//     subtotal,
//     tax,
//     total,
//     error,
//   } = createManualInvoice({
//     clientId,
//     items,
//     invoiceDate: undefined,
//     dueDate: undefined,
//     poNumber: undefined,
//   });

//   if (!success) {
//     throw new Error(error ?? "Unknown error creating invoice");
//   }

//   return {
//     invoiceId: invoiceId!,
//     invoiceNumber: invoiceNumber!,
//     status: status ?? "draft",
//     subtotal: subtotal ?? 0,
//     tax: tax ?? 0,
//     total: total ?? 0,
//   };
// };
