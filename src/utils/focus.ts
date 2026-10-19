import { createSignal } from 'solid-js';

export type GridDirection = 'left' | 'right' | 'up' | 'down';

export interface GridFocusController {
  readonly index: () => number;
  readonly move: (direction: GridDirection) => void;
}

/**
 * Сигнал индекса сфокусированной карточки в двумерной сетке.
 * Количество карточек задаётся аксессором, чтобы реагировать на подгрузку
 * данных; навигация не зацикливается и не уводит фокус за границы сетки.
 */
export function createGridFocus(
  count: () => number,
  columns: number,
): GridFocusController {
  const [index, setIndex] = createSignal(0);

  const clamp = (value: number): number => {
    const total = count();
    if (total <= 0) return 0;
    return Math.min(Math.max(value, 0), total - 1);
  };

  const column = (i: number): number => i % columns;

  const move = (direction: GridDirection): void => {
    setIndex(prev => {
      switch (direction) {
        case 'left':
          return column(prev) > 0 ? clamp(prev - 1) : prev;
        case 'right':
          return column(prev) < columns - 1 ? clamp(prev + 1) : prev;
        case 'up': {
          const next = prev - columns;
          return next >= 0 ? next : prev;
        }
        case 'down': {
          const next = prev + columns;
          return next < count() ? next : prev;
        }
      }
    });
  };

  return { index, move };
}
