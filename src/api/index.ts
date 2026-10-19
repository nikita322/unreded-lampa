import { ENDPOINT } from '../constants/api';
import { tmdb } from './tmdb';
import type {
  CategoryParams,
  FullParams,
  Genre,
  ListParams,
  MediaCard,
  MediaDetails,
  Page,
  Person,
  PersonParams,
  SearchParams,
  Season,
  SeasonsParams,
} from './types';

/**
 * Публичное API приложения — тонкий фасад над TMDB-источником.
 * Порт легаси `interaction/api.js` без UI-зависимых методов (main/menu/
 * favorite/collections) — они добавятся вместе с экранами на этапах 5–6.
 */
export const api = {
  img(path: string | null | undefined, size?: string): string {
    return tmdb.img(path, size);
  },

  /** Пагинация категории: movie/popular, tv/top_rated и т.п. */
  list(params: ListParams): Promise<Page<MediaCard>> {
    return tmdb.get<Page<MediaCard>>(`${params.method}/${params.category}`, {
      page: params.page,
    });
  },

  /** Каталог по жанрам: discover/movie?with_genres=... */
  category(params: CategoryParams): Promise<Page<MediaCard>> {
    return tmdb.get<Page<MediaCard>>(`${ENDPOINT.discover}/${params.method}`, {
      page: params.page,
      with_genres: params.genres,
      sort_by: params.sortBy,
    });
  },

  /** Полная карточка фильма/сериала. */
  full(params: FullParams): Promise<MediaDetails> {
    return tmdb.get<MediaDetails>(`${params.method}/${params.id}`);
  },

  search(params: SearchParams): Promise<Page<MediaCard>> {
    return tmdb.get<Page<MediaCard>>(ENDPOINT.search, {
      query: params.query,
      page: params.page,
    });
  },

  person(params: PersonParams): Promise<Person> {
    return tmdb.get<Person>(`${ENDPOINT.person}/${params.id}`);
  },

  /** Сезон сериала со списком эпизодов. */
  seasons(params: SeasonsParams): Promise<Season> {
    return tmdb.get<Season>(
      `${ENDPOINT.tv}/${params.id}/season/${params.season}`,
    );
  },

  genres(method: ListParams['method']): Promise<{ genres: Genre[] }> {
    return tmdb.get<{ genres: Genre[] }>(`${ENDPOINT.genre}/${method}/list`);
  },
};

export type {
  CategoryParams,
  FullParams,
  Genre,
  ListParams,
  MediaCard,
  MediaDetails,
  Page,
  Person,
  PersonParams,
  SearchParams,
  Season,
  SeasonsParams,
} from './types';
