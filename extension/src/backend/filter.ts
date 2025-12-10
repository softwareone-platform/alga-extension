export type UserType = "msp" | "customer";

export type Rule = {
  path: string;
  filteredFields?: string[];
};

export type Filter = {
  allowed: Rule[];
};

export type Filters = Record<UserType, Filter>;

export type Response<T extends object = {}> = T | { data: T[] };

const isListResponse = <T extends object>(
  body: Response<T>
): body is { data: T[] } => {
  return (
    typeof body === "object" &&
    body !== null &&
    "data" in body &&
    Array.isArray((body as { data: unknown[] }).data)
  );
};

function filterObjectProps(
  filtered: unknown | unknown[],
  path: string[] | string
): unknown | unknown[] {
  if (!filtered) {
    return filtered;
  }

  if (Array.isArray(filtered)) {
    return filtered.map((item) => filterObjectProps(item, path));
  }

  if (Array.isArray(path)) {
    let current: unknown = filtered;
    for (const p of path) {
      current = filterObjectProps(current, p);
    }
    return current;
  }

  const parts = path.split(".");
  if (parts.length > 1) {
    const [first, ...rest] = parts;
    const inFiltered = filtered[first as keyof typeof filtered];
    if (!inFiltered) {
      return filtered;
    }
    return {
      ...filtered,
      [first]: filterObjectProps(inFiltered, rest.join(".")),
    };
  }

  const newFiltered = {
    ...filtered,
  };

  delete newFiltered[path as keyof typeof newFiltered];
  return newFiltered;
}

export function getRule(
  url: string,
  userType: UserType,
  filters: Filters
): Rule | undefined {
  const filter = filters[userType];
  const { pathname } = new URL(url, "http://dummy.com");
  return filter?.allowed.find((ap) => ap.path === pathname);
}

export function filterResponse(
  body: Response,
  { filteredFields = [] }: Rule
): unknown {
  if (!filteredFields.length || !body) {
    return body;
  }

  if (isListResponse(body)) {
    const { data, ...rest } = body;
    return {
      ...rest,
      data: filterObjectProps(data, filteredFields),
    };
  }

  return filterObjectProps(body, filteredFields);
}
