import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Inspect from 'vite-plugin-inspect';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0', // <-- bind to all IPv4/IPv6
    port: 8080,
  },
  plugins: [react(), mode === 'development' && Inspect()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
