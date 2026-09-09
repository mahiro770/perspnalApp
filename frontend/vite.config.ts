import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// くらしログ: 天気予報・カレンダー・家計簿統合PWA
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'くらしログ',
        short_name: 'くらしログ',
        description: '天気予報・カレンダー・家計簿をひとつにまとめる生活アプリ',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        lang: 'ja',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // アプリシェル(HTML/JS/CSS)は多少古くても即応性を優先し、裏側で更新する
            urlPattern: ({ request }) =>
              ['document', 'script', 'style', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'app-shell' },
          },
          {
            // 天気APIは鮮度優先だが、オフライン時は直近の予報を表示できるようにする
            urlPattern: ({ url, sameOrigin }) =>
              !sameOrigin || url.pathname.startsWith('/api/weather'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 6 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});