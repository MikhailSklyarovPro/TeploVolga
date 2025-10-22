# Quotes Carousel - Универсальный карусель для цитат

## Описание

Универсальный JavaScript класс для создания карусели цитат с бесконечным переключением, плавными переходами и поддержкой автоплея.

## Возможности

- ✅ Бесконечное переключение (при достижении конца переходит в начало)
- ✅ Плавные переходы с настраиваемой длительностью
- ✅ Автоплей с настраиваемым интервалом
- ✅ Поддержка клавиатуры (стрелки влево/вправо)
- ✅ Пауза автоплея при наведении
- ✅ Универсальные селекторы для переиспользуемости
- ✅ Адаптивность и оптимизация

## Использование

### HTML структура

```html
<section class="home__quotes">
  <article class="home__quote" data-quote-item>
    <!-- Контент цитаты -->
    <div class="home__quote-container__buttons">
      <button data-quote-button>←</button>
      <button data-quote-button>→</button>
    </div>
  </article>
  <!-- Дополнительные цитаты... -->
</section>
```

### Автоматическая инициализация

```javascript
// Карусель автоматически инициализируется при загрузке DOM
// Доступна глобально через window.quotesCarousel
```

### Ручная инициализация

```javascript
const carousel = new QuotesCarousel('.home__quotes', {
  itemSelector: '.home__quote',
  buttonSelector: '[data-quote-button]',
  autoPlay: true,
  autoPlayInterval: 5000,
  transitionDuration: 300,
});
```

## Настройки

| Параметр             | Тип     | По умолчанию            | Описание                         |
| -------------------- | ------- | ----------------------- | -------------------------------- |
| `itemSelector`       | string  | `'[data-quote-item]'`   | Селектор элементов цитат         |
| `buttonSelector`     | string  | `'[data-quote-button]'` | Селектор кнопок навигации        |
| `activeClass`        | string  | `'active'`              | CSS класс для активного элемента |
| `transitionDuration` | number  | `300`                   | Длительность перехода в мс       |
| `autoPlay`           | boolean | `false`                 | Включить автоплей                |
| `autoPlayInterval`   | number  | `5000`                  | Интервал автоплея в мс           |

## Публичные методы

### `navigate(direction)`

Переключение на следующую/предыдущую цитату

```javascript
carousel.navigate('next'); // Следующая цитата
carousel.navigate('prev'); // Предыдущая цитата
```

### `goToSlide(index)`

Переход к конкретной цитате по индексу

```javascript
carousel.goToSlide(2); // Переход к третьей цитате
```

### `startAutoPlay()`

Запуск автоплея

```javascript
carousel.startAutoPlay();
```

### `pauseAutoPlay()`

Остановка автоплея

```javascript
carousel.pauseAutoPlay();
```

### `destroy()`

Уничтожение карусели и очистка событий

```javascript
carousel.destroy();
```

## CSS классы

### `.home__quote`

- `opacity: 1` - Прозрачность активной цитаты
- `transition: opacity 0.3s ease-in-out` - Плавный переход

### `.home__quote-container__buttons button`

- `cursor: pointer` - Курсор указателя
- `transition: transform 0.2s ease-in-out` - Плавная анимация при наведении
- `:hover` - Увеличение и изменение прозрачности
- `:active` - Уменьшение при нажатии

## События

### Клавиатура

- `ArrowLeft` - Предыдущая цитата
- `ArrowRight` - Следующая цитата

### Мышь

- `mouseenter` - Пауза автоплея
- `mouseleave` - Возобновление автоплея

## Примеры использования

### Базовое использование

```javascript
// Карусель уже инициализирована автоматически
// Доступна через window.quotesCarousel
```

### Кастомная настройка

```javascript
const customCarousel = new QuotesCarousel('.my-quotes', {
  itemSelector: '.quote-item',
  buttonSelector: '.nav-button',
  autoPlay: true,
  autoPlayInterval: 3000,
  transitionDuration: 500,
});
```

### Программное управление

```javascript
// Переход к следующей цитате
quotesCarousel.navigate('next');

// Переход к предыдущей цитате
quotesCarousel.navigate('prev');

// Переход к конкретной цитате
quotesCarousel.goToSlide(1);

// Остановка автоплея
quotesCarousel.pauseAutoPlay();
```

## Совместимость

- Современные браузеры (ES6+)
- Поддержка touch-событий
- Адаптивный дизайн
- Оптимизация производительности
