export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "ge"
  | "lt"
  | "le"
  | "like"
  | "ilike"
  | "in"
  | "nin";

export type SortOrder = "asc" | "desc";

export interface FilterCondition<T> {
  field: keyof T | string;
  value: unknown;
  operator: FilterOperator;
}

export interface RqlOperators {
  any<T>(field: string, condition: FilterCondition<T>): FilterCondition<T>;
  all<T>(field: string, condition: FilterCondition<T>): FilterCondition<T>;
}

export class RqlQuery<T> {
  private _expand: string[] = [];
  private _exclude: string[] = [];
  private _filters: FilterCondition<T>[] = [];
  private _orderBy: [string, SortOrder] | null = null;
  private _offset = 0;
  private _limit = 10;
  private _namedFilters: string[] = [];

  operators: RqlOperators = {
    any<U>(field: string, condition: FilterCondition<U>): FilterCondition<U> {
      return { ...condition, field: `${field}.${String(condition.field)}` };
    },
    all<U>(field: string, condition: FilterCondition<U>): FilterCondition<U> {
      return { ...condition, field: `${field}.${String(condition.field)}` };
    },
  };

  expand(...fields: (keyof T | string)[]): this {
    this._expand.push(...fields.map(String));
    return this;
  }

  exclude(...fields: (keyof T | string)[]): this {
    this._exclude.push(...fields.map(String));
    return this;
  }

  filter(condition: FilterCondition<T>): this {
    this._filters.push(condition);
    return this;
  }

  orderBy(order: [keyof T | string, SortOrder]): this {
    this._orderBy = [String(order[0]), order[1]];
    return this;
  }

  paging(offset: number, limit: number): this {
    this._offset = offset;
    this._limit = limit;
    return this;
  }

  applyNamedFilter(name: string): this {
    this._namedFilters.push(name);
    return this;
  }

  toString(): string {
    const parts: string[] = [];

    if (this._expand.length > 0) {
      parts.push(`select(${this._expand.join(",")})`);
    }

    if (this._exclude.length > 0) {
      parts.push(`exclude(${this._exclude.join(",")})`);
    }

    for (const filter of this._filters) {
      const { field, value, operator } = filter;
      if (operator === "in" || operator === "nin") {
        const values = Array.isArray(value) ? value.join(",") : value;
        parts.push(`${operator}(${String(field)},(${values}))`);
      } else {
        parts.push(`${operator}(${String(field)},${value})`);
      }
    }

    if (this._orderBy) {
      const [field, order] = this._orderBy;
      parts.push(`order=${order === "desc" ? `-${field}` : field}`);
    }

    parts.push(`limit=${this._limit}`);
    parts.push(`offset=${this._offset}`);

    for (const namedFilter of this._namedFilters) {
      parts.push(`filter=${namedFilter}`);
    }

    return parts.join("&");
  }
}
