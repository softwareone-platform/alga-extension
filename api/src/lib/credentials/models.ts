import { z } from "zod";

export const CredentialsModel = z.object({
  agreementId: z.string(),
  swoAPIToken: z.string(),
  algaAPIKey: z.string(),
});

export type Credentials = z.infer<typeof CredentialsModel>;
