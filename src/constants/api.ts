/**
 * Базовые URL, ключ и пути TMDB (Metadata-источник).
 * Все значения живут здесь, чтобы сырые строки не появлялись в api-слое.
 */
export const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3' as const;
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p' as const;

/**
 * Ключ API по умолчанию (как в легаси-коде).
 * Переопределяется через переменную окружения VITE_TMDB_API_KEY.
 */
export const DEFAULT_TMDB_API_KEY = '4ef0d7355d9ffb5151e987764708ce96' as const;

export const API_LANGUAGE = 'ru' as const;

/** Размеры изображений TMDB. */
export const IMAGE_SIZE = {
  poster: 'w500',
  backdrop: 'w780',
  profile: 'w342',
} as const;

/** Пути к методам TMDB. */
export const ENDPOINT = {
  movie: 'movie',
  tv: 'tv',
  discover: 'discover',
  search: 'search/multi',
  person: 'person',
  genre: 'genre',
} as const;
