import { defineConfig } from 'vite';
import picksPlugin from './scripts/picks-plugin.mjs';
import statusPlugin from './scripts/status-plugin.mjs';

export default defineConfig({
  plugins: [picksPlugin(), statusPlugin()],
  build: { rollupOptions: { input: { lecture: 'index.html', planning: 'planning.html', review: 'review.html', pilot: 'pilot.html', gallery: 'gallery.html', refs: 'refs.html' } } },
  server: { port: 5174, strictPort: true },
  // the hosted copy for students (lecture day): a static build served on 4174 behind the lecturer's Cloudflare tunnel
  preview: { port: 4174, strictPort: true, host: '127.0.0.1', allowedHosts: ['.hongyuanzhang.com'] },
});
