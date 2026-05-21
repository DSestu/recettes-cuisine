import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/recettes-cuisine/',
  // In dev, serve the repo root as the static dir so images/, icons/, assets/ are accessible.
  // In build, use app/public/ only (GH Actions copies images separately).
  publicDir: command === 'serve' ? resolve(__dirname, '..') : 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '..')],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    passWithNoTests: true,
  },
}))
