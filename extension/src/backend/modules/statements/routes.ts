import { ListResponse, optionsFromUrl } from "@/shared/lists";
import { Statement } from "@/shared/statements";
import { StatementService } from "./statements";
import { defineHandler } from "@/backend/engine";
import { SWOClient } from "@/backend/lib/swo";

defineHandler<{}, Statement>(
  "GET",
  "/statements/:id",
  ({ params: { id }, extensionDetails: { token, endpoint } }) => {
    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);
    const body = statementService.getById(id);

    return {
      status: 200,
      body,
    };
  },
);

defineHandler<{}, ListResponse<Statement>>(
  "GET",
  "/statements",
  ({ url, extensionDetails: { token, endpoint } }) => {
    const options = optionsFromUrl(url);
    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);
    const body = statementService.list(options);

    return {
      status: 200,
      body,
    };
  },
);

defineHandler<{}, Statement>(
  "POST",
  "/statements/:id/create-invoice",
  ({ params: { id }, extensionDetails: { token, endpoint } }) => {
    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);
    const body = statementService.invoiceStatement(id);

    return {
      status: 200,
      body,
    };
  },
);

defineHandler<{}, Statement>(
  "POST",
  "/statements/create-invoices",
  ({ extensionDetails: { token, endpoint } }) => {
    const swoClient = new SWOClient(endpoint, token);
    const statementService = new StatementService(swoClient);

    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 1);

    const fromDate = new Date(toDate);
    fromDate.setMonth(fromDate.getMonth() - 36);

    statementService.invoiceMany(fromDate, toDate);

    return {
      status: 200,
    };
  },
);
