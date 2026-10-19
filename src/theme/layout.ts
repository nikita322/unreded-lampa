import { spacing } from './spacing';

/** Базовые размеры контента (логические px). */
export const layout = {
  card: {
    width: 200,
    /** Полная высота карточки: постер + заголовок + отступ. */
    height: 340,
    posterHeight: 300,
    titleHeight: 28,
    titleGap: 6,
    /** Отступ постера от края карточки. */
    focusInset: 6,
    /** Скругление постера. */
    radius: 14,
    /** Насколько свечение выходит за постер. */
    glowMargin: 24,
  },
  grid: {
    gap: spacing.lg,
    left: 96,
    right: 96,
    top: 160,
    bottom: 96,
  },
} as const;
