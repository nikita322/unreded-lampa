/**
 * Централизованная палитра приложения.
 * Формат цвета SolidTV: 0xRRGGBBAA (последний байт — альфа).
 */
export const palette = {
  background: {
    base: 0x0b1026ff,
    alternate: 0x122036ff,
  },
  item: {
    default: 0x1b2a4aff,
    focused: 0x2f81f7ff,
  },
} as const;
