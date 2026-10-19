import { SCREEN } from './screen';

const barWidth = Math.min(640, SCREEN.width * 0.8);
const barHeight = Math.min(120, SCREEN.height * 0.15);

export default function App() {
  return (
    <view autofocus width={SCREEN.width} height={SCREEN.height} color={0x0b1026ff}>
      <view
        width={barWidth}
        height={barHeight}
        x={(SCREEN.width - barWidth) / 2}
        y={(SCREEN.height - barHeight) / 2}
        color={0x2f81f7ff}
      />
    </view>
  );
}
