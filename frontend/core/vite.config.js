import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    proxy: {
      '/auth': 'https://church-management-system-k7bt.onrender.com',
      '/members': 'https://church-management-system-k7bt.onrender.com',
      '/activities': 'https://church-management-system-k7bt.onrender.com',
    }
  }
})

