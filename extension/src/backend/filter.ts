export type UserType = "msp" | "customer";

export type AllowedPath = {
  path: string;
  filteredFields?: string[];
};

export type Filter = {
  allowed: AllowedPath[];
};

export type Filters = Record<UserType, Filter>;

export type ListResponse = {
  data?: unknown[];
  [key: string]: unknown;
};

export type RequestFilterResult =
  | { allowed: true; allowedPath: AllowedPath }
  | { allowed: false; reason: string };

function extractPathname(url: string): string {
  const queryIndex = url.indexOf("?");
  return queryIndex === -1 ? url : url.substring(0, queryIndex);
}

function isListResponse(obj: unknown): obj is ListResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "data" in obj &&
    Array.isArray((obj as ListResponse).data)
  );
}

function removeFieldByPath(obj: unknown, path: string): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  const parts = path.split(".");
  const lastPart = parts[parts.length - 1];

  let current: any = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== "object") {
      return;
    }
    current = current[part];
  }

  if (current && typeof current === "object" && lastPart in current) {
    delete current[lastPart];
  }
}

function removeFields(obj: unknown, fieldPaths: string[]): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  for (const fieldPath of fieldPaths) {
    removeFieldByPath(obj, fieldPath);
  }
}

export function checkRequestAllowed(
  requestPath: string,
  userType: UserType,
  filters: Filters
): RequestFilterResult {
  const userFilter = filters[userType];

  if (!userFilter) {
    return {
      allowed: false,
      reason: `No filter configuration found for user type: ${userType}`,
    };
  }

  const pathname = extractPathname(requestPath);

  const allowedPath = userFilter.allowed.find((ap) => ap.path === pathname);

  if (!allowedPath) {
    return {
      allowed: false,
      reason: `Path not allowed for user type ${userType}: ${pathname}`,
    };
  }

  return {
    allowed: true,
    allowedPath,
  };
}

export function filterResponse(
  response: unknown,
  filteredFields?: string[]
): unknown {
  if (!filteredFields || filteredFields.length === 0) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return response;
  }

  const filteredResponse = JSON.parse(JSON.stringify(response));

  if (isListResponse(filteredResponse)) {
    if (Array.isArray(filteredResponse.data)) {
      filteredResponse.data.forEach((item: unknown) => {
        removeFields(item, filteredFields);
      });
    }
    return filteredResponse;
  }

  removeFields(filteredResponse, filteredFields);
  return filteredResponse;
}
