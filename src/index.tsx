import { Config, createRenderer, loadFonts } from '@solidtv/solid';
import { useFocusManager } from '@solidtv/solid/primitives';
import App from './App';
import { bootstrap } from './activity';
import { openCache } from './cache';
import { SCREEN } from './config/screen';
import { keymap } from './keymap';
import HomeScreen from './screens/HomeScreen';
import { FONT } from './theme';

// Обработанные клавиши не должны скроллить страницу / выходить из fullscreen.
Config.preventDefaultOnHandledKeys = true;

const { render } = createRenderer({
  appWidth: SCREEN.width,
  appHeight: SCREEN.height,
  deviceLogicalPixelRatio: 1,
  devicePhysicalPixelRatio: SCREEN.dpr,
});

void start();

async function start(): Promise<void> {
  await openCache();
  await loadFonts([
    {
      type: FONT.type,
      fontFamily: FONT.family,
      atlasUrl: FONT.atlasUrl,
      atlasDataUrl: FONT.atlasDataUrl,
    },
  ]);

  bootstrap(HomeScreen);

  render(() => {
    useFocusManager(keymap);
    return <App />;
  });
}
