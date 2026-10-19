import { SCREEN } from './config/screen';
import { layout, palette } from './theme';

const barWidth = Math.min(layout.content.maxWidth, SCREEN.width * layout.ratios.contentWidth);
const barHeight = Math.min(layout.content.maxHeight, SCREEN.height * layout.ratios.contentHeight);

export default function App() {
  return (
    <view autofocus width={SCREEN.width} height={SCREEN.height} color={palette.background.base}>
      <view
        width={barWidth}
        height={barHeight}
        x={(SCREEN.width - barWidth) / 2}
        y={(SCREEN.height - barHeight) / 2}
        color={palette.accent.primary}
      />
    </view>
  );
}
