/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload': 'http://localhost:3000',
      '/vehicles': 'http://localhost:3000',
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
})
