import { Database } from './db';
import {
  CACHE_DB_NAME,
  CACHE_DB_VERSION,
  CACHE_STORES,
} from '../constants/storage';

export { Database } from './db';

export type CacheStore = (typeof CACHE_STORES)[number];

/**
 * Единственный экземпляр кэша приложения.
 * Создание не трогает IndexedDB — подключение происходит в openCache().
 */
export const cache = new Database({
  name: CACHE_DB_NAME,
  version: CACHE_DB_VERSION,
  stores: CACHE_STORES,
});

/** Открывает кэш (идемпотентно). Вызывается один раз при старте. */
export function openCache(): Promise<void> {
  return cache.open();
}
