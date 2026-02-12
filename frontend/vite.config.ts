import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/sectors': { target: 'http://localhost:3000', changeOrigin: true },
      '/finishes': { target: 'http://localhost:3000', changeOrigin: true },
      '/finish-weights': { target: 'http://localhost:3000', changeOrigin: true },
      '/properties': { target: 'http://localhost:3000', changeOrigin: true },
      '/amc': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
});
