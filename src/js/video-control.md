# Универсальный модуль управления видео с модальными окнами (VideoController)

Универсальный модуль для управления видео с фоновым воспроизведением и модальными окнами. Поддерживает зацикленное фоновое видео и открытие полноэкранного видео в модальном окне с controls.

## Возможности

- ✅ Зацикленное фоновое видео (автозапуск, без звука)
- ✅ Открытие модального окна по клику на постер
- ✅ Полноэкранное видео с controls в модальном окне
- ✅ Автозапуск видео в модальном окне
- ✅ Закрытие модального окна (клик на overlay, Escape, кнопка закрытия)
- ✅ Блокировка скролла при открытом модальном окне
- ✅ Настройка поведения через data-атрибуты
- ✅ Программное управление через API
- ✅ Универсальное использование на любых страницах

## Использование

### Базовое использование

```html
<!-- Контейнер с фоновым видео -->
<div data-video-controller data-modal-target="#my-video-modal">
  <video loop muted autoplay>
    <source src="video/background.webm" type="video/webm" />
  </video>
  <div data-video-poster>
    <svg><!-- Иконка воспроизведения --></svg>
    <p>Описание видео</p>
  </div>
</div>

<!-- Модальное окно -->
<div id="my-video-modal" class="video-modal">
  <div class="video-modal-content">
    <button data-modal-close>×</button>
    <video controls controlsList="nofullscreen" disablepictureinpicture>
      <source src="video/background.webm" type="video/webm" />
    </video>
  </div>
</div>
```

### С настройками

```html
<div
  data-video-controller
  data-modal-target="#my-video-modal"
  data-auto-play-background="true"
  data-loop-background="true"
  data-mute-background="true"
  data-auto-play-modal="true"
  data-show-controls-modal="true"
  data-transition-duration="500ms"
>
  <!-- ... -->
</div>
```

### Подключение скрипта

```html
<script src="js/video-control.js"></script>
```

## Data-атрибуты

### Основные атрибуты

- `data-video-controller` - активирует контроллер видео на контейнере
- `data-video-poster` - указывает элемент с постером (кликабельный overlay)
- `data-modal-target` - селектор модального окна (например: `#my-modal`)
- `data-modal-close` - кнопка закрытия модального окна

### Настройки фонового видео

- `data-auto-play-background` - автозапуск фонового видео (по умолчанию: `true`)
- `data-loop-background` - зацикливание фонового видео (по умолчанию: `true`)
- `data-mute-background` - отключение звука фонового видео (по умолчанию: `true`)

### Настройки модального окна

- `data-auto-play-modal` - автозапуск видео в модальном окне (по умолчанию: `true`)
- `data-show-controls-modal` - показывать controls в модальном окне (по умолчанию: `true`)
- `data-transition-duration` - длительность анимации (по умолчанию: `300ms`)

## Логика работы

### Фоновое видео

1. Автоматически запускается при загрузке страницы
2. Воспроизводится в цикле без звука
3. Служит как превью/анонс основного видео

### При клике на постер

1. Открывается модальное окно с плавной анимацией
2. Блокируется скролл страницы
3. Автоматически запускается видео с controls
4. Копируется источник видео из фонового элемента

### При закрытии модального окна

1. Видео останавливается и сбрасывается в начало
2. Модальное окно закрывается с анимацией
3. Восстанавливается скролл страницы
4. Фоновое видео продолжает воспроизводиться

## CSS классы

### Обязательные стили

```css
/* Контейнер видео */
[data-video-controller] {
  position: relative;
}

/* Постер (overlay) */
[data-video-poster] {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Модальное окно */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f1f6fbc2;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* Контент модального окна */
.video-modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  border-radius: 20px;
}

.video-modal video {
  /* 345px-1270px */
  width: clamp(21.563rem, 7.531rem + 59.87vw, 79.375rem);
  /* 182px-744px */
  height: clamp(11.375rem, 2.8495rem + 36.3754vw, 46.5rem);
  border-radius: 20px;
  object-fit: cover;
}

/* Кнопка закрытия */
[data-modal-close] {
  align-self: flex-end;
}
```

## Программное управление

### Получение контроллера

```javascript
// Получить контроллер для конкретного контейнера
const container = document.querySelector('[data-video-controller]');
const controller = container._videoController;
```

