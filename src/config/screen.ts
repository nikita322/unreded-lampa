import { APP_ROOT_ID } from '../constants/dom';

/**
 * Фактический размер области рендера.
 * Читается один раз при старте из реального layout-размера #app,
 * а не из window.innerWidth/Height — так учитываются devtools и скроллбары.
 */
function measureViewport(): { readonly width: number; readonly height: number } {
  const app = document.getElementById(APP_ROOT_ID);

  return {
    width: app?.clientWidth || document.documentElement.clientWidth || window.innerWidth,
    height: app?.clientHeight || document.documentElement.clientHeight || window.innerHeight,
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
