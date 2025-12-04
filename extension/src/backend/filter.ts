export type UserType = "msp" | "customer";

export type Rule = {
  path: string;
  filteredFields?: string[];
};

export type Filter = {
  allowed: Rule[];
};

export type Filters = Record<UserType, Filter>;

export type ListResponse = {
  data?: unknown[];
  [key: string]: unknown;
};

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

function removeFields(obj: unknown, fieldPaths: string[]): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  for (const fieldPath of fieldPaths) {
    removeFieldByPath(obj, fieldPath);
  }
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

export function getRule(
  requestPath: string,
  userType: UserType,
  filters: Filters
): Rule | undefined {
  const filter = filters[userType];
  const pathname = extractPathname(requestPath);
  return filter?.allowed.find((ap) => ap.path === pathname);
}

export function filterResponse(
  body: object,
  { filteredFields = [] }: Rule
): unknown {
  if (filteredFields.length === 0) {
    return body;
  }

  if (isListResponse(body)) {
    body.data?.forEach((item: unknown) => {
      removeFields(item, filteredFields);
    });
    return body;
  }

  removeFields(body, filteredFields);
  return body;
}
