# Carousel - Универсальная карусель для контента

## Описание

Универсальный JavaScript класс для создания карусели с бесконечным переключением, плавными переходами и поддержкой автоплея. Подходит для любого типа контента: слайдов, цитат, изображений и т.д.

## Возможности

- ✅ Бесконечное переключение (при достижении конца переходит в начало)
- ✅ Плавные переходы с настраиваемой длительностью
- ✅ Два типа анимаций: **fade** (плавное исчезновение/появление) и **slide** (слайд в сторону)
- ✅ Автоплей с настраиваемым интервалом
- ✅ Поддержка клавиатуры (стрелки влево/вправо)
- ✅ Пауза автоплея при наведении
- ✅ Универсальные data-атрибуты для переиспользуемости
- ✅ Автоматическая инициализация через HTML атрибуты
- ✅ Адаптивность и оптимизация
- ✅ Поддержка множественных экземпляров на одной странице

## Использование

### HTML структура с data-атрибутами

Карусель использует универсальные data-атрибуты для полной переиспользуемости:

#### Пример 1: Главный экран с анимацией slide

```html
<section
  id="main-screen-carousel"
  class="home__main-screen"
  data-carousel
  data-carousel-animation="slide"
  data-carousel-duration="300"
>
  <button class="home__main-screen__controls__prev" data-carousel-prev>←</button>

  <div class="home__main-screen__items">
    <div class="home__main-screen__item" data-carousel-item>
      <!-- Контент слайда 1 -->
    </div>
    <div class="home__main-screen__item" data-carousel-item>
      <!-- Контент слайда 2 -->
    </div>
    <div class="home__main-screen__item" data-carousel-item>
      <!-- Контент слайда 3 -->
    </div>
  </div>

  <button class="home__main-screen__controls__next" data-carousel-next>→</button>
</section>
```

#### Пример 2: Цитаты с анимацией fade

```html
<section
  id="quotes-carousel"
  class="home__quotes"
  data-carousel
  data-carousel-animation="fade"
  data-carousel-duration="300"
>
  <button class="home__quotes__button-prev" data-carousel-prev>←</button>

  <div class="home__quotes__content">
    <article class="home__quote" data-carousel-item>
      <!-- Контент цитаты 1 -->
    </article>
    <article class="home__quote" data-carousel-item>
      <!-- Контент цитаты 2 -->
    </article>
  </div>

  <button class="home__quotes__button-next" data-carousel-next>→</button>
</section>
```

#### Пример 3: С автоплеем

```html
<section
  id="auto-carousel"
  class="my-carousel"
  data-carousel
  data-carousel-animation="fade"
  data-carousel-autoplay
  data-carousel-interval="5000"
  data-carousel-duration="500"
>
  <button data-carousel-prev>←</button>

  <div class="carousel-items">
    <div data-carousel-item>Слайд 1</div>
    <div data-carousel-item>Слайд 2</div>
  </div>

  <button data-carousel-next>→</button>
</section>
```

### Data-атрибуты

| Атрибут                              | Обязательный | Описание                                                    | Пример значения      |
| ------------------------------------ | ------------ | ----------------------------------------------------------- | -------------------- |
| `data-carousel`                      | ✅           | Основной атрибут контейнера карусели                        | —                    |
| `data-carousel-animation`            | ❌           | Тип анимации: `fade` или `slide`                            | `slide`, `fade`      |
| `data-carousel-duration`             | ❌           | Длительность перехода в миллисекундах                       | `300`, `500`         |
| `data-carousel-autoplay`             | ❌           | Включает автоматическое переключение (без значения)         | —                    |
| `data-carousel-interval`             | ❌           | Интервал автоплея в миллисекундах (используется с autoplay) | `5000`, `3000`       |
| `data-carousel-pagination`           | ❌           | CSS селектор контейнера для пагинации                       | `.my-pagination`     |
| `data-carousel-pagination-dot-class` | ❌           | CSS класс для точек пагинации                               | `my-pagination__dot` |
| `data-carousel-item`                 | ✅           | Отмечает элемент карусели (слайд)                           | —                    |
| `data-carousel-slide-target`         | ❌           | Элемент внутри слайда для анимации slide                    | —                    |
| `data-carousel-prev`                 | ❌           | Кнопка "Назад"                                              | —                    |
| `data-carousel-next`                 | ❌           | Кнопка "Вперед"                                             | —                    |

**Примечание:** Контейнер должен иметь уникальный `id` для корректной инициализации.

### Типы анимаций

#### 1. Fade (Плавное исчезновение/появление)

Элементы плавно исчезают и появляются, изменяя прозрачность.

```html
data-carousel-animation="fade"
```

**CSS требования:**

```css
.carousel-item {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}
```

**Когда использовать:**

- Цитаты и текстовый контент
- Элементы с большим количеством текста
- Когда нужен спокойный, ненавязчивый переход

#### 2. Slide (Слайд в сторону)

Элементы плавно выезжают в сторону и заезжают с противоположной стороны.

```html
data-carousel-animation="slide"
```

