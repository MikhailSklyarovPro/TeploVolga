/**
 * Универсальный класс карусели с бесконечным переключением
 * Поддерживает плавные переходы и автоматическое переключение
 * Поддерживает различные типы анимаций: fade, slide
 */
class Carousel {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn(`Контейнер с селектором "${containerSelector}" не найден`);
      return;
    }

    // Настройки по умолчанию
    this.options = {
      itemSelector: '[data-carousel-item]',
      buttonPrevSelector: '[data-carousel-prev]',
      buttonNextSelector: '[data-carousel-next]',
      slideTargetSelector: '[data-carousel-slide-target]',
      paginationSelector: null,
      paginationDotClass: 'carousel-pagination__dot',
      activeClass: 'active',
      transitionDuration: 300,
      autoPlay: false,
      autoPlayInterval: 5000,
      animationType: 'fade', // 'fade' или 'slide'
      ...options,
    };

    this.items = this.container.querySelectorAll(this.options.itemSelector);
    this.buttonPrev = this.container.querySelector(this.options.buttonPrevSelector);
    this.buttonNext = this.container.querySelector(this.options.buttonNextSelector);
    this.paginationContainer = this.options.paginationSelector
      ? this.container.querySelector(this.options.paginationSelector) ||
        document.querySelector(this.options.paginationSelector)
      : null;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoPlayTimer = null;

    this.init();
  }

  init() {
    if (this.items.length === 0) {
      console.warn('Элементы карусели не найдены');
      return;
    }

    this.setupInitialState();
    this.setupPagination();
    this.bindEvents();

    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }

  setupInitialState() {
    // Показываем только первый элемент
    this.items.forEach((item, index) => {
      if (index === 0) {
        item.style.display = 'flex';
        item.classList.add(this.options.activeClass);

        // Для slide анимации применяем transform и opacity к целевому элементу
        if (this.options.animationType === 'slide') {
          const slideTarget = item.querySelector(this.options.slideTargetSelector);
          if (slideTarget) {
            slideTarget.style.transform = 'translateX(0)';
            slideTarget.style.opacity = '1';
          }
        }
      } else {
        item.style.display = 'none';
        item.classList.remove(this.options.activeClass);
      }
    });
  }

  setupPagination() {
    if (!this.paginationContainer) {
      return;
    }

    // Очищаем контейнер
    this.paginationContainer.innerHTML = '';

    // Создаем точки для каждого элемента
    this.items.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = this.options.paginationDotClass;
      if (index === 0) {
        dot.classList.add(this.options.activeClass);
      }

      // Добавляем обработчик клика
      dot.addEventListener('click', () => {
        if (!this.isTransitioning) {
          this.goToSlide(index);
        }
      });

      this.paginationContainer.appendChild(dot);
    });

    this.paginationDots = this.paginationContainer.querySelectorAll(`.${this.options.paginationDotClass}`);
  }

  updatePagination() {
    if (!this.paginationDots) {
      return;
    }

    this.paginationDots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add(this.options.activeClass);
      } else {
        dot.classList.remove(this.options.activeClass);
      }
    });
  }

  bindEvents() {
    // Кнопка "Назад"
    if (this.buttonPrev) {
      this.buttonPrev.addEventListener('click', e => {
        e.preventDefault();
        this.navigate('prev');
      });
    }

    // Кнопка "Вперед"
    if (this.buttonNext) {
      this.buttonNext.addEventListener('click', e => {
        e.preventDefault();
        this.navigate('next');
      });
    }

    // Поддержка клавиатуры
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.navigate('prev');
      } else if (e.key === 'ArrowRight') {
        this.navigate('next');
      }
    });

    // Пауза автоплея при наведении
    if (this.options.autoPlay) {
      this.container.addEventListener('mouseenter', () => {
        this.pauseAutoPlay();
      });

      this.container.addEventListener('mouseleave', () => {
        this.startAutoPlay();
      });
    }
  }

  navigate(direction) {
    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;

    const currentItem = this.items[this.currentIndex];
    const nextIndex = this.getNextIndex(direction);
    const nextItem = this.items[nextIndex];

    // Выбираем тип анимации
    if (this.options.animationType === 'slide') {
      this.animateSlide(currentItem, nextItem, direction);
    } else {
      this.animateFade(currentItem, nextItem);
    }

    this.currentIndex = nextIndex;
  }

  animateFade(currentItem, nextItem) {
    // Убираем класс active - описание плавно исчезнет через CSS
    currentItem.classList.remove(this.options.activeClass);

    // Ждем полного завершения анимации скрытия
    setTimeout(() => {
      // Скрываем текущий элемент
      currentItem.style.display = 'none';

      // Показываем следующий элемент
      nextItem.style.display = 'flex';

      // Небольшая задержка для стабилизации DOM перед добавлением active класса
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Добавляем класс active - описание плавно появится через CSS
          nextItem.classList.add(this.options.activeClass);
        });
      });

      // Ждем завершения анимации появления
      setTimeout(() => {
        // Обновляем пагинацию
        this.updatePagination();

        this.isTransitioning = false;
      }, this.options.transitionDuration);
    }, this.options.transitionDuration);
  }

  animateSlide(currentItem, nextItem, direction) {
    // Определяем направление движения
    const slideOutDirection = direction === 'next' ? '-100%' : '100%';
    const slideInFrom = direction === 'next' ? '100%' : '-100%';

    // Получаем целевые элементы для анимации (если указаны)
    const currentSlideTarget = currentItem.querySelector(this.options.slideTargetSelector);
    const nextSlideTarget = nextItem.querySelector(this.options.slideTargetSelector);

    // Если есть slideTarget, анимируем его и родительский opacity
    // Если нет slideTarget, анимируем весь item
    if (currentSlideTarget && nextSlideTarget) {
      // Анимация ухода текущего элемента
      currentSlideTarget.style.transform = `translateX(${slideOutDirection})`;
      currentSlideTarget.style.opacity = '0';
      currentItem.classList.remove(this.options.activeClass);

      // Показываем следующий элемент с начальной позиции
      nextItem.style.display = 'flex';
      nextItem.style.opacity = '1';
      nextSlideTarget.style.transform = `translateX(${slideInFrom})`;
      nextSlideTarget.style.opacity = '0';
      nextItem.classList.add(this.options.activeClass);

      // Небольшая задержка для стабилизации DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Анимация появления следующего элемента
          nextSlideTarget.style.transform = 'translateX(0)';
          nextSlideTarget.style.opacity = '1';
        });
      });

      // Ждем завершения анимации
      setTimeout(() => {
        // Скрываем и сбрасываем предыдущий элемент
        currentItem.style.display = 'none';
        currentSlideTarget.style.transform = 'translateX(0)';
        currentSlideTarget.style.opacity = '1';

        // Обновляем пагинацию
        this.updatePagination();

        this.isTransitioning = false;
      }, this.options.transitionDuration);
    } else {
      // Fallback: анимируем весь item если slideTarget не указан
      currentItem.style.transform = `translateX(${slideOutDirection})`;
      currentItem.style.opacity = '0';
      currentItem.classList.remove(this.options.activeClass);

      nextItem.style.display = 'flex';
      nextItem.style.transform = `translateX(${slideInFrom})`;
      nextItem.style.opacity = '0';
      nextItem.classList.add(this.options.activeClass);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          nextItem.style.transform = 'translateX(0)';
          nextItem.style.opacity = '1';
        });
      });

      setTimeout(() => {
        currentItem.style.display = 'none';
        currentItem.style.transform = 'translateX(0)';

        this.updatePagination();

        this.isTransitioning = false;
      }, this.options.transitionDuration);
    }
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
    if (index >= 0 && index < this.items.length && !this.isTransitioning && index !== this.currentIndex) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.navigate(direction);

      // Если разница больше 1, продолжаем навигацию
      const remaining = Math.abs(index - this.currentIndex) - 1;
      if (remaining > 0) {
        setTimeout(() => this.goToSlide(index), this.options.transitionDuration * 2 + 100);
      }
    }
  }

  destroy() {
    this.pauseAutoPlay();
    if (this.buttonPrev) {
      this.buttonPrev.removeEventListener('click', this.navigate);
    }
    if (this.buttonNext) {
      this.buttonNext.removeEventListener('click', this.navigate);
    }
  }
}

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  // Находим все контейнеры с атрибутом data-carousel
  const carouselContainers = document.querySelectorAll('[data-carousel]');

  carouselContainers.forEach(container => {
    const animationType = container.getAttribute('data-carousel-animation') || 'fade';
    const autoPlay = container.hasAttribute('data-carousel-autoplay');
    const autoPlayInterval = parseInt(container.getAttribute('data-carousel-interval'), 10) || 5000;
    const transitionDuration = parseInt(container.getAttribute('data-carousel-duration'), 10) || 300;
    const paginationSelector = container.getAttribute('data-carousel-pagination') || null;
    const paginationDotClass =
      container.getAttribute('data-carousel-pagination-dot-class') || 'home__main-screen__controls__pagination__dot';

    const carousel = new Carousel(`#${container.id}`, {
      itemSelector: '[data-carousel-item]',
      buttonPrevSelector: '[data-carousel-prev]',
      buttonNextSelector: '[data-carousel-next]',
      slideTargetSelector: '[data-carousel-slide-target]',
      paginationSelector: paginationSelector,
      paginationDotClass: paginationDotClass,
      animationType: animationType,
      autoPlay: autoPlay,
      autoPlayInterval: autoPlayInterval,
      transitionDuration: transitionDuration,
    });

    // Сохраняем экземпляр карусели в DOM элементе для доступа извне
    container.carouselInstance = carousel;
  });
});

// Экспорт класса для использования в других модулях
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // eslint-disable-next-line no-undef
  module.exports = Carousel;
}
