import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'image.png'],
      manifest: {
        name: 'Zint Computer Education Institute',
        short_name: 'Zint Institute',
        description: 'Zint Computer Education Institute - ISO 9001:2015 Certified, Gwalior',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          { src: '/favicon.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.+\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    // Target modern browsers — eliminates legacy JS polyfill overhead (~20 KiB)
    target: 'esnext',
    rollupOptions: {
      output: {
        // Manual chunk splitting — prevents vendor code duplication across routes
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-router-dom')) return 'router'
            if (id.includes('lucide-react'))   return 'icons'
            if (id.includes('react-icons'))    return 'icons'
            if (id.includes('three'))          return 'three'
            if (id.includes('@react-oauth'))   return 'google-auth'
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor'
            return 'vendor'
          }
        },
      },
    },
  },
})