**CSS требования:**

```css
.carousel-item {
  opacity: 0;
  transition:
    opacity 300ms ease-in-out,
    transform 300ms ease-in-out;
}

.carousel-item.active {
  opacity: 1;
}
```

**Когда использовать:**

- Главные экраны и баннеры
- Галереи изображений
- Когда нужен динамичный, выразительный переход
- Элементы с полноэкранными изображениями

**Использование slide-target:**

Для анимации slide можно указать конкретный элемент, который будет анимироваться, через атрибут `data-carousel-slide-target`. Это полезно, когда у слайда есть фоновое изображение на весь контейнер, а анимировать нужно только контент:

```html
<div class="slide" data-carousel-item>
  <div class="slide__content" data-carousel-slide-target>
    <!-- Этот элемент будет анимироваться -->
    <h1>Заголовок</h1>
    <p>Текст</p>
  </div>
  <img class="slide__bg" src="background.jpg" alt="Фон" />
</div>
```

Если `data-carousel-slide-target` не указан, анимация применяется ко всему слайду.

### Пагинация (индикатор страниц)

Карусель поддерживает опциональную пагинацию - индикатор, показывающий на какой "страничке" вы находитесь.

```html
<section
  id="my-carousel"
  data-carousel
  data-carousel-animation="slide"
  data-carousel-pagination=".my-carousel__pagination"
  data-carousel-pagination-dot-class="my-carousel__pagination__dot"
>
  <button data-carousel-prev>←</button>

  <div class="slides">
    <div data-carousel-item>Слайд 1</div>
    <div data-carousel-item>Слайд 2</div>
    <div data-carousel-item>Слайд 3</div>
  </div>

  <!-- Контейнер для пагинации -->
  <div class="my-carousel__pagination"></div>

  <button data-carousel-next>→</button>
</section>
```

**CSS для пагинации:**

```css
.my-carousel__pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px 0;
}

.my-carousel__pagination__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(0 0 0 / 30%);
  cursor: pointer;
  transition: all 300ms ease-in-out;
}

.my-carousel__pagination__dot.active {
  width: 40px;
  border-radius: 5px;
  background-color: rgb(0 0 0 / 100%);
}

.my-carousel__pagination__dot:hover {
  background-color: rgb(0 0 0 / 50%);
}
```

**Особенности:**

- Точки создаются автоматически (по одной на каждый слайд)
- Клик по точке переключает на соответствующий слайд
- Активная точка получает класс `active`
- Если пагинация не нужна, просто не указывайте атрибут `data-carousel-pagination`

### Автоматическая инициализация

Карусель автоматически инициализируется для всех элементов с атрибутом `data-carousel` при загрузке DOM:

```javascript
// Ничего делать не нужно! Просто добавьте атрибуты в HTML
```

Экземпляр карусели сохраняется в DOM элементе и доступен через:

```javascript
const carousel = document.getElementById('main-screen-carousel').carouselInstance;
carousel.navigate('next'); // Переход к следующему слайду
```

### Ручная инициализация

Если нужно создать карусель программно:

```javascript
const carousel = new Carousel('#my-carousel', {
  itemSelector: '[data-carousel-item]',
  buttonPrevSelector: '[data-carousel-prev]',
  buttonNextSelector: '[data-carousel-next]',
  animationType: 'slide', // 'fade' или 'slide'
  autoPlay: false,
  autoPlayInterval: 5000,
  transitionDuration: 300,
});
```

## Настройки (для ручной инициализации)

| Параметр              | Тип     | По умолчанию                     | Описание                             |
| --------------------- | ------- | -------------------------------- | ------------------------------------ |
| `itemSelector`        | string  | `'[data-carousel-item]'`         | Селектор элементов карусели          |
| `buttonPrevSelector`  | string  | `'[data-carousel-prev]'`         | Селектор кнопки "Назад"              |
| `buttonNextSelector`  | string  | `'[data-carousel-next]'`         | Селектор кнопки "Вперед"             |
| `slideTargetSelector` | string  | `'[data-carousel-slide-target]'` | Селектор элемента для анимации slide |
| `paginationSelector`  | string  | `null`                           | CSS селектор контейнера пагинации    |
| `paginationDotClass`  | string  | `'carousel-pagination__dot'`     | CSS класс для точек пагинации        |
| `activeClass`         | string  | `'active'`                       | CSS класс для активного элемента     |
| `animationType`       | string  | `'fade'`                         | Тип анимации: `fade` или `slide`     |
| `transitionDuration`  | number  | `300`                            | Длительность перехода в мс           |
| `autoPlay`            | boolean | `false`                          | Включить автоплей                    |
| `autoPlayInterval`    | number  | `5000`                           | Интервал автоплея в мс               |

## Публичные методы

### `navigate(direction)`

Переключение на следующий/предыдущий элемент

```javascript
const carousel = document.getElementById('main-screen-carousel').carouselInstance;
carousel.navigate('next'); // Следующий слайд
carousel.navigate('prev'); // Предыдущий слайд
```

