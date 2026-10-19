import type { KeyMap } from '@solidtv/solid';

/**
 * Маппинг клавиш пульта на клавиатуру браузера.
 * Left/Right/Up/Down — стрелки, Enter — выбор, Last — Back (Escape).
 */
export const keymap = {
  Left: ['ArrowLeft', 37],
  Right: ['ArrowRight', 39],
  Up: ['ArrowUp', 38],
  Down: ['ArrowDown', 40],
  Enter: ['Enter', 13],
  Last: ['Escape', 27],
} satisfies Partial<KeyMap>;
