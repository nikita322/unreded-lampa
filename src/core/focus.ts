import { createSignal } from 'solid-js';

export interface FocusIndexController {
  readonly index: () => number;
  readonly move: (delta: number) => void;
}

/**
 * Сигнал индекса сфокусированного элемента в списке фиксированной длины.
 * Навигация пультом меняет индекс; визуальное состояние читает index().
 */
export function createFocusIndex(
  length: number,
  options?: { readonly wrap?: boolean },
): FocusIndexController {
  const wrap = options?.wrap ?? true;

  const [index, setIndex] = createSignal(0);

  const clamp = (value: number): number => {
    if (length <= 0) return 0;
    if (wrap) return ((value % length) + length) % length;
    return Math.min(Math.max(value, 0), length - 1);
  };

  return {
    index,
    move: delta => setIndex(prev => clamp(prev + delta)),
  };
}
