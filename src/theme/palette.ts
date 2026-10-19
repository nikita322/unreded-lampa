/**
 * Централизованная палитра приложения.
 * Формат цвета SolidTV: 0xRRGGBBAA (последний байт — альфа).
 */
export const palette = {
  background: {
    base: 0x0b1026ff,
    alternate: 0x122036ff,
  },
  transparent: 0x00000000,
  accent: {
    primary: 0x2f81f7ff,
    /** Полупрозрачная заливка фона сфокусированной карточки. */
    overlay: 0x2f81f726,
  },
  card: {
    background: 0x1b2a4aff,
  },
  text: {
    primary: 0xffffffff,
    secondary: 0x9aa4b2ff,
  },
} as const;
