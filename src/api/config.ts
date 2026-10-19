import { DEFAULT_TMDB_API_KEY } from '../constants/api';

/**
 * Ключ TMDB: переменная окружения VITE_TMDB_API_KEY имеет приоритет,
 * иначе используется дефолтный ключ из constants/api.ts.
 */
export function resolveApiKey(): string {
  return import.meta.env.VITE_TMDB_API_KEY || DEFAULT_TMDB_API_KEY;
}
