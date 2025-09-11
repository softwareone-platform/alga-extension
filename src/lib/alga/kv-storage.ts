//TODO: Will use alga KV storage client instead of localStorage when it's ready

export class KVStorage {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${this.namespace}:${key}`, serialized);
    } catch (error) {
      throw new Error(`Failed to serialize value for key "${key}": ${error}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(`${this.namespace}:${key}`);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      throw new Error(`Failed to deserialize value for key "${key}": ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(`${this.namespace}:${key}`);
  }

  async has(key: string): Promise<boolean> {
    return localStorage.getItem(`${this.namespace}:${key}`) !== null;
  }
}
