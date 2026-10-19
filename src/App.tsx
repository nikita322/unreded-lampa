import { For } from 'solid-js';
import { activityStack } from './activity';
import { SCREEN } from './config/screen';
import { palette } from './theme';

export default function App() {
  return (
    <view width={SCREEN.width} height={SCREEN.height} color={palette.background.base}>
      <For each={activityStack()}>
        {(activity, index) => {
          const Screen = activity.component;
          return <Screen isActive={index() === activityStack().length - 1} />;
        }}
      </For>
    </view>
  );
}
