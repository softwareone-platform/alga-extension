import type { Agreement, AgreementSummaryPrice } from "@swo/mp-api-model";

export type SWOAgreement = Agreement;

export type MSPAgreement = Agreement & {
  price: AgreementSummaryPrice & {
    RPxY?: number | null;
    RPxM?: number | null;
  };
};
