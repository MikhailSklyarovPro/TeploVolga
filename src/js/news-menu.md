# Модуль управления новостями (news-menu.js)

## Описание

Класс `NewsMenu` предоставляет функциональность для фильтрации, поиска и отображения новостей с поддержкой пагинации. Модуль автоматически инициализируется при наличии соответствующих data-атрибутов в HTML.

## Основные возможности

- ✅ Фильтрация новостей по категориям
- ✅ Поиск по новостям
- ✅ Пагинация результатов
- ✅ Синхронизация фильтров с URL параметрами
- ✅ Автоматическая инициализация через data-атрибуты
- ✅ Динамическое обновление списка новостей

## Структура класса

### Конструктор

```javascript
new NewsMenu(options);
```

**Параметры:**

- `options` (Object) - Объект с настройками:
  - `filtersContainer` (HTMLElement|string) - Контейнер с фильтрами (селектор или элемент)
  - `gridContainer` (HTMLElement|string) - Контейнер для сетки новостей (селектор или элемент)
  - `paginationContainer` (HTMLElement|string) - Контейнер для пагинации (селектор или элемент)
  - `news` (Array) - Массив всех новостей
  - `itemsPerPage` (number) - Количество новостей на странице (по умолчанию: 9)

**Пример:**

```javascript
const newsMenu = new NewsMenu({
  filtersContainer: '[data-news-filters]',
  gridContainer: '[data-news-grid]',
  paginationContainer: '[data-pagination]',
  news: newsArray,
  itemsPerPage: 12,
});
```

## HTML структура

### Обязательные элементы

#### Контейнер фильтров

```html
<div data-news-filters>
  <!-- Кнопки фильтров -->
  <button data-filter="all">Все</button>
  <button data-filter="enplusGroup">ЭН+ Групп</button>
  <button data-filter="heatingNetworks">Теплосети</button>
  <!-- ... другие фильтры -->

  <!-- Поиск (опционально) -->
  <button data-search-toggle>Поиск</button>
  <div data-search-input-wrapper>
    <input data-search-input type="text" />
    <button data-search-close>Закрыть</button>
  </div>
</div>
```

#### Контейнер сетки новостей

```html
<div data-news-grid data-news="[...]" data-items-per-page="9">
  <!-- Новости будут отрисованы здесь -->
</div>
```

#### Контейнер пагинации

```html
<div data-pagination>
  <!-- Пагинация будет отрисована здесь -->
</div>
```

### Data-атрибуты

- `data-news-filters` - Контейнер с фильтрами
- `data-filter` - Кнопка фильтра (значение: `all`, `enplusGroup`, `heatingNetworks`, и т.д.)
- `data-news-grid` - Контейнер для сетки новостей
- `data-news` - JSON строка с массивом новостей (опционально)
- `data-items-per-page` - Количество новостей на странице (опционально, по умолчанию: 9)
- `data-pagination` - Контейнер для пагинации
- `data-search-toggle` - Кнопка открытия поиска
- `data-search-input-wrapper` - Обертка поля поиска
- `data-search-input` - Поле ввода поиска
- `data-search-close` - Кнопка закрытия поиска

## Структура данных новостей

Каждая новость должна быть объектом со следующей структурой:

```javascript
{
  id: number,                    // Уникальный идентификатор
  title: string,                 // Заголовок новости
  description: string,           // Описание новости
  category: string,              // Категория (enplusGroup, heatingNetworks, и т.д.)
  date: string|Date,            // Дата публикации (ISO строка или Date объект)
  image: string,                 // URL изображения
  imageAlt: string,              // Альтернативный текст изображения
  link: string                   // Ссылка на детальную страницу
}
```

**Пример:**

```javascript
const news = [
  {
    id: 1,
    title: 'Заголовок новости',
    description: 'Описание новости',
    category: 'heatingNetworks',
    date: '2024-01-15T10:00:00.000Z',
    image: './img/news/news1.webp',
    imageAlt: 'Изображение новости',
    link: './pages/home/news-detailed.html',
  },
];
```

## Доступные категории

- `all` - Все новости
- `enplusGroup` - ЭН+ Групп
- `heatingNetworks` - Теплосети
- `generation` - Генерация тепла
- `avtozavodskayaTpp` - Автозаводская ТЭЦ
- `factoryNetworks` - Заводские сети
- `youthCouncil` - Молодежный совет
- `worksCouncil` - Рабочий совет
- `ecology` - Экология

## Методы класса

### `setActiveFilter(filter: string)`

Устанавливает активный фильтр и обновляет отображение новостей.

