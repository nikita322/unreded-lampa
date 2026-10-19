/**
 * Типизированная обёртка над IndexedDB — порт легаси `utils/db.js`.
 *
 * Отличия от легаси:
 * - TTL задаётся в миллисекундах (`ttlMs`), а не в минутах с сентинелом `-1`.
 * - `upsert` заменяет `rewriteData`, у которого в легаси был мёртвый код.
 * - `clearAll` дожидается завершения очистки всех хранилищ.
 */

export interface DbOptions {
  readonly name: string;
  readonly version: number;
  readonly stores: readonly string[];
}

export interface StoredValue<T> {
  readonly key: string;
  readonly value: T;
  readonly time: number;
}

export interface GetOptions {
  /** Время жизни записи в миллисекундах. Без него запись не протухает. */
  readonly ttlMs?: number;
}

export class Database {
  private db: IDBDatabase | null = null;

  constructor(private readonly options: DbOptions) {}

  open(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
        return;
      }

      const idb = globalThis.indexedDB;
      if (!idb) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }

      if (this.options.stores.length === 0) {
        reject(new Error('No stores defined'));
        return;
      }

      const request = idb.open(this.options.name, this.options.version);

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to open database'));

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        for (const store of this.options.stores) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'key' });
          }
        }
      };
    });
  }

  add<T>(store: string, key: string, value: T): Promise<void> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const record: StoredValue<T> = { key, value, time: Date.now() };
      const request = objectStore.add(record);

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to add data'));
      request.onsuccess = () => resolve();
    });
  }

  get<T>(store: string, key: string, options?: GetOptions): Promise<T | null> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key) as IDBRequest<
        StoredValue<T> | undefined
      >;

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to get data'));

      request.onsuccess = () => {
        const record = request.result;
        if (!record) {
          resolve(null);
          return;
        }

        const ttlMs = options?.ttlMs;
        if (ttlMs !== undefined && Date.now() >= record.time + ttlMs) {
          resolve(null);
          return;
        }

        resolve(record.value);
      };
    });
  }

  getAll<T>(store: string): Promise<T[]> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll() as IDBRequest<StoredValue<T>[]>;

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to get data'));
      request.onsuccess = () =>
        resolve((request.result ?? []).map(record => record.value));
    });
  }

  update<T>(store: string, key: string, value: T): Promise<void> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const getRequest = objectStore.get(key) as IDBRequest<
        StoredValue<T> | undefined
      >;

      getRequest.onerror = () =>
        reject(getRequest.error ?? new Error('Failed to update data'));

      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          reject(new Error(`No data found for key: ${key}`));
          return;
        }

        const record: StoredValue<T> = { key, value, time: Date.now() };
        const putRequest = objectStore.put(record);
        putRequest.onerror = () =>
          reject(putRequest.error ?? new Error('Failed to update data'));
        putRequest.onsuccess = () => resolve();
      };
    });
  }

  upsert<T>(store: string, key: string, value: T): Promise<void> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const record: StoredValue<T> = { key, value, time: Date.now() };
      const request = objectStore.put(record);

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to upsert data'));
      request.onsuccess = () => resolve();
    });
  }

  remove(store: string, key: string): Promise<void> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to delete data'));
      request.onsuccess = () => resolve();
    });
  }

  clearStore(store: string): Promise<void> {
    const db = this.requireDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.clear();

      request.onerror = () =>
        reject(request.error ?? new Error('Failed to clear store'));
      request.onsuccess = () => resolve();
    });
  }

  async clearAll(): Promise<void> {
    const names = Array.from(this.requireDb().objectStoreNames);
    await Promise.all(names.map(name => this.clearStore(name)));
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }

  private requireDb(): IDBDatabase {
    if (!this.db) {
      throw new Error('Database is not open');
    }
    return this.db;
  }
}
