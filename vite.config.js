import { glob } from 'glob';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Находим все HTML файлы в src
const htmlFiles = glob.sync('src/**/*.html', { cwd: __dirname });

// Создаем объект с входными файлами для Rollup
const input = {};
htmlFiles.forEach(file => {
  // Используем относительный путь от src/ как ключ, заменяем все слэши на /
  const relativePath = file.replace('src/', '').replace(/\\/g, '/');
  const name = relativePath.replace('.html', '').replace(/\//g, '_');
  input[name] = resolve(__dirname, file);
});

export default {
  root: 'src', // корень - папка src
  publicDir: '../public', // выносим статику на уровень выше
  base: './', // используем относительные пути для совместимости с любым размещением
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        // Нормализуем пути в выходных файлах
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 5173,
  },
};
