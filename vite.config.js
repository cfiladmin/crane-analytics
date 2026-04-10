import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'クレーンAna',
        short_name: 'クレーンAna',
        description: 'クレーンゲームの投資額・期待値をリアルタイム計算。損切りアラート・メルカリ相場比較・技術熟練度η。',
        theme_color: '#F59E0B',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
