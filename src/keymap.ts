import type { KeyMap } from '@solidtv/solid';
import { KEY, KEY_CODE } from './constants/keys';

/**
 * Маппинг кнопок пульта на клавиатуру браузера.
 * Left/Right/Up/Down — стрелки, Enter — выбор, Last — Back (Escape).
 */
export const keymap = {
  Left: [KEY.ARROW_LEFT, KEY_CODE.LEFT],
  Right: [KEY.ARROW_RIGHT, KEY_CODE.RIGHT],
  Up: [KEY.ARROW_UP, KEY_CODE.UP],
  Down: [KEY.ARROW_DOWN, KEY_CODE.DOWN],
  Enter: [KEY.ENTER, KEY_CODE.ENTER],
  Last: [KEY.ESCAPE, KEY_CODE.ESCAPE],
} satisfies Partial<KeyMap>;
