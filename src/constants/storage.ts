/**
 * Ключи и параметры хранилищ приложения.
 * Имя БД сохраняет префикс `lampa_` из легаси-кода (`db.js`).
 */
export const CACHE_DB_NAME = 'lampa_cache' as const;

/** Версия схемы кэша — меняется при изменении набора хранилищ. */
export const CACHE_DB_VERSION = 8;

export const CACHE_STORES = [
  'screensavers',
  'plugins',
  'backgrounds',
  'images',
  'themes',
  'other',
  'timetable',
] as const;
