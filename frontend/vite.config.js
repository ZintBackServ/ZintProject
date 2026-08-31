import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  oxc: {
    // Strips console logs, warnings, and debugger statements in production builds
    // while keeping them fully active on localhost/terminal for debugging.
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png', 'image.png'],
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
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,woff,woff2}'],
        navigateFallbackDenylist: [
          /^\/user\/auth\/google/,
          /^\/(user|course|mentor|placedStudent|event|eventRegistration|api|rating|notification|category|updates|enquiry|timeTable|internshipRegistration|placementRegistration|admission)/,
        ],
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
  optimizeDeps: {
    // Pre-bundle all react-icons subpackages used in lazy-loaded routes.
    // Without this, Vite re-optimizes them on first import causing 504 errors.
    include: [
      'react-[#md]',
      'react-icons/md',
      'react-icons/pi',
      'react-icons/fi',
      'react-icons/fa',
      'react-icons/hi',
    ],
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      // Only proxy /user/auth/google (OAuth initiation) and /user/auth/google/callback to Express
      // These are real backend routes that must hit Passport.js
      '^/user/auth/google': {
        target: 'http://localhost:2000',
        changeOrigin: true,
      },

      // All other backend API paths — serve index.html for browser navigations (SPA),
      // proxy to Express for fetch/XHR requests
      '^/(api|user|course|mentor|placedStudent|event|eventRegistration|rating|notification|category|updates|enquiry|timeTable|internshipRegistration|placementRegistration|admission)': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html'; // React SPA handles all HTML navigations
          }
        },
      },
    },
  },
  build: {
    // Disable module preloading links to avoid browser preloaded warning logs in inspect
    modulePreload: false,
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
}))
