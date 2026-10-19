import { Config, createRenderer } from '@solidtv/solid';
import { useFocusManager } from '@solidtv/solid/primitives';
import App from './App';
import { bootstrap } from './activity';
import { SCREEN } from './config/screen';
import { keymap } from './keymap';
import HomeScreen from './screens/HomeScreen';

// Обработанные клавиши не должны скроллить страницу / выходить из fullscreen.
Config.preventDefaultOnHandledKeys = true;

const { render } = createRenderer({
  appWidth: SCREEN.width,
  appHeight: SCREEN.height,
  deviceLogicalPixelRatio: 1,
  devicePhysicalPixelRatio: SCREEN.dpr,
});

bootstrap(HomeScreen);

render(() => {
  useFocusManager(keymap);
  return <App />;
});
