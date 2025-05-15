import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

  build: {
    rollupOptions: {
      external: ['backend/server.js'],
    },
  },
});
