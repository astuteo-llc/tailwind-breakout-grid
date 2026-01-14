import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => {
  // Library build: npm run build
  if (command === 'build') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/visualizer/index.js'),
          name: 'BreakoutGridVisualizer',
          fileName: () => 'breakout-grid-visualizer.js',
          formats: ['iife']
        },
        outDir: '.',
        emptyOutDir: false,
        minify: false
      }
    };
  }

  // Demo dev server: npm run dev
  return {
    root: 'demo',
    plugins: [tailwindcss()]
  };
});
