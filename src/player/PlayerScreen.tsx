import { onCleanup, onMount } from 'solid-js';
import { pop, type ScreenProps } from '../activity';
import { APP_ROOT_ID } from '../constants/dom';
import { SCREEN } from '../config/screen';
import { MOCK_STREAM_URL } from '../mocks/streams';
import { palette } from '../theme';

/**
 * Экран плеера: нативный <video> поверх canvas-слоя SolidTV.
 * Создаётся императивно через локальную ссылку (ref), управляется пультом:
 * Enter — play/pause, Back — закрыть экран (очистка при pop).
 */
export default function PlayerScreen(props: ScreenProps) {
  let video: HTMLVideoElement | undefined;

  onMount(() => {
    const el = document.createElement('video');
    video = el;

    // CORS-запрос нужен, чтобы поток прошёл COEP require-corp.
    el.crossOrigin = 'anonymous';
    el.playsInline = true;
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.objectFit = 'contain';

    el.src = MOCK_STREAM_URL;
    document.getElementById(APP_ROOT_ID)?.appendChild(el);

    void el.play().catch(() => {
      // Автовоспроизведение может быть заблокировано браузером:
      // оставляем видео смонтированным, запуск доступен по Enter.
    });
  });

  onCleanup(() => {
    const el = video;
    if (!el) return;

    el.pause();
    el.removeAttribute('src');
    el.load();
    el.remove();
    video = undefined;
  });

  const togglePlayback = (): boolean => {
    const el = video;
    if (!el) return true;

    if (el.paused) void el.play();
    else el.pause();

    return true;
  };

  return (
    <view width={SCREEN.width} height={SCREEN.height} color={palette.background.base}>
      <view
        autofocus={props.isActive}
        width={SCREEN.width}
        height={SCREEN.height}
        onEnter={togglePlayback}
        onLast={() => {
          pop();
          return true;
        }}
      />
    </view>
  );
}