### Методы контроллера

```javascript
// Управление модальным окном
controller.openModal(); // Открыть модальное окно
controller.closeModal(); // Закрыть модальное окно
controller.isModalOpen(); // Проверить, открыто ли модальное окно

// Управление фоновым видео
const bgVideo = controller.getBackgroundVideo();
const isBgPlaying = controller.isBackgroundPlaying();

// Управление видео в модальном окне
const modalVideo = controller.getModalVideo();
const isModalPlaying = controller.isModalPlaying();
```

## События

### Обрабатываемые события

- `click` на `[data-video-poster]` - открытие модального окна
- `click` на `[data-modal-close]` - закрытие модального окна
- `click` на overlay модального окна - закрытие модального окна
- `keydown` Escape - закрытие модального окна

### Автоматически добавляемые стили

- `cursor: pointer` для интерактивности постера
- `transition: opacity {duration} ease` для плавных анимаций
- `overflow: hidden` для body при открытом модальном окне

## Примеры интеграции

### В существующий проект

```html
<!-- HTML структура -->
<div class="video-container" data-video-controller data-modal-target="#video-modal">
  <video loop muted autoplay>
    <source src="video/background.webm" type="video/webm" />
  </video>
  <div class="video-poster" data-video-poster>
    <svg><!-- Иконка воспроизведения --></svg>
    <p>Описание видео</p>
  </div>
</div>

<!-- Модальное окно -->
<div id="video-modal" class="video-modal">
  <div class="video-modal-content">
    <button class="modal-close" data-modal-close>×</button>
    <video controls>
      <source src="video/background.webm" type="video/webm" />
    </video>
  </div>
</div>

<!-- Подключение скрипта -->
<script src="js/video-control.js"></script>
```

### Кастомизация стилей

```css
/* Стили для постера */
[data-video-poster] {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  padding: 10px;
  gap: 15px;
  display: flex;
  align-items: center;
  max-width: 395px;
  width: 100%;
}

/* Стили для модального окна */
.video-modal {
  backdrop-filter: blur(10px);
}

.video-modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Стили для кнопки закрытия */
[data-modal-close] {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

[data-modal-close]:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

### Различные конфигурации

```html
<!-- Видео без автозапуска в модальном окне -->
<div data-video-controller data-auto-play-modal="false">
  <!-- ... -->
</div>

<!-- Фоновое видео со звуком -->
<div data-video-controller data-mute-background="false">
  <!-- ... -->
</div>

<!-- Модальное окно без controls -->
<div data-video-controller data-show-controls-modal="false">
  <!-- ... -->
</div>
```

## Требования

- Современный браузер с поддержкой ES6+
- HTML5 video элемент
- CSS с поддержкой transitions и backdrop-filter (опционально)

## Совместимость

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Отладка

### Проверка элементов

```javascript
// Проверка наличия элементов
const containers = document.querySelectorAll('[data-video-controller]');
const modals = document.querySelectorAll('.video-modal');

console.log('Video containers:', containers);
console.log('Video modals:', modals);

// Проверка контроллеров
containers.forEach(container => {
  console.log('Controller:', container._videoController);
});
```

### Логи в консоли

Модуль выводит предупреждения в консоль, если не найдены необходимые элементы:

```
VideoController: фоновое видео не найдено в контейнере
VideoController: постер не найден в контейнере
VideoController: модальное окно не найдено
VideoController: не удалось запустить фоновое видео
VideoController: не удалось запустить видео в модальном окне
```

## Миграция с предыдущей версии

### Старый код (простое видео)

```html
<div data-video-controller>
  <video>...</video>
  <div data-video-poster>...</div>
</div>
```

### Новый код (с модальным окном)

```html
<div data-video-controller data-modal-target="#video-modal">
  <video loop muted autoplay>...</video>
  <div data-video-poster>...</div>
</div>

<div id="video-modal" class="video-modal">
  <div class="video-modal-content">
    <button data-modal-close>×</button>
    <video controls>...</video>
  </div>
</div>
```

### Обновление CSS

```css
/* Добавить стили для модального окна */
.video-modal {
  /* ... */
}
.video-modal-content {
  /* ... */
}
[data-modal-close] {
  /* ... */
}
```
