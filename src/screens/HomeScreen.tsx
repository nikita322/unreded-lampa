import { For, Show, createSignal, onMount } from 'solid-js';
import { push, type ScreenProps } from '../activity';
import { api } from '../api';
import { cachedRequest } from '../api/cached';
import type { MediaCard, Page } from '../api/types';
import { IMAGE_SIZE } from '../constants/api';
import { CACHE_STORE_API } from '../constants/storage';
import { SCREEN } from '../config/screen';
import PlayerScreen from '../player/PlayerScreen';
import { layout, palette, typography } from '../theme';
import { createGridFocus } from '../utils/focus';

const HOME_CACHE_KEY = 'movie:popular:1';
const HOME_CACHE_TTL_MS = 30 * 60 * 1000;
const STATUS_WIDTH = 400;

const HOME_LIST = {
  method: 'movie',
  category: 'popular',
  page: 1,
} as const;

/** Число колонок/строк вычисляется из реального размера экрана. */
const GRID_COLUMNS = Math.max(
  1,
  Math.floor(
    (SCREEN.width - layout.grid.left - layout.grid.right + layout.grid.gap) /
      (layout.card.width + layout.grid.gap),
  ),
);

const GRID_ROWS = Math.max(
  1,
  Math.floor(
    (SCREEN.height - layout.grid.top - layout.grid.bottom + layout.grid.gap) /
      (layout.card.height + layout.grid.gap),
  ),
);

const MAX_CARDS = GRID_COLUMNS * GRID_ROWS;

const POSTER_WIDTH = layout.card.width - 2 * layout.card.focusInset;
const POSTER_HEIGHT = layout.card.posterHeight - 2 * layout.card.focusInset;

/** Готовый мягкий ореол (радиальный градиент, цвет совпадает с palette.accent.primary). */
const GLOW_IMAGE = '/assets/glow.svg';

const UI_TEXT = {
  loading: 'Загрузка…',
  error: 'Ошибка загрузки',
} as const;

export default function HomeScreen(props: ScreenProps) {
  const [cards, setCards] = createSignal<MediaCard[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [failed, setFailed] = createSignal(false);
  const focus = createGridFocus(
    () => cards().length,
    GRID_COLUMNS,
  );

  onMount(() => {
    void cachedRequest<Page<MediaCard>>(
      CACHE_STORE_API,
      HOME_CACHE_KEY,
      HOME_CACHE_TTL_MS,
      () => api.list(HOME_LIST),
    )
      .then(page => setCards(page.results.slice(0, MAX_CARDS)))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  });

  return (
    <view
      hidden={!props.isActive}
      width={SCREEN.width}
      height={SCREEN.height}
      color={palette.background.base}
    >
      <Show when={loading()}>
        <text
          x={(SCREEN.width - STATUS_WIDTH) / 2}
          y={(SCREEN.height - typography.size.status) / 2}
          width={STATUS_WIDTH}
          height={typography.size.status}
          fontFamily={typography.family}
          fontSize={typography.size.status}
          color={palette.text.secondary}
          textAlign="center"
          verticalAlign="middle"
        >
          {UI_TEXT.loading}
        </text>
      </Show>

      <Show when={failed()}>
        <text
          x={(SCREEN.width - STATUS_WIDTH) / 2}
          y={(SCREEN.height - typography.size.status) / 2}
          width={STATUS_WIDTH}
          height={typography.size.status}
          fontFamily={typography.family}
          fontSize={typography.size.status}
          color={palette.text.secondary}
          textAlign="center"
          verticalAlign="middle"
        >
          {UI_TEXT.error}
        </text>
      </Show>

      <For each={cards()}>
        {(card, index) => {
          const focused = () => focus.index() === index();
          const column = index() % GRID_COLUMNS;
          const row = Math.floor(index() / GRID_COLUMNS);
          const x =
            layout.grid.left + column * (layout.card.width + layout.grid.gap);
          const y =
            layout.grid.top + row * (layout.card.height + layout.grid.gap);
          const poster = api.img(card.poster_path, IMAGE_SIZE.card);
          const title = card.title ?? card.name ?? '';

          return (
            <view
              autofocus={props.isActive && focused()}
              width={layout.card.width}
              height={layout.card.height}
              x={x}
              y={y}
              color={palette.transparent}
              onLeft={() => {
                focus.move('left');
                return true;
              }}
              onRight={() => {
                focus.move('right');
                return true;
              }}
              onUp={() => {
                focus.move('up');
                return true;
              }}
              onDown={() => {
                focus.move('down');
                return true;
              }}
              onEnter={() => {
                push(PlayerScreen);
                return true;
              }}
            >
              <view
                x={layout.card.focusInset - layout.card.glowMargin}
                y={layout.card.focusInset - layout.card.glowMargin}
                width={POSTER_WIDTH + 2 * layout.card.glowMargin}
                height={POSTER_HEIGHT + 2 * layout.card.glowMargin}
                src={GLOW_IMAGE}
                alpha={focused() ? 1 : 0}
              />
              <view
                width={POSTER_WIDTH}
                height={POSTER_HEIGHT}
                x={layout.card.focusInset}
                y={layout.card.focusInset}
                src={poster}
                placeholderColor={palette.card.background}
                borderRadius={layout.card.radius}
                textureOptions={{ resizeMode: { type: 'cover' } }}
              />
              <text
                x={layout.card.focusInset}
                y={layout.card.posterHeight + layout.card.titleGap}
                width={layout.card.width - 2 * layout.card.focusInset}
                height={layout.card.titleHeight}
                fontFamily={typography.family}
                fontSize={typography.size.cardTitle}
                lineHeight={typography.lineHeight.cardTitle}
                color={palette.text.primary}
                textAlign="center"
                verticalAlign="middle"
                contain="width"
                maxLines={1}
              >
                {title}
              </text>
            </view>
          );
        }}
      </For>
    </view>
  );
}
