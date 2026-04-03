import { route } from "@/backend/routing";
import {
  listClients,
  ClientSummary,
} from "alga:extension/clients";
import {
  listServices,
  ServiceSummary,
} from "alga:extension/services";

route<unknown, ClientSummary[]>("GET", "/alga/clients", ({ user }) => {
  if (!user?.userType) {
    return { status: 403, error: "Unauthorized" };
  }

  const allClients: ClientSummary[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const result = listClients({ page, pageSize, includeInactive: false });
    allClients.push(...result.items);
    if (allClients.length >= result.totalCount || result.items.length < pageSize) {
      break;
    }
    page++;
  }

  return { status: 200, body: allClients };
});

route<unknown, ServiceSummary[]>("GET", "/alga/services", ({ user }) => {
  if (!user?.userType) {
    return { status: 403, error: "Unauthorized" };
  }

  const allServices: ServiceSummary[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const result = listServices({ page, pageSize, itemKind: "service" });
    allServices.push(...result.items);
    if (allServices.length >= result.totalCount || result.items.length < pageSize) {
      break;
    }
    page++;
  }

  return { status: 200, body: allServices };
});
