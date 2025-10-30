import dotenv from "dotenv";
import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import credentials, { credentialsApi } from "./app/credentials";
import sensible from "@fastify/sensible";
import mssql from "mssql";

dotenv.config();

const host = process.env.HOST ?? "::";
const port = Number(process.env.PORT ?? 3500);

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
  },
});

const pool = new mssql.ConnectionPool({
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});

app.ready(async () => {
  await pool.connect();
  console.log("Connected to database");
});

app.ready(() => {
  const routes = app.printRoutes();
  console.log(routes);
});

app
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler)
  .register(sensible)
  .register(credentials, { pool })
  .register(credentialsApi, { prefix: "/api/v1/credentials" })
  .register(cors, { origin: true })
  .listen({ port, host }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
