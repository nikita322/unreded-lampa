/** Типографика: семейство SDF-шрифта и размеры. */
export const typography = {
  family: 'Roboto',
  size: {
    cardTitle: 20,
    status: 32,
  },
  lineHeight: {
    cardTitle: 1.2,
  },
} as const;

/**
 * SDF-атлас шрифта (кириллица + латиница). Файлы лежат в public/fonts/,
 * генерация — scripts/generate-font.mjs. Roboto, лицензия OFL.
 */
export const FONT = {
  type: 'msdf',
  family: typography.family,
  atlasUrl: '/fonts/Roboto-Regular.msdf.png',
  atlasDataUrl: '/fonts/Roboto-Regular.msdf.json',
} as const;
