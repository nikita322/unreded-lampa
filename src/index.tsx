import { createRenderer } from '@solidtv/solid';
import { useFocusManager } from '@solidtv/solid/primitives';
import App from './App';
import { keymap } from './keymap';
import { SCREEN } from './screen';

const { render } = createRenderer({
  appWidth: SCREEN.width,
  appHeight: SCREEN.height,
  deviceLogicalPixelRatio: 1,
  devicePhysicalPixelRatio: SCREEN.dpr,
});

render(() => {
  useFocusManager(keymap);
  return <App />;
});
