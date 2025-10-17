# Модуль навигации (SwipeController)

Упрощенный модуль для навигации по контейнерам с поддержкой кнопок и бесконечного скролла.

## Возможности

- ✅ Кнопки навигации (вперед/назад)
- ✅ Бесконечный (цикличный) скролл
- ✅ Плавные анимации

## Использование

### Базовое использование

```html
<section class="my-container" data-swipe>
  <div class="item">Элемент 1</div>
  <div class="item">Элемент 2</div>
  <div class="item">Элемент 3</div>
</section>
```

### С кнопками навигации

```html
<section class="my-container" data-swipe>
  <button data-swipe-prev>←</button>
  <button data-swipe-next>→</button>

  <div class="item">Элемент 1</div>
  <div class="item">Элемент 2</div>
  <div class="item">Элемент 3</div>
</section>
```

### С бесконечным свайпом

```html
<section class="my-container" data-swipe data-infinite-swipe>
  <div class="item">Элемент 1</div>
  <div class="item">Элемент 2</div>
  <div class="item">Элемент 3</div>
</section>
```

### Программное управление

```javascript
// Получить экземпляр контроллера
const container = document.querySelector('[data-swipe]');
const swipeController = container._swipeController;

// Перейти к следующему элементу
swipeController.next();

// Перейти к предыдущему элементу
swipeController.prev();

// Перейти к конкретному индексу
swipeController.goTo(2);

// Получить текущий индекс
const currentIndex = swipeController.getCurrentIndex();
```

## Атрибуты

- `data-swipe` - активирует свайп на контейнере
- `data-infinite-swipe` - включает бесконечный (цикличный) свайп
- `data-swipe-prev` - кнопка "назад"
- `data-swipe-next` - кнопка "вперед"
- `data-swipe-duration` - длительность анимации (по умолчанию 300ms)

## Логика работы

### Бесконечный скролл

- Клонирование элементов в начало и конец
- Плавный переход между клонами и оригиналами
- Простое позиционирование

## CSS классы

- `.swipe-container` - автоматически добавляется к контейнерам со свайпом
- `.swipe-nav-btn` - стили для кнопок навигации
- `.swipe-indicators` - контейнер для индикаторов
- `.swipe-indicator` - отдельный индикатор
- `.swipe-indicator.active` - активный индикатор

## Примеры интеграции

### В существующий проект

```html
<!-- Подключение стилей -->
<link rel="stylesheet" href="styles/components/swipe.css" />

<!-- HTML -->
<section class="home__companies" data-swipe>
  <button class="swipe-nav-btn" data-swipe-prev>←</button>
  <button class="swipe-nav-btn" data-swipe-next>→</button>

  <!-- Ваши элементы -->
</section>

<!-- Подключение скрипта -->
<script src="js/swipe.js"></script>
```

### Кастомизация

```css
/* Стили для кнопок навигации */
.swipe-nav-btn {
  background: your-color;
  border: your-border;
  /* ваши стили */
}

/* Стили для контейнера */
.swipe-container {
  /* ваши стили */
}
```
