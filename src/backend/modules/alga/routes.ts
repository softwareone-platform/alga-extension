import { route } from "@/backend/routing";
import { listClients, ClientsListResult } from "alga:extension/clients";
import { listServices, ServicesListResult } from "alga:extension/services";

route<unknown, ClientsListResult>("GET", "/alga/clients", ({ user }) => {
  if (!user?.userType) {
    return { status: 403, error: "Unauthorized" };
  }

  const clients = listClients({
    page: 1,
    pageSize: 100,
    includeInactive: false,
  });

  return { status: 200, body: clients };
});

route<unknown, ServicesListResult>("GET", "/alga/services", ({ user }) => {
  if (!user?.userType) {
    return { status: 403, error: "Unauthorized" };
  }

  const services = listServices({
    page: 1,
    pageSize: 100,
    itemKind: "service",
  });

  return { status: 200, body: services };
});
