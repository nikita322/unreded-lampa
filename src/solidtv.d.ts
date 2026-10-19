import type { ShaderShadowProps } from '@solidtv/solid';

declare module '@solidtv/solid' {
  /**
   * В @solidtv/solid@1.7 эффект тени/свечения не описан в публичных типах JSX,
   * хотя рантайм его поддерживает. Добавляем типизацию через module augmentation.
   */
  interface NodeProps {
    shadow?: Partial<ShaderShadowProps>;
  }
}
