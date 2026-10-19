import {
  API_LANGUAGE,
  IMAGE_SIZE,
  TMDB_API_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from '../constants/api';
import { resolveApiKey } from './config';
import { requestJson } from './request';

type QueryValue = string | number | undefined;

function buildUrl(
  path: string,
  params: Record<string, QueryValue> = {},
): string {
  const url = new URL(`${TMDB_API_BASE_URL}/${path}`);
  url.searchParams.set('api_key', resolveApiKey());
  url.searchParams.set('language', API_LANGUAGE);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Примитив доступа к TMDB: типизированный GET и сборка URL картинок.
 */
export const tmdb = {
  get<T>(path: string, params: Record<string, QueryValue> = {}): Promise<T> {
    return requestJson<T>(buildUrl(path, params));
  },

  img(path: string | null | undefined, size: string = IMAGE_SIZE.poster): string {
    return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '';
  },
};
