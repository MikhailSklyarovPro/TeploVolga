/**
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
  'index.html',
  'pages/avtozavodskaya-tpp/index.html',
  'pages/avtozavodskaya-tpp/information-disclosure.html',
  'pages/avtozavodskaya-tpp/privacy-policy.html',
  'pages/avtozavodskaya-tpp/purchases.html',
  'pages/avtozavodskaya-tpp/vacancy-detailed.html',
  'pages/avtozavodskaya-tpp/vacancy.html',
  'pages/error.html',
  'pages/ese-kuban/consumers.html',
  'pages/ese-kuban/contacts.html',
  'pages/ese-kuban/index.html',
  'pages/ese-kuban/information-disclosure.html',
  'pages/factory-networks/consumers.html',
  'pages/factory-networks/index.html',
  'pages/factory-networks/information-disclosure.html',
  'pages/factory-networks/privacy-policy.html',
  'pages/factory-networks/purchases.html',
  'pages/heat-generation/implementation-illiquids.html',
  'pages/heat-generation/index.html',
  'pages/heat-generation/information-disclosure.html',
  'pages/heat-generation/privacy-policy.html',
  'pages/heat-generation/purchases.html',
  'pages/heat-generation/tariffs.html',
  'pages/heat-generation/technical-connection.html',
  'pages/heating-networks/contacts.html',
  'pages/heating-networks/implementation-illiquids.html',
  'pages/heating-networks/index.html',
  'pages/heating-networks/information-disclosure.html',
  'pages/heating-networks/privacy-policy.html',
  'pages/heating-networks/purchases.html',
  'pages/heating-networks/vacancy-detailed.html',
  'pages/heating-networks/vacancy.html',
  'pages/home/anti-corruption-measures.html',
  'pages/home/company-structure.html',
  'pages/home/corporate-culture.html',
  'pages/home/ecology.html',
  'pages/home/news-detailed.html',
  'pages/home/news.html',
  'pages/home/privacy-policy.html',
  'pages/home/works-council.html',
  'pages/home/youth-council.html',
  'pages/op-yaroslavl/index.html',
];

/**
 * Нормализует путь для сравнения
 * @param {string} path - Путь для нормализации
 * @returns {string} Нормализованный путь
 */
export function normalizePath(path) {
  // Убираем начальный и конечный слэш
  let normalized = path.replace(/^\/+|\/+$/g, '');

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
  normalized = normalized.replace(/\\/g, '/');

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
