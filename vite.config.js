import {fileURLToPath} from 'node:url';

import {defineConfig} from 'vite';

import geographyCountry from './vite/geography-country.js';

// Три сайта собираются из одного исходника: страна задаётся режимом сборки
// (vite build --mode kz). Псевдонимы ниже подменяют данные страны, поэтому
// в бандл попадает только одна — чужие карты и аватарки в сборку не тянутся.
const COUNTRIES = ['ru', 'kz', 'uz'];
const DEFAULT_COUNTRY = 'ru';

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({mode}) => {
  const country = COUNTRIES.includes(mode) ? mode : DEFAULT_COUNTRY;

  return {
    plugins: [geographyCountry(country)],

    resolve: {
      alias: {
        '@country': fromRoot(`./src/countries/${country}.js`),
        '@country-assets': fromRoot(`./src/countries/${country}.assets.js`),
      },
    },

    build: {
      // Каждая страна собирается в свою папку, чтобы их можно было держать
      // рядом и сравнивать. На Vercel у проекта указывается нужная.
      outDir: `dist/${country}`,
      emptyOutDir: true,
      cssCodeSplit: true,
      // Аватарки соискателей нужны только при открытии всплывашки города,
      // поэтому не вшиваем их в бандл base64 — пусть остаются отдельными
      // файлами и кешируются.
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
  };
});
