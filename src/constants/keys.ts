/**
 * Имена клавиш KeyboardEvent.key.
 * Основной путь определения ввода на десктопе.
 */
export const KEY = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
} as const;

/**
 * Коды клавиш (keyCode) — для хостов, которые шлют только keyCode
 * (часть ТВ-платформ отдаёт key без значения).
 */
export const KEY_CODE = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESCAPE: 27,
} as const;
