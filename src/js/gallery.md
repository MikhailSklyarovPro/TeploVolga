# Документация по логике фотогалереи

## Обзор

Фотогалерея реализована как класс `GalleryController` в файле `gallery.js`. Галерея поддерживает плавную анимацию переключения изображений, навигацию через кнопки и миниатюры, а также поддержку сенсорных жестов на мобильных устройствах.

**Особенность**: Все данные хранятся в HTML атрибутах для совместимости с Битрикс. JavaScript автоматически парсит данные из верстки.

## Основные возможности

### 1. Навигация

- **Кнопки "Назад/Вперед"**: Стрелки для переключения между изображениями
- **Миниатюры**: Клик по миниатюре переключает на соответствующее изображение
- **Клавиатура**: Стрелки влево/вправо для навигации
- **Свайп**: Поддержка свайпа на мобильных устройствах

### 2. Анимации

- **Плавное переключение**: Изображения переключаются с эффектом fade (opacity)
- **Hover эффекты**: Увеличение миниатюр при наведении
- **Активное состояние**: Визуальное выделение активной миниатюры

### 3. Адаптивность

- **Responsive дизайн**: Адаптация под разные размеры экранов
- **Мобильная навигация**: Оптимизация для сенсорных устройств

## Структура данных

### HTML атрибуты для миниатюр

Каждая миниатюра должна содержать следующие data-атрибуты:

```html
<button
  class="home__gallery__thumbnail"
  data-gallery-thumb="0"
  data-gallery-title="Заголовок изображения"
  data-gallery-description="Первый параграф описания|Второй параграф описания"
>
  <img src="путь_к_изображению" alt="альтернативный_текст" />
</button>
```

### Атрибуты:

- `data-gallery-thumb` - индекс изображения (0, 1, 2...)
- `data-gallery-title` - заголовок изображения
- `data-gallery-description` - описание (параграфы разделяются символом `|`)

### Автоматический парсинг

JavaScript автоматически создает массив изображений из HTML:

```javascript
// Автоматически парсится в:
images: [
  {
    src: 'путь_к_изображению',
    alt: 'альтернативный_текст',
    title: 'заголовок_изображения',
    description: ['параграф1', 'параграф2'],
  },
];
```

## API класса GalleryController

### Конструктор

```javascript
new GalleryController();
```

Инициализирует галерею и привязывает обработчики событий.

### Публичные методы

#### `getCurrentIndex()`

Возвращает индекс текущего изображения.

```javascript
const currentIndex = galleryController.getCurrentIndex();
```

#### `getTotalImages()`

Возвращает общее количество изображений в галерее.

```javascript
const total = galleryController.getTotalImages();
```

#### `getCurrentImage()`

Возвращает объект текущего изображения.

```javascript
const currentImage = galleryController.getCurrentImage();
```

### Внутренние методы

#### `previousImage()`

Переключает на предыдущее изображение.

#### `nextImage()`

Переключает на следующее изображение.

#### `goToImage(index)`

Переключает на изображение с указанным индексом.

#### `updateGallery()`

Обновляет отображение галереи (изображение, текст, активную миниатюру).

## Обработчики событий

### 1. Клики по кнопкам навигации

```javascript
this.prevBtn?.addEventListener('click', () => this.previousImage());
this.nextBtn?.addEventListener('click', () => this.nextImage());
```

### 2. Клики по миниатюрам

```javascript
this.thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => this.goToImage(index));
});
```

### 3. Клавиатурная навигация

```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') this.previousImage();
  if (e.key === 'ArrowRight') this.nextImage();
});
```

### 4. Сенсорная навигация

```javascript
// touchstart - начало касания
// touchend - окончание касания
// Анализ направления свайпа
```

## CSS классы и селекторы

### Основные элементы

- `.home__gallery` - основной контейнер галереи
- `.home__gallery__main-image` - главное изображение
- `.home__gallery__thumbnail` - миниатюры
- `.home__gallery__nav-btn` - кнопки навигации

### Состояния

- `.active` - активная миниатюра
- `:hover` - эффекты при наведении

## Анимации

### 1. Переключение изображений

```css
.home__gallery__main-image {
  transition: opacity 0.3s ease-in-out;
}
```

### 2. Hover эффекты миниатюр

```css
.home__gallery__thumbnail:hover img {
  transform: scale(1.05);
}
```

### 3. Активное состояние

```css
.home__gallery__thumbnail.active {
  box-shadow: 0 0 0 3px var(--color-orange);
}
```

## Адаптивность

### Медиа-запросы

```css
/* Планшеты */
@media (width <=1200px) {
  .home__gallery__main {
    flex-direction: column;
  }
}

/* Мобильные устройства */
@media (width <=768px) {
  .home__gallery__thumbnails {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Инициализация

Галерея автоматически инициализируется при загрузке DOM:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.home__gallery')) {
    window.galleryController = new GalleryController();
  }
});
```

## Совместимость с Битрикс

### Использование в шаблонах Битрикс

Галерея полностью совместима с Битрикс. Для использования:

1. **В шаблоне** добавьте HTML структуру с data-атрибутами
2. **В компоненте** используйте переменные для подстановки данных:

```php
// Пример для Битрикс компонента
foreach ($arResult['GALLERY_ITEMS'] as $index => $item) {
    echo '<button class="home__gallery__thumbnail"
                  data-gallery-thumb="' . $index . '"
                  data-gallery-title="' . htmlspecialchars($item['TITLE']) . '"
                  data-gallery-description="' . htmlspecialchars($item['DESCRIPTION']) . '">';
    echo '<img src="' . $item['IMAGE'] . '" alt="' . htmlspecialchars($item['ALT']) . '" />';
    echo '</button>';
}
```

### Преимущества для Битрикс:

- ✅ **Нет жестко заданных данных** в JavaScript
- ✅ **Легкая интеграция** с компонентами
- ✅ **Гибкое управление** контентом через админку
- ✅ **SEO-дружественность** - все данные в HTML

## Расширение функциональности

### Добавление новых изображений

Для добавления нового изображения в галерею:

1. Добавьте изображение в папку `img/home/block6-gallery/`
2. Добавьте соответствующую миниатюру в HTML с data-атрибутами
3. JavaScript автоматически подхватит новое изображение

### Кастомизация анимаций

Для изменения анимаций переключения измените CSS свойства:

```css
.home__gallery__main-image {
  transition: opacity 0.3s ease-in-out; /* Измените время и эффект */
}
```

### Добавление новых обработчиков

```javascript
// Пример: автопрокрутка
setInterval(() => {
  galleryController.nextImage();
}, 5000);
```

## Отладка

### Проверка состояния галереи

```javascript
console.log('Текущий индекс:', window.galleryController.getCurrentIndex());
console.log('Всего изображений:', window.galleryController.getTotalImages());
console.log('Текущее изображение:', window.galleryController.getCurrentImage());
```

### Обработка ошибок

Галерея включает проверки на существование элементов:

```javascript
this.mainImage?.addEventListener('touchstart', e => {
  // Обработчик выполнится только если элемент существует
});
```

## Производительность

### Оптимизации

- Ленивая загрузка изображений (при необходимости)
- Кэширование DOM элементов
- Оптимизированные CSS transitions
- Минимальное количество перерисовок

### Рекомендации

- Используйте WebP формат для изображений
- Оптимизируйте размеры изображений
- Избегайте слишком частых переключений
