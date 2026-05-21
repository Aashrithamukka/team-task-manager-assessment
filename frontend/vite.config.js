import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inline-production-assets',
      apply: 'build',
      enforce: 'post',
      generateBundle(_, bundle) {
        const htmlFile = bundle['index.html'];
        if (!htmlFile || htmlFile.type !== 'asset') return;

        let html = String(htmlFile.source).replace(/\s+crossorigin(="")?/g, '');
        const scriptTags = [...html.matchAll(/<script type="module"[^>]*src="\/([^"]+\.js)"><\/script>/g)]
          .map((match) => ({ tag: match[0], fileName: match[1] }));
        const styleTags = [...html.matchAll(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)">/g)]
          .map((match) => ({ tag: match[0], fileName: match[1] }));

        for (const { tag, fileName } of scriptTags) {
          const asset = bundle[fileName];
          if (asset?.type === 'chunk') {
            const inlineScript = `<script type="module">${asset.code.replaceAll('</script', '<\\/script')}</script>`;
            html = html.replace(tag, () => inlineScript);
            delete bundle[fileName];
          }
        }

        for (const { tag, fileName } of styleTags) {
          const asset = bundle[fileName];
          if (asset?.type === 'asset') {
            const inlineStyle = `<style>${asset.source}</style>`;
            html = html.replace(tag, () => inlineStyle);
            delete bundle[fileName];
          }
        }

        for (const [fileName, asset] of Object.entries(bundle)) {
          if ((asset.type === 'chunk' && fileName.endsWith('.js')) || (asset.type === 'asset' && fileName.endsWith('.css'))) {
            delete bundle[fileName];
          }
        }
        htmlFile.source = html;
      }
    }
  ]
});
