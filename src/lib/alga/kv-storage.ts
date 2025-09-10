//TODO: Will use alga KV storage client instead of localStorage when it's ready

export class KVStorage {
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      throw new Error(`Failed to serialize value for key "${key}": ${error}`);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      throw new Error(`Failed to deserialize value for key "${key}": ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async has(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null;
  }
}
