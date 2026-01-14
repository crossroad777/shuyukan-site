/**
 * Author: BaseLine Designs.com
 * Version: v0.1
 * Last Updated: 2026-01-10 JST
 * Changes: Initial runnable Vite config
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
})
