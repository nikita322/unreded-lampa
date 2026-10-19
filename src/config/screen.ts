/** Резервные размеры экрана, если layout ещё не рассчитан (ТВ-хосты). */
export const DEFAULT_SCREEN = {
  width: 1920,
  height: 1080,
} as const;

/**
 * Фактический размер области рендера.
 * Читается один раз при старте из реального layout-размера #app,
 * а не из window.innerWidth/Height — так учитываются devtools и скроллбары.
 */
function measureViewport(): { readonly width: number; readonly height: number } {
  const app = document.getElementById('app');

  return {
    width: app?.clientWidth || document.documentElement.clientWidth || window.innerWidth || DEFAULT_SCREEN.width,
    height: app?.clientHeight || document.documentElement.clientHeight || window.innerHeight || DEFAULT_SCREEN.height,
  };
}

const viewport = measureViewport();

/**
 * Раскладка ведётся в CSS-пикселях; рендерер масштабирует в физические через dpr.
 */
export const SCREEN = {
  width: viewport.width,
  height: viewport.height,
  dpr: window.devicePixelRatio || 1,
} as const;
