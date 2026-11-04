import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': projectRoot },
  },
  server: {
    proxy: { '/api': 'http://localhost:8787' },
    // HMR and file watching can be disabled in AI Studio during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
