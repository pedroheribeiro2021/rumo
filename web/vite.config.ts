import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        lang: 'pt-BR',
        name: 'Rumo — planeje e gerencie viagens',
        short_name: 'Rumo',
        description: 'Roteiro, orçamento, gastos com divisão automática e monitor de passagens.',
        theme_color: '#0b6b5b',
        background_color: '#fbfaf8',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // dados (Supabase) nunca ficam em cache do service worker — só o app shell.
        // Offline de gastos é tratado por uma fila própria (ver src/lib/offlineQueue.ts).
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
