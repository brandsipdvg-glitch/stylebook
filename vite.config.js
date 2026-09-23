import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps assets working on GitHub Pages regardless of repo name.
// HashRouter is used so deep links never 404 on static hosting.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
