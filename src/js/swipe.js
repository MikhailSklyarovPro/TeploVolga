/**
 * Модуль для управления свайпом карточек новостей
 * Обеспечивает навигацию по карточкам с помощью кнопок и адаптивность при изменении размера окна
 */

class NewsSwipeController {
  constructor() {
    this.container = document.querySelector('[data-swipe]');
    this.prevButton = document.querySelector('[data-swipe-prev]');
    this.nextButton = document.querySelector('[data-swipe-next]');
    this.cards = this.container?.querySelectorAll('.home__news-wrapper-card');

    if (!this.container || !this.prevButton || !this.nextButton || !this.cards.length) {
      console.warn('NewsSwipeController: Не найдены необходимые элементы');
      return;
    }

    this.currentIndex = 0;
    this.isTransitioning = false;
    this.resizeTimeout = null;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollListener();
    this.updateButtonStates();
    this.setupResizeHandler();
  }

  setupEventListeners() {
    this.prevButton.addEventListener('click', () => this.scrollToPrevious());
    this.nextButton.addEventListener('click', () => this.scrollToNext());
  }

  setupScrollListener() {
    this.container.addEventListener('scroll', () => {
      // Дебаунс для оптимизации производительности
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 50);
    });
  }

  handleScroll() {
    // Обновляем индекс на основе реальной позиции скролла
    this.updateCurrentIndexFromScroll();
    this.updateButtonStates();
  }

  updateCurrentIndexFromScroll() {
    const scrollLeft = this.container.scrollLeft;
    const cardWidth = this.getCardWidth();
    const gap = this.getGap();
    const cardStep = cardWidth + gap;

    // Вычисляем индекс на основе позиции скролла
    const newIndex = Math.round(scrollLeft / cardStep);
    this.currentIndex = Math.max(0, Math.min(newIndex, this.cards.length - 1));
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      // Дебаунс для оптимизации производительности
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 100);
    });
  }

  handleResize() {
    // Обновляем индекс на основе текущей позиции скролла
    this.updateCurrentIndexFromScroll();
    // Перерасчет позиции при изменении размера окна
    this.scrollToCard(this.currentIndex, false);
    this.updateButtonStates();
  }

  scrollToPrevious() {
    if (!this.isAtStart() && !this.isTransitioning) {
      this.scrollToCard(this.currentIndex - 1);
    }
  }

  scrollToNext() {
    if (!this.isAtEnd() && !this.isTransitioning) {
      this.scrollToCard(this.currentIndex + 1);
    }
  }

  scrollToCard(index, smooth = true) {
    if (this.isTransitioning || index < 0 || index >= this.cards.length) {
      return;
    }

    this.isTransitioning = true;
    this.currentIndex = index;

    // Получаем ширину карточки и gap
    const cardWidth = this.getCardWidth();
    const gap = this.getGap();
    const scrollPosition = index * (cardWidth + gap);

    // Устанавливаем поведение скролла
    this.container.style.scrollBehavior = smooth ? 'smooth' : 'auto';

    // Выполняем скролл
    this.container.scrollTo({
      left: scrollPosition,
      behavior: smooth ? 'smooth' : 'auto',
    });

    // Сбрасываем флаг после завершения анимации
    setTimeout(
      () => {
        this.isTransitioning = false;
        this.updateButtonStates();
      },
      smooth ? 300 : 0
    );
  }

  getCardWidth() {
    if (!this.cards[0]) {
      return 0;
    }

    const cardRect = this.cards[0].getBoundingClientRect();
    return cardRect.width;
  }

  getGap() {
    // Получаем gap из computed styles
    const containerStyles = window.getComputedStyle(this.container);
    const gapValue = containerStyles.gap;

    // Парсим значение gap (может быть в px, rem, etc.)
    const gapMatch = gapValue.match(/(\d+(?:\.\d+)?)/);
    if (gapMatch) {
      const gapNumber = parseFloat(gapMatch[1]);
      // Если значение в rem, конвертируем в px
      if (gapValue.includes('rem')) {
        return gapNumber * parseFloat(window.getComputedStyle(document.documentElement).fontSize);
      }
      return gapNumber;
    }

    return 20; // Значение по умолчанию из CSS
  }

  updateButtonStates() {
    const isAtStart = this.isAtStart();
    const isAtEnd = this.isAtEnd();

    // Блокируем кнопку "назад" если мы в начале
    if (isAtStart) {
      this.prevButton.disabled = true;
      this.prevButton.style.opacity = '0.5';
      this.prevButton.querySelector('path').style.fill = '#9CA3AF';
    } else {
      this.prevButton.disabled = false;
      this.prevButton.style.opacity = '1';
      this.prevButton.querySelector('path').style.fill = '#FD5D39';
    }

    // Блокируем кнопку "вперед" если мы в конце
    if (isAtEnd) {
      this.nextButton.disabled = true;
      this.nextButton.style.opacity = '0.5';
      this.nextButton.querySelector('path').style.fill = '#9CA3AF';
    } else {
      this.nextButton.disabled = false;
      this.nextButton.style.opacity = '1';
      this.nextButton.querySelector('path').style.fill = '#FD5D39';
    }
  }

  isAtStart() {
    return this.container.scrollLeft <= 0;
  }

  isAtEnd() {
    const containerWidth = this.container.clientWidth;
    const scrollWidth = this.container.scrollWidth;
    const scrollLeft = this.container.scrollLeft;

    // Проверяем, достигли ли мы конца с небольшой погрешностью
    return scrollLeft >= scrollWidth - containerWidth - 1;
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new NewsSwipeController();
});
