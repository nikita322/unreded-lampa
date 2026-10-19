/**
 * Минимальные типы данных TMDB, достаточные для api-слоя без UI.
 * Полная модель карточки уточнится на этапах экранов.
 */

export type MediaKind = 'movie' | 'tv';

export interface Page<T> {
  readonly page: number;
  readonly results: T[];
  readonly total_pages: number;
  readonly total_results: number;
}

export interface MediaCard {
  readonly id: number;
  readonly media_type?: MediaKind;
  readonly title?: string;
  readonly name?: string;
  readonly poster_path?: string | null;
  readonly backdrop_path?: string | null;
  readonly overview?: string;
  readonly vote_average?: number;
}

export interface Genre {
  readonly id: number;
  readonly name: string;
}

export interface MediaDetails {
  readonly id: number;
  readonly title?: string;
  readonly name?: string;
  readonly overview?: string;
  readonly poster_path?: string | null;
  readonly backdrop_path?: string | null;
  readonly vote_average?: number;
  readonly genres?: Genre[];
}

export interface Person {
  readonly id: number;
  readonly name: string;
  readonly profile_path?: string | null;
  readonly biography?: string;
}

export interface Episode {
  readonly id: number;
  readonly name: string;
  readonly episode_number: number;
  readonly season_number: number;
  readonly still_path?: string | null;
}

export interface Season {
  readonly id: number;
  readonly name: string;
  readonly overview?: string;
  readonly episodes?: Episode[];
}

export interface ListParams {
  readonly method: MediaKind;
  /** Путь категории внутри method: popular, top_rated, now_playing, ... */
  readonly category: string;
  readonly page?: number;
}

export interface CategoryParams {
  readonly method: MediaKind;
  readonly page?: number;
  /** Список id жанров через запятую (параметр with_genres). */
  readonly genres?: string;
  readonly sortBy?: string;
}

export interface FullParams {
  readonly method: MediaKind;
  readonly id: number;
}

export interface SearchParams {
  readonly query: string;
  readonly page?: number;
}

export interface PersonParams {
  readonly id: number;
}

export interface SeasonsParams {
  readonly id: number;
  readonly season: number;
}
