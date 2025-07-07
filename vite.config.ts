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
    host: true, // Use true to automatically detect and use the network IP
    port: 8100,
    strictPort: false, // Allow fallback to another port if 8100 is taken
    open: true,
    cors: true, // Enable CORS for all origins
    // Let Vite automatically determine the correct HMR endpoint
    // Don't explicitly set the HMR host to 0.0.0.0 as it causes connection issues
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
