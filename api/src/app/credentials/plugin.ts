import type { FastifyPluginAsync } from "fastify";
import { CredentialsClient } from "@lib/credentials";
import fp from "fastify-plugin";
import mssql from "mssql";

declare module "fastify" {
  interface FastifyInstance {
    credentialsClient: CredentialsClient;
  }
}

export const credentials: FastifyPluginAsync<{
  pool: mssql.ConnectionPool;
}> = async (fastify, { pool }) => {
  fastify.decorate("credentialsClient", new CredentialsClient(pool));
};

export default fp(credentials, {
  name: "credentials",
});
