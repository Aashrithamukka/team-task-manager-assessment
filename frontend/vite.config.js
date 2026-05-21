import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-crossorigin-from-static-assets',
      transformIndexHtml(html) {
        return html.replace(/\s+crossorigin(="")?/g, '');
      }
    }
  ]
});
