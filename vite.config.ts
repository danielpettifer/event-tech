/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  server: {
    host: '0.0.0.0', // Explicitly use 0.0.0.0 to listen on all interfaces
    port: 8100,
    strictPort: false, // Allow fallback to another port if 8100 is taken
    open: true,
    cors: true, // Enable CORS for all origins
    hmr: {
      // Explicitly configure HMR to use the network IP
      host: '0.0.0.0',
      port: 8100,
      protocol: 'ws',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 8100,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
