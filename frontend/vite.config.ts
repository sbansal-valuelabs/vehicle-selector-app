/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const port = parseInt(process.env.VITE_PORT || '5173', 10);

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    proxy: {
      '/upload': process.env.VITE_API_BASE_URL || 'http://localhost:3000',
      '/vehicles': process.env.VITE_API_BASE_URL || 'http://localhost:3000',
    }
  },
  build: {
    sourcemap: process.env.NODE_ENV === 'production' ? false : true,
    minify: 'terser',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
