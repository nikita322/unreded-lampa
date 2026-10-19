import { cache, Database } from '../cache';

/**
 * Cache-aside: возвращает значение из IndexedDB, если оно не протухло,
 * иначе вызывает load, сохраняет результат и возвращает его.
 * `db` переопределяется в тестах; по умолчанию — синглтон приложения.
 */
export async function cachedRequest<T>(
  store: string,
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
  db: Database = cache,
): Promise<T> {
  const cached = await db.get<T>(store, key, { ttlMs });
  if (cached !== null) return cached;

  const data = await load();
  await db.upsert(store, key, data);
  return data;
}
