import { KVStorage } from "../kv-storage";

export class AgreementsClient {
  private kvStorage: KVStorage;
  constructor(kvStorage: KVStorage) {
    this.kvStorage = kvStorage;
  }
}
