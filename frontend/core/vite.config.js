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
    port: 5174, // Force default Vite port
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'https://church-management-system-k7bt.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
