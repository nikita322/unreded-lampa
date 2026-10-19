import { spacing } from './spacing';

/** Базовые размеры контента (логические px). */
export const layout = {
  card: {
    width: 200,
    /** Полная высота карточки: постер + заголовок + отступ. */
    height: 340,
    posterHeight: 300,
    titleHeight: 32,
    titleGap: 8,
    /** Отступ постера от рамки фокуса. */
    focusInset: 6,
  },
  grid: {
    gap: spacing.lg,
    left: 96,
    right: 96,
    top: 160,
    bottom: 96,
  },
} as const;
