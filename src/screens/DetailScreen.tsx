import { pop, type ScreenProps } from '../activity';
import { SCREEN } from '../config/screen';
import { layout, palette } from '../theme';

export default function DetailScreen(props: ScreenProps) {
  return (
    <view hidden={!props.isActive} width={SCREEN.width} height={SCREEN.height} color={palette.background.alternate}>
      <view
        autofocus={props.isActive}
        width={layout.item.width}
        height={layout.item.height}
        x={(SCREEN.width - layout.item.width) / 2}
        y={(SCREEN.height - layout.item.height) / 2}
        color={palette.item.focused}
        onLast={() => {
          pop();
          return true;
        }}
      />
    </view>
  );
}
