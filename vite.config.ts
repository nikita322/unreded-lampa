import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin({
      solid: {
        moduleName: '@solidtv/solid',
        generate: 'universal',
      },
    }),
  ],
  resolve: {
    dedupe: ['solid-js', '@solidtv/solid', '@solidtv/renderer'],
  },
  optimizeDeps: {
    exclude: ['@solidtv/solid', '@solidtv/renderer'],
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
