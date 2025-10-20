/**
 * Модуль для навигации по контейнерам
 * Поддерживает кнопки навигации и бесконечный скролл
 */
class SwipeController {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      infinite: false,
      animationDuration: 300,
      ...options,
    };

    this.currentIndex = 0;
    this.maxIndex = 0;

    this.init();
  }

  init() {
    this.setupContainer();
    this.calculateDimensions();
    this.setupNavigationButtons();
    this.setupInfiniteScroll();
  }

  setupContainer() {
    // Проверяем атрибут для бесконечного свайпа
    this.options.infinite = this.container.hasAttribute('data-infinite-swipe');

    // Добавляем стили для плавного скролла
    this.container.style.scrollBehavior = 'smooth';
    this.container.style.overflowX = 'auto';
    this.container.style.scrollbarWidth = 'none';
    this.container.style.msOverflowStyle = 'none';

    // Скрываем скроллбар для WebKit браузеров
    const style = document.createElement('style');
    style.textContent = `
      .swipe-container::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    this.container.classList.add('swipe-container');
  }

  calculateDimensions() {
    const items = this.container.children;
    if (items.length === 0) {
      return;
    }

    // Вычисляем максимальный индекс
    this.maxIndex = Math.max(0, items.length - 1);
  }

  setupNavigationButtons() {
    // Ищем кнопки навигации
    const prevButton = this.container.querySelector('[data-swipe-prev]');
    const nextButton = this.container.querySelector('[data-swipe-next]');

    if (prevButton) {
      prevButton.addEventListener('click', () => this.swipeToIndex(this.currentIndex - 1));
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.swipeToIndex(this.currentIndex + 1));
    }
  }

  setupInfiniteScroll() {
    if (!this.options.infinite) {
      return;
    }

    // Клонируем элементы для бесконечного скролла
    const items = Array.from(this.container.children);
    const clonedItems = items.map(item => item.cloneNode(true));

    // Добавляем клоны в начало и конец
    clonedItems.forEach(item => {
      item.style.pointerEvents = 'none';
      this.container.insertBefore(item, this.container.firstChild);
    });

    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.style.pointerEvents = 'none';
      this.container.appendChild(clone);
    });
  }

  swipeToIndex(index) {
    if (this.options.infinite) {
      const items = this.container.children;
      const originalItemsCount = items.length / 3;

      // Нормализуем индекс
      index = ((index % originalItemsCount) + originalItemsCount) % originalItemsCount;

      // Простое позиционирование без учета gap
      const targetPosition = (originalItemsCount + index) * 100; // Упрощенное значение
      this.container.scrollLeft = targetPosition;

      this.currentIndex = index;
    } else {
      // Ограничиваем индекс
      index = Math.max(0, Math.min(index, this.maxIndex));

      // Простое позиционирование без учета gap
      const targetPosition = index * 100; // Упрощенное значение
      this.container.scrollLeft = targetPosition;

      this.currentIndex = index;
    }
  }

  // Публичные методы для внешнего управления
  next() {
    this.swipeToIndex(this.currentIndex + 1);
  }

  prev() {
    this.swipeToIndex(this.currentIndex - 1);
  }

  goTo(index) {
    this.swipeToIndex(index);
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  destroy() {
    // Удаляем обработчики событий кнопок
    const prevButton = this.container.querySelector('[data-swipe-prev]');
    const nextButton = this.container.querySelector('[data-swipe-next]');

    if (prevButton) {
      prevButton.removeEventListener('click', () => this.swipeToIndex(this.currentIndex - 1));
    }

    if (nextButton) {
      nextButton.removeEventListener('click', () => this.swipeToIndex(this.currentIndex + 1));
    }
  }
}

// Функция для инициализации навигации на всех контейнерах
function initSwipe() {
  const swipeContainers = document.querySelectorAll('[data-swipe]');

  swipeContainers.forEach(container => {
    const options = {
      infinite: container.hasAttribute('data-infinite-swipe'),
      animationDuration: parseInt(container.getAttribute('data-swipe-duration'), 10) || 300,
    };

    new SwipeController(container, options);
  });
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', initSwipe);

window.SwipeController = SwipeController;
window.initSwipe = initSwipe;
