import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/predict-dosha': 'http://localhost:8000',
      '/generate-diet': 'http://localhost:8000',
      '/analyse-nutrients': 'http://localhost:8000',
    },
  },
})
