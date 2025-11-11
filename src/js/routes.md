# Модуль маршрутов (routes.js)

## Описание

Модуль `routes.js` содержит автоматически генерируемый список всех доступных маршрутов на сайте. Этот файл используется модулем `404-handler.js` для проверки существования страниц.

## ⚠️ ВАЖНО

**Этот файл генерируется автоматически при запуске dev сервера или сборке проекта!**

Не редактируйте его вручную - все изменения будут потеряны при следующем запуске.

## Автоматическая генерация

Файл `routes.js` автоматически создается и обновляется:

- При запуске `npm run dev` - dev сервер
- При выполнении `npm run build` - сборка проекта

Генерация происходит в файле `vite.config.js` через функцию `generateRoutes()`.

## Структура

### Экспортируемые элементы

#### `routes` (массив)

Массив строк, содержащий все доступные маршруты сайта в формате относительных путей от корня `src/`.

**Формат путей:**
- `'index.html'` - главная страница
- `'pages/home/news.html'` - страница новостей
- `'pages/heating-networks/index.html'` - индексная страница раздела

**Пример:**
```javascript
export const routes = [
  'index.html',
  'pages/home/news.html',
  'pages/home/news-detailed.html',
  'pages/error.html',
  // ... остальные маршруты
];
```

#### `normalizePath(path: string): string`

Нормализует путь для сравнения с маршрутами в массиве `routes`.

**Параметры:**
- `path` (string) - Путь для нормализации

**Возвращает:**
- `string` - Нормализованный путь

**Логика нормализации:**
1. Убирает начальные и конечные слэши
2. Удаляет query параметры (`?param=value`) и hash (`#anchor`)
3. Если путь пустой, возвращает `'index.html'`
4. Если путь не заканчивается на `.html`, добавляет `/index.html`
5. Заменяет обратные слэши на прямые (для Windows)

**Примеры:**
```javascript
normalizePath('/pages/home/news')     // 'pages/home/news/index.html'
normalizePath('pages/home/news/')     // 'pages/home/news/index.html'
normalizePath('pages/home/news.html') // 'pages/home/news.html'
normalizePath('')                     // 'index.html'
normalizePath('/')                    // 'index.html'
normalizePath('/pages/news?filter=all') // 'pages/news/index.html'
```

#### `isRouteExists(path: string): boolean`

Проверяет, существует ли маршрут в списке доступных маршрутов.

**Параметры:**
- `path` (string) - Путь для проверки

**Возвращает:**
- `boolean` - `true`, если маршрут существует, иначе `false`

**Примеры:**
```javascript
isRouteExists('pages/home/news.html')        // true
isRouteExists('pages/nonexistent.html')     // false
isRouteExists('/pages/home/news')            // true (нормализуется до 'pages/home/news/index.html')
isRouteExists('index.html')                  // true
```

## Использование

### Импорт модуля

```javascript
import { routes, normalizePath, isRouteExists } from './routes.js';
```

### Проверка существования маршрута

```javascript
import { isRouteExists } from './routes.js';

const currentPath = window.location.pathname;
if (!isRouteExists(currentPath)) {
  // Перенаправить на страницу ошибки
  window.location.href = './pages/error.html';
}
```

### Нормализация пути

```javascript
import { normalizePath } from './routes.js';

const userPath = '/pages/home/news';
const normalized = normalizePath(userPath);
console.log(normalized); // 'pages/home/news/index.html'
```

### Прямой доступ к списку маршрутов

```javascript
import { routes } from './routes.js';

console.log(`Всего маршрутов: ${routes.length}`);
routes.forEach(route => {
  console.log(route);
});
```

## Как обновить список маршрутов

Список маршрутов обновляется автоматически при:

1. **Запуске dev сервера:**
   ```bash
   npm run dev
   ```

2. **Сборке проекта:**
   ```bash
   npm run build
   ```

При добавлении новых HTML файлов в проект, они автоматически появятся в списке маршрутов при следующем запуске.

## Отладка

### Проверка содержимого файла

```javascript
import { routes } from './routes.js';
console.log(routes);
```

### Проверка нормализации пути

```javascript
import { normalizePath } from './routes.js';
const testPaths = [
  '/pages/home/news',
  'pages/home/news/',
  'pages/home/news.html',
  '',
  '/'
];

testPaths.forEach(path => {
  console.log(`${path} -> ${normalizePath(path)}`);
});
```

### Проверка существования маршрута

```javascript
import { isRouteExists } from './routes.js';
const testPaths = [
  'pages/home/news.html',
  'pages/nonexistent.html',
  'index.html'
];

testPaths.forEach(path => {
  console.log(`${path}: ${isRouteExists(path)}`);
});
```

## Примечания

- Файл генерируется автоматически - не редактируйте его вручную
- Все пути хранятся в формате относительных путей от корня `src/`
- Пути нормализуются для корректного сравнения (убираются слэши, query параметры и т.д.)
- Функция `normalizePath` используется внутри `isRouteExists` для корректного сравнения путей

## Связанные модули

- `404-handler.js` - использует `routes.js` для проверки существования страниц
- `vite.config.js` - генерирует `routes.js` при запуске

