import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build',  // Папка для финальной сборки
    sourcemap: true,   // Опционально, чтобы создавать исходные карты (полезно для отладки)
  },
});
