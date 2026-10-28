import { defineConfig } from 'vite';
import picksPlugin from './scripts/picks-plugin.mjs';

export default defineConfig({
  plugins: [picksPlugin()],
  build: { rollupOptions: { input: { lecture: 'index.html', planning: 'planning.html', review: 'review.html', pilot: 'pilot.html', gallery: 'gallery.html' } } },
  server: { port: 5174, strictPort: true },
  preview: { port: 5174, strictPort: true },
});
