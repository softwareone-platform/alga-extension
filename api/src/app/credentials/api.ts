import { type FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { CredentialsModel } from "@lib/credentials/models";

const CreateCredentialsRequestBodySchema = CredentialsModel;
const CreateCredentialsResponseSchema = CredentialsModel;

export const credentialsApi: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: CreateCredentialsRequestBodySchema,
        response: {
          201: CreateCredentialsResponseSchema,
        },
      },
    },
    async ({ body }, reply) => {
      const credentials = await fastify.credentialsClient.upsert(body);
      return reply.status(201).send(credentials);
    }
  );
};
