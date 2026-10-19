/** Типографика: семейство SDF-шрифта и размеры. */
export const typography = {
  family: 'Lato',
  size: {
    cardTitle: 24,
    status: 32,
  },
  lineHeight: {
    cardTitle: 1.2,
  },
} as const;

/**
 * SDF-атлас шрифта. Файлы лежат в public/fonts/.
 * Источник: solid-tv/solid-demo-app (Lato Regular, лицензия OFL).
 */
export const FONT = {
  type: 'msdf',
  family: typography.family,
  atlasUrl: '/fonts/Lato-Regular.msdf.png',
  atlasDataUrl: '/fonts/Lato-Regular.msdf.json',
} as const;
