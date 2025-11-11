import { existsSync, writeFileSync } from 'fs';
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

// Генерируем список маршрутов для routes.js
function generateRoutes() {
  const routes = htmlFiles
    .map(file => {
      // Убираем префикс 'src/' и нормализуем слэши
      const route = file.replace(/^src[\/\\]/, '').replace(/\\/g, '/');
      return route;
    })
    .sort();

  const routesContent = `/**
 * Список всех доступных маршрутов на сайте
 * Автоматически генерируется при запуске dev сервера или сборке
 *
 * Формат: относительные пути от корня src/
 * Например: 'index.html', 'pages/home/news.html'
 *
 * ⚠️ ВНИМАНИЕ: Этот файл генерируется автоматически!
 * Не редактируйте его вручную - изменения будут потеряны.
 */

export const routes = [
${routes.map(route => `  '${route}',`).join('\n')}
];

/**
 * Нормализует путь для сравнения
 * @param {string} path - Путь для нормализации
 * @returns {string} Нормализованный путь
 */
export function normalizePath(path) {
  // Убираем начальный и конечный слэш
  let normalized = path.replace(/^\\/+|\\/+$/g, '');

  // Убираем query параметры и hash
  normalized = normalized.split('?')[0].split('#')[0];

  // Если путь пустой, это главная страница
  if (!normalized || normalized === '') {
    return 'index.html';
  }

  // Если путь не заканчивается на .html, добавляем index.html
  if (!normalized.endsWith('.html')) {
    if (normalized.endsWith('/')) {
      normalized = normalized + 'index.html';
    } else {
      normalized = normalized + '/index.html';
    }
  }

  // Заменяем обратные слэши на прямые
  normalized = normalized.replace(/\\\\/g, '/');

  return normalized;
}

/**
 * Проверяет, существует ли маршрут
 * @param {string} path - Путь для проверки
 * @returns {boolean} true, если маршрут существует
 */
export function isRouteExists(path) {
  const normalized = normalizePath(path);
  return routes.includes(normalized);
}
`;

  writeFileSync(resolve(__dirname, 'src/js/routes.js'), routesContent, 'utf-8');
}

// Генерируем routes.js при запуске
generateRoutes();

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
    // Middleware для обработки 404 в dev режиме
    middlewareMode: false,
  },
  plugins: [
    {
      name: '404-handler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Пропускаем запросы к статическим ресурсам
          if (
            req.url.includes('/assets/') ||
            req.url.includes('.css') ||
            req.url.includes('.js') ||
            req.url.includes('.webp') ||
            req.url.includes('.png') ||
            req.url.includes('.jpg') ||
            req.url.includes('.svg') ||
            req.url.includes('.ttf') ||
            req.url.includes('.webm') ||
            req.url.includes('/fonts/') ||
            req.url.includes('/img/') ||
            req.url.includes('/video/')
          ) {
            return next();
          }

          // Пропускаем запросы к API или другим не-HTML ресурсам
          if (req.url.includes('?')) {
            const urlWithoutQuery = req.url.split('?')[0];
            if (!urlWithoutQuery.endsWith('.html') && urlWithoutQuery !== '/') {
              return next();
            }
          }

          // Проверяем существование HTML файла
          const urlPath = req.url.replace(/^\//, '').replace(/\/$/, '') || 'index.html';
          const filePath = resolve(__dirname, 'src', urlPath.endsWith('.html') ? urlPath : `${urlPath}/index.html`);

          // Проверяем существование файла
          if (!existsSync(filePath)) {
            // Перенаправляем на страницу ошибки
            res.writeHead(302, { Location: '/pages/error.html' });
            res.end();
            return;
          }

          next();
        });
      },
    },
  ],
};
