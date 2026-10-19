/** Резервные размеры экрана, если браузер отдаёт 0 до layout (ТВ-хосты). */
export const DEFAULT_SCREEN = {
  width: 1920,
  height: 1080,
} as const;

/**
 * Фактический размер окна запуска.
 * Раскладка ведётся в CSS-пикселях; рендерер масштабирует в физические через dpr.
 */
export const SCREEN = {
  width: window.innerWidth || DEFAULT_SCREEN.width,
  height: window.innerHeight || DEFAULT_SCREEN.height,
  dpr: window.devicePixelRatio || 1,
} as const;
