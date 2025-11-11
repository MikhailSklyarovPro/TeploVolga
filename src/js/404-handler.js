/**
 * Обработчик 404 ошибок
 * Проверяет существование текущей страницы и перенаправляет на error.html, если страница не найдена
 */

import { isRouteExists, normalizePath } from './routes.js';

/**
 * Получает текущий путь относительно корня src/
 */
function getCurrentPath() {
  const pathname = window.location.pathname;
  const base = import.meta.env.BASE_URL || './';

  // Убираем base URL из pathname
  let relativePath = pathname;
  if (base !== './' && base !== '/' && pathname.startsWith(base)) {
    relativePath = pathname.slice(base.length);
  }

  // Убираем начальный слэш
  relativePath = relativePath.replace(/^\/+/, '');

  // Если путь пустой или только слэш, это главная страница
  if (!relativePath || relativePath === '') {
    return 'index.html';
  }

  // Если путь не заканчивается на .html и не является директорией, добавляем .html
  if (!relativePath.endsWith('.html') && !relativePath.endsWith('/')) {
    // Проверяем, есть ли расширение файла
    const hasExtension = relativePath.includes('.');
    if (!hasExtension) {
      relativePath = `${relativePath}.html`;
    }
  }

  return relativePath;
}

/**
 * Проверяет существование текущей страницы
 */
function checkPageExists() {
  // Не проверяем страницу ошибки, чтобы избежать зацикливания
  const currentPath = getCurrentPath();
  const normalizedPath = normalizePath(currentPath);

  if (normalizedPath === 'pages/error.html' || currentPath.includes('error.html')) {
    return; // Не проверяем саму страницу ошибки
  }

  // Проверяем существование маршрута
  if (!isRouteExists(normalizedPath)) {
    // Перенаправляем на страницу ошибки
    // Определяем правильный путь к error.html в зависимости от текущей директории
    const base = import.meta.env.BASE_URL || './';
    let errorPath = '';

    // Если мы уже в папке pages, используем относительный путь
    if (window.location.pathname.includes('/pages/')) {
      errorPath = base === './' ? './error.html' : `${base}pages/error.html`;
    } else {
      // Определяем путь относительно корня
      if (base === './') {
        errorPath = './pages/error.html';
      } else {
        // Используем абсолютный путь от корня
        errorPath = '/pages/error.html';
      }
    }

    // Сохраняем оригинальный путь для возможного использования
    const originalUrl = window.location.href;
    sessionStorage.setItem('404-original-url', originalUrl);

    // Перенаправляем
    window.location.replace(errorPath);
  }
}

/**
 * Инициализация обработчика 404
 */
function init404Handler() {
  // Проверяем только после полной загрузки страницы
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkPageExists);
  } else {
    checkPageExists();
  }
}

// Запускаем проверку
init404Handler();
