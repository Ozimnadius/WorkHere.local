import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: true,
    // Аватарки соискателей нужны только при открытии всплывашки города, поэтому
    // не вшиваем их в бандл base64 — пусть остаются отдельными файлами и кешируются.
    assetsInlineLimit: (filePath) => (
      filePath.includes('/geography/avatars/') ? false : undefined
    ),
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? '';

          if (name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }

          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