```javascript
newsMenu.setActiveFilter('heatingNetworks');
```

### `updateNews(news: Array)`

Обновляет список новостей и перерисовывает интерфейс.

```javascript
newsMenu.updateNews(newNewsArray);
```

### `destroy()`

Уничтожает экземпляр, очищает пагинацию и контейнер.

```javascript
newsMenu.destroy();
```

## Автоматическая инициализация

Модуль автоматически инициализируется при загрузке страницы, если найдены необходимые data-атрибуты:

```html
<!-- Автоматическая инициализация -->
<div data-news-filters>...</div>
<div data-news-grid data-news="[...]">...</div>
<div data-pagination>...</div>
```

При этом используется функция `initNewsMenuFromAttributes()`.

## Ручная инициализация

Если нужно инициализировать вручную:

```javascript
import { NewsMenu } from './news-menu.js';

const newsMenu = new NewsMenu({
  filtersContainer: document.querySelector('[data-news-filters]'),
  gridContainer: document.querySelector('[data-news-grid]'),
  paginationContainer: document.querySelector('[data-pagination]'),
  news: newsArray,
  itemsPerPage: 9,
});
```

## Работа с URL параметрами

Модуль автоматически читает фильтр из URL параметра `filter`:

```
http://localhost:5173/pages/home/news.html?filter=heatingNetworks
```

При изменении фильтра URL обновляется автоматически через `history.pushState()`.

## Поиск

Модуль поддерживает поиск по новостям (если реализован в HTML):

1. Нажатие на кнопку `data-search-toggle` открывает поле поиска
2. Ввод текста в поле `data-search-input` фильтрует новости
3. Нажатие на `data-search-close` или клавишу `Escape` закрывает поиск

## Пагинация

Модуль использует класс `Pagination` для управления пагинацией. При изменении страницы автоматически обновляется отображение новостей.

## Тестовые данные

Модуль содержит функцию `getTestNewsData()` для получения тестовых данных новостей, структурированных по категориям.

```javascript
import { getTestNewsData } from './news-menu.js';

const testNews = getTestNewsData();
console.log(testNews); // Массив всех новостей, отсортированных по дате
```

## Примеры использования

### Базовое использование

```html
<div data-news-filters>
  <button data-filter="all">Все</button>
  <button data-filter="heatingNetworks">Теплосети</button>
</div>

<div data-news-grid data-items-per-page="12"></div>

<div data-pagination></div>

<script type="module" src="./js/news-menu.js"></script>
```

### Программное управление

```javascript
import { NewsMenu } from './news-menu.js';

const newsMenu = new NewsMenu({
  filtersContainer: '[data-news-filters]',
  gridContainer: '[data-news-grid]',
  paginationContainer: '[data-pagination]',
  news: myNewsArray,
  itemsPerPage: 6,
});

// Изменить фильтр программно
newsMenu.setActiveFilter('ecology');

// Обновить новости
newsMenu.updateNews(newNewsArray);
```

### Загрузка данных из API

```javascript
async function loadNews() {
  const response = await fetch('/api/news');
  const news = await response.json();

  const newsMenu = new NewsMenu({
    filtersContainer: '[data-news-filters]',
    gridContainer: '[data-news-grid]',
    paginationContainer: '[data-pagination]',
    news: news,
    itemsPerPage: 9,
  });
}

loadNews();
```

## Стилизация

Для корректной работы необходимы CSS классы:

- `.news__filters__item--active` - активная кнопка фильтра
- `.news__filters__search-input-wrapper--active` - активное поле поиска
- `.wrapper-card-new` - обертка карточки новости
- `.card-news` - карточка новости
- `.card-news__date` - дата новости
- `.card-news__image` - изображение новости
- `.card-news__content` - содержимое карточки
- `.card-news__tags` - теги новости
- `.card-news__tag` - отдельный тег
- `.card-news__info` - информация о новости

## Экспортируемые функции

### `NewsMenu`

Основной класс для управления новостями.

### `initNewsMenuFromAttributes()`

Функция автоматической инициализации через data-атрибуты.

### `getTestNewsData()`

Функция для получения тестовых данных новостей.

## Зависимости

Модуль зависит от:

- `pagination.js` - класс `Pagination` для управления пагинацией

## Примечания

- Модуль автоматически инициализируется при загрузке DOM
- Поддерживает синхронизацию фильтров с URL параметрами
- Использует `history.pushState()` для обновления URL без перезагрузки страницы
- Тестовые данные доступны через функцию `getTestNewsData()`
