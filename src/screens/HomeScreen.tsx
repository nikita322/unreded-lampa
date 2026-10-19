import { For } from 'solid-js';
import { push, type ScreenProps } from '../activity';
import { SCREEN } from '../config/screen';
import { createFocusIndex } from '../core/focus';
import { layout, palette, spacing } from '../theme';
import DetailScreen from './DetailScreen';

const MENU_ITEM_COUNT = 3;
const MENU_INDEXES = Array.from({ length: MENU_ITEM_COUNT }, (_, index) => index) as readonly number[];
const LIST_TOP = 240;
const ITEM_GAP = spacing.lg;

export default function HomeScreen(props: ScreenProps) {
  const focus = createFocusIndex(MENU_ITEM_COUNT);

  return (
    <view hidden={!props.isActive} width={SCREEN.width} height={SCREEN.height} color={palette.background.base}>
      <For each={MENU_INDEXES}>
        {index => (
          <view
            autofocus={props.isActive && focus.index() === index}
            width={layout.item.width}
            height={layout.item.height}
            x={(SCREEN.width - layout.item.width) / 2}
            y={LIST_TOP + index * (layout.item.height + ITEM_GAP)}
            color={focus.index() === index ? palette.item.focused : palette.item.default}
            onUp={() => {
              focus.move(-1);
              return true;
            }}
            onDown={() => {
              focus.move(1);
              return true;
            }}
            onEnter={() => {
              push(DetailScreen);
              return true;
            }}
          />
        )}
      </For>
    </view>
  );
}