### `goToSlide(index)`

Переход к конкретному слайду по индексу (начиная с 0)

```javascript
carousel.goToSlide(2); // Переход к третьему слайду
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

## События

### Клавиатура

- `ArrowLeft` - Предыдущий слайд (работает для всех каруселей на странице)
- `ArrowRight` - Следующий слайд (работает для всех каруселей на странице)

### Мышь

- `mouseenter` (на контейнере) - Пауза автоплея (если включен)
- `mouseleave` (на контейнере) - Возобновление автоплея (если включен)

## Примеры использования

### Базовое использование

```html
<!-- Просто добавьте атрибуты и готово! -->
<section id="my-carousel" data-carousel data-carousel-animation="fade">
  <button data-carousel-prev>←</button>
  <div data-carousel-item>Слайд 1</div>
  <div data-carousel-item>Слайд 2</div>
  <button data-carousel-next>→</button>
</section>
```

### Программное управление

```javascript
// Получить экземпляр карусели
const carousel = document.getElementById('main-screen-carousel').carouselInstance;

// Переход к следующему слайду
carousel.navigate('next');

// Переход к предыдущему слайду
carousel.navigate('prev');

// Переход к конкретному слайду
carousel.goToSlide(1);

// Управление автоплеем
carousel.startAutoPlay();
carousel.pauseAutoPlay();
```

### Несколько каруселей на странице

```html
<!-- Карусель 1: Главный экран со слайдами -->
<section id="carousel-1" data-carousel data-carousel-animation="slide">
  <button data-carousel-prev>←</button>
  <div data-carousel-item>Слайд 1</div>
  <div data-carousel-item>Слайд 2</div>
  <button data-carousel-next>→</button>
</section>

<!-- Карусель 2: Отзывы с автоплеем -->
<section
  id="carousel-2"
  data-carousel
  data-carousel-animation="fade"
  data-carousel-autoplay
  data-carousel-interval="3000"
>
  <button data-carousel-prev>←</button>
  <div data-carousel-item>Отзыв 1</div>
  <div data-carousel-item>Отзыв 2</div>
  <button data-carousel-next>→</button>
</section>
```

## CSS рекомендации

### Базовые стили

```css
/* Контейнер карусели */
[data-carousel] {
  position: relative;
  overflow: hidden;
}

/* Элементы карусели */
[data-carousel-item] {
  display: none;
  opacity: 0;
  transition:
    opacity 300ms ease-in-out,
    transform 300ms ease-in-out;
}

[data-carousel-item].active {
  display: flex; /* или block, в зависимости от вашей верстки */
  opacity: 1;
}

/* Кнопки навигации */
[data-carousel-prev],
[data-carousel-next] {
  cursor: pointer;
  transition: transform 200ms ease-in-out;
}

[data-carousel-prev]:hover,
[data-carousel-next]:hover {
  transform: scale(1.1);
}

[data-carousel-prev]:active,
[data-carousel-next]:active {
  transform: scale(0.95);
}
```

### Стили для анимации slide

Если используете `data-carousel-animation="slide"`, убедитесь что у элементов есть transition для transform:

```css
[data-carousel-item] {
  transition:
    opacity 300ms ease-in-out,
    transform 300ms ease-in-out;
}
```

## Совместимость

- Современные браузеры (ES6+)
- Поддержка клавиатуры
- Адаптивный дизайн
- Оптимизация производительности
- Поддержка множественных экземпляров

## Примечания

1. **Обязательный ID:** Контейнер карусели должен иметь уникальный `id` для автоматической инициализации
2. **CSS классы:** Класс `active` автоматически добавляется к текущему элементу, используйте его для стилизации
3. **Автоплей:** Автоматически останавливается при наведении и возобновляется при уходе мыши
4. **Клавиатура:** Стрелки работают глобально для всех каруселей на странице
5. **Display:** Для корректной работы анимаций элементы должны иметь `display: flex` или `display: block`
6. **Transform:** Для анимации slide обязательно добавьте `transition` для свойства `transform`

## Оптимизация

- Используется `requestAnimationFrame` для плавных анимаций
- Защита от спама кликами через флаг `isTransitioning`
- Автоматическая очистка таймеров при уничтожении
- Минимальное влияние на производительность страницы
- Отложенные переходы для стабилизации DOM

## Миграция со старого QuotesCarousel

Если у вас был старый код с `QuotesCarousel`, просто добавьте data-атрибуты в HTML:

### Было:

```html
<section class="home__quotes">
  <div class="home__quote">...</div>
  <button class="home__quotes__button-prev">←</button>
  <button class="home__quotes__button-next">→</button>
</section>
```

### Стало:

```html
<section id="quotes-carousel" class="home__quotes" data-carousel data-carousel-animation="fade">
  <div class="home__quote" data-carousel-item>...</div>
  <button class="home__quotes__button-prev" data-carousel-prev>←</button>
  <button class="home__quotes__button-next" data-carousel-next>→</button>
</section>
```

Все работает автоматически! 🎉
