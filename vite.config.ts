import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/SKU-Validation/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(configDir, 'src/main.tsx'),
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/app.css';
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
});
