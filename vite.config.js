import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'docs',  // Папка для финальной сборки для GitHub Pages
    sourcemap: true,  // Опционально, чтобы создавать исходные карты (полезно для отладки)
  },
});
