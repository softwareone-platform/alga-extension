import { Agreement as SWOAgreement } from "@swo/mp-api-model";
import { Agreement as AlgaAgreement } from "@lib/alga";

export type Agreement = SWOAgreement & Omit<AlgaAgreement, "id">;
