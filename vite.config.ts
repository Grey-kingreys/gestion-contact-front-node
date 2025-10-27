

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  // IMPORTANT : Utiliser des chemins relatifs
  base: './',
  server: {
    port: 3000,
  }
})