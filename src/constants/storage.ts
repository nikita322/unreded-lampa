/**
 * Ключи и параметры хранилищ приложения.
 * Имя БД сохраняет префикс `lampa_` из легаси-кода (`db.js`).
 */
export const CACHE_DB_NAME = 'lampa_cache' as const;

/** Версия схемы кэша — меняется при изменении набора хранилищ. */
export const CACHE_DB_VERSION = 9;

/** Хранилище для кэша JSON-ответов API. */
export const CACHE_STORE_API = 'api' as const;

export const CACHE_STORES = [
  'screensavers',
  'plugins',
  'backgrounds',
  'images',
  'themes',
  'other',
  'timetable',
  CACHE_STORE_API,
] as const;
