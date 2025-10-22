/**
 * Универсальный карусель для цитат с бесконечным переключением
 * Поддерживает плавные переходы и автоматическое переключение
 */
class QuotesCarousel {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn(`Контейнер с селектором "${containerSelector}" не найден`);
      return;
    }

    // Настройки по умолчанию
    this.options = {
      itemSelector: '[data-quote-item]',
      buttonSelector: '[data-quote-button]',
      activeClass: 'active',
      transitionDuration: 300,
      autoPlay: false,
      autoPlayInterval: 5000,
      ...options,
    };

    this.items = this.container.querySelectorAll(this.options.itemSelector);
    this.buttons = this.container.querySelectorAll(this.options.buttonSelector);
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoPlayTimer = null;

    this.init();
  }

  init() {
    if (this.items.length === 0) {
      console.warn('Элементы цитат не найдены');
      return;
    }

    this.setupInitialState();
    this.bindEvents();
    this.startAutoPlay();
  }

  setupInitialState() {
    // Скрываем все элементы кроме первого
    this.items.forEach((item, index) => {
      item.style.display = index === 0 ? 'flex' : 'none';
      item.classList.toggle(this.options.activeClass, index === 0);
    });

    // Добавляем атрибуты для навигации
    this.buttons.forEach((button, index) => {
      button.setAttribute('data-direction', index === 0 ? 'prev' : 'next');
    });
  }

  bindEvents() {
    this.buttons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const direction = button.getAttribute('data-direction');
        this.navigate(direction);
      });
    });

    // Поддержка клавиатуры
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.navigate('prev');
      } else if (e.key === 'ArrowRight') {
        this.navigate('next');
      }
    });

    // Пауза автоплея при наведении
    this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  navigate(direction) {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    this.pauseAutoPlay();

    const currentItem = this.items[this.currentIndex];
    const nextIndex = this.getNextIndex(direction);
    const nextItem = this.items[nextIndex];

    // Плавное скрытие текущего элемента
    currentItem.style.opacity = '0';
    currentItem.classList.remove(this.options.activeClass);

    setTimeout(() => {
      // Скрываем текущий элемент
      currentItem.style.display = 'none';

      // Показываем следующий элемент
      nextItem.style.display = 'flex';
      nextItem.style.opacity = '0';
      nextItem.classList.add(this.options.activeClass);

      // Плавное появление следующего элемента
      requestAnimationFrame(() => {
        nextItem.style.transition = `opacity ${this.options.transitionDuration}ms ease-in-out`;
        nextItem.style.opacity = '1';
      });

      this.currentIndex = nextIndex;

      setTimeout(() => {
        this.isTransitioning = false;
        this.startAutoPlay();
      }, this.options.transitionDuration);
    }, this.options.transitionDuration / 2);
  }

  getNextIndex(direction) {
    if (direction === 'next') {
      return (this.currentIndex + 1) % this.items.length;
    } else {
      return this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    }
  }

  startAutoPlay() {
    if (!this.options.autoPlay || this.autoPlayTimer) {
      return;
    }

    this.autoPlayTimer = setInterval(() => {
      this.navigate('next');
    }, this.options.autoPlayInterval);
  }

  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  // Публичные методы для внешнего управления
  goToSlide(index) {
    if (index >= 0 && index < this.items.length && !this.isTransitioning) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      const steps = Math.abs(index - this.currentIndex);

      for (let i = 0; i < steps; i++) {
        setTimeout(() => this.navigate(direction), i * 100);
      }
    }
  }

  destroy() {
    this.pauseAutoPlay();
    this.buttons.forEach(button => {
      button.removeEventListener('click', this.navigate);
    });
  }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация карусели для блока цитат
  const quotesCarousel = new QuotesCarousel('.home__quotes', {
    itemSelector: '.home__quote',
    buttonSelector: '.home__quote-container__buttons button',
    autoPlay: true,
    autoPlayInterval: 6000,
  });

  // Экспорт для глобального доступа
  window.quotesCarousel = quotesCarousel;
});

// Экспорт класса для использования в других модулях
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // eslint-disable-next-line no-undef
  module.exports = QuotesCarousel;
}
