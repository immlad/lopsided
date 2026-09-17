import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lopsided/',   // REQUIRED for GitHub Pages
  build: {
    outDir: 'dist'
  }
})
