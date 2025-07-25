import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
 server: process.env.NODE_ENV === 'development' ? {
    hmr: { host: 'localhost', protocol: 'ws', port: 5173 },
    watch: { usePolling: true, interval: 100, ignored: ['**/node_modules/**'] },
    host: '0.0.0.0',
    port: 5173,
  } : undefined,
})
