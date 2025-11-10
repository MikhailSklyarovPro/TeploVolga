# Pagination - Универсальная пагинация

## Описание

Универсальный JavaScript класс для создания пагинации с автоматической инициализацией через data-атрибуты и программным управлением. Подходит для любых списков элементов: новостей, товаров, статей и т.д.

## Возможности

- ✅ Автоматическая инициализация через data-атрибуты
- ✅ Программное создание и управление
- ✅ Настраиваемое количество видимых страниц
- ✅ Стрелки навигации (опционально)
- ✅ Callback при смене страницы
- ✅ Адаптивный дизайн
- ✅ Поддержка множественных экземпляров на одной странице
- ✅ Доступность (ARIA атрибуты)

## Использование

### HTML структура с data-атрибутами (автоматическая инициализация)

```html
<div class="news__pagination" data-pagination data-total-items="100" data-items-per-page="9" data-current-page="1"></div>
```

**Data-атрибуты:**

| Атрибут               | Обязательный | Описание                               | Пример значения |
| --------------------- | ------------ | -------------------------------------- | --------------- |
| `data-pagination`     | ✅           | Основной атрибут контейнера            | —               |
| `data-total-items`    | ✅           | Общее количество элементов             | `100`           |
| `data-items-per-page` | ❌           | Элементов на странице (по умолчанию 9) | `9`, `12`       |
| `data-current-page`   | ❌           | Текущая страница (по умолчанию 1)      | `1`, `2`        |

**События:**

Пагинация автоматически генерирует событие `pagination:change` при смене страницы:

```javascript
const paginationContainer = document.querySelector('[data-pagination]');

paginationContainer.addEventListener('pagination:change', e => {
  const { page, data } = e.detail;
  console.log('Текущая страница:', page);
  console.log('Данные страницы:', data);
  // data содержит: currentPage, totalPages, itemsPerPage, totalItems, start, end
});
```

### Программное создание

```javascript
import { Pagination } from './pagination.js';

const pagination = new Pagination('.news__pagination', {
  totalItems: 100,
  itemsPerPage: 9,
  currentPage: 1,
  onPageChange: (page, data) => {
    console.log('Переход на страницу:', page);
    console.log('Данные:', data);
    // Загрузить данные для страницы
    loadNews(data.start, data.end);
  },
});
```

## Настройки

| Параметр          | Тип      | По умолчанию                   | Описание                                |
| ----------------- | -------- | ------------------------------ | --------------------------------------- |
| `totalItems`      | number   | `0`                            | Общее количество элементов              |
| `itemsPerPage`    | number   | `9`                            | Количество элементов на странице        |
| `currentPage`     | number   | `1`                            | Текущая страница (начиная с 1)          |
| `onPageChange`    | Function | `() => {}`                     | Callback при смене страницы             |
| `maxVisiblePages` | number   | `5`                            | Максимальное количество видимых страниц |
| `buttonClass`     | string   | `'pagination__button'`         | CSS класс для кнопок                    |
| `activeClass`     | string   | `'pagination__button--active'` | CSS класс для активной кнопки           |
| `showArrows`      | boolean  | `true`                         | Показывать ли стрелки навигации         |

## Публичные методы

### `update(data)`

Обновление данных пагинации

```javascript
pagination.update({
  totalItems: 150,
  itemsPerPage: 12,
  currentPage: 2,
});
```

### `goToPage(page)`

Переход на указанную страницу

```javascript
pagination.goToPage(3); // Переход на страницу 3
```

### `getPageData()`

Получение данных текущей страницы

```javascript
const data = pagination.getPageData();
console.log(data);
// {
//   currentPage: 2,
//   totalPages: 12,
//   itemsPerPage: 9,
//   totalItems: 100,
//   start: 10,
//   end: 18
// }
```

### `destroy()`

Уничтожение экземпляра и очистка

```javascript
pagination.destroy();
```

## Примеры использования

### Базовое использование с автоматической инициализацией

```html
<div class="news__pagination" data-pagination data-total-items="100" data-items-per-page="9"></div>
```

### Интеграция с фильтрацией новостей

```javascript
import { Pagination } from './pagination.js';

let currentFilter = 'all';
let allNews = []; // Все новости
let filteredNews = []; // Отфильтрованные новости

function initPagination() {
  const pagination = new Pagination('.news__pagination', {
    totalItems: filteredNews.length,
    itemsPerPage: 9,
    currentPage: 1,
    onPageChange: (page, data) => {
      displayNews(filteredNews.slice(data.start - 1, data.end));
    },
  });

  return pagination;
}

function filterNews(category) {
  currentFilter = category;
  filteredNews = category === 'all' ? allNews : allNews.filter(news => news.category === category);

  // Обновляем пагинацию
  if (window.newsPagination) {
    window.newsPagination.update({
      totalItems: filteredNews.length,
      currentPage: 1,
    });
    // Показываем первую страницу
    displayNews(filteredNews.slice(0, 9));
  }
}
```

### Динамическое обновление при загрузке данных

```javascript
async function loadNews() {
  const response = await fetch('/api/news');
  const news = await response.json();

  // Обновляем пагинацию с новыми данными
  pagination.update({
    totalItems: news.length,
    currentPage: 1,
  });

  // Показываем первую страницу
  const firstPage = pagination.getPageData();
  displayNews(news.slice(firstPage.start - 1, firstPage.end));
}
```

### Кастомные стили кнопок

```javascript
const pagination = new Pagination('.news__pagination', {
  totalItems: 100,
  itemsPerPage: 9,
  buttonClass: 'my-custom-button',
  activeClass: 'my-custom-button--active',
});
```

```css
.my-custom-button {
  /* Ваши стили */
}

.my-custom-button--active {
  /* Стили активной кнопки */
}
```

## CSS требования

Базовые стили для пагинации:

```css
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination__button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  background-color: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 300ms ease;
  color: var(--color-fiord, #4a586e);
  font-size: 1rem;
}

.pagination__button:hover:not(:disabled) {
  background-color: rgba(74, 88, 110, 0.1);
}

.pagination__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__button--active {
  background-color: var(--color-orange, #fd5d39);
  color: var(--color-white, #ffffff);
}

.pagination__button--arrow {
  padding: 0 8px;
}
```

## Совместимость

- Современные браузеры (ES6+)
- Поддержка ARIA атрибутов для доступности
- Адаптивный дизайн
- Оптимизация производительности

## Примечания

1. **Нумерация страниц:** Страницы нумеруются начиная с 1, а не с 0
2. **Автоматическое скрытие:** Пагинация автоматически скрывается, если страниц меньше 2
3. **Ограничение страниц:** Если страниц больше `maxVisiblePages`, показывается диапазон вокруг текущей страницы
4. **Callback:** `onPageChange` вызывается с двумя параметрами: номер страницы и объект с данными страницы
5. **События:** При использовании data-атрибутов события генерируются автоматически через CustomEvent

## Оптимизация

- Минимальное количество DOM операций
- Эффективное вычисление видимых страниц
- Защита от некорректных значений
- Автоматическая очистка при уничтожении
