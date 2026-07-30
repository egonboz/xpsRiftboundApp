import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.cloudflare.riftbound.uvsgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/hydraproxy/api/v2'),
      },
      '/pairings-api': {
        target: 'https://eloshowdown.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pairings-api/, '/riftbound/api/tracker'),
      },
    },
  },
})
