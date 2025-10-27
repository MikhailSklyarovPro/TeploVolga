/**
 * Слайдер логотипов партнёров в футере
 *
 * Управляет отображением логотипов партнёров с возможностью переключения
 * между группами по 6 логотипов с плавной анимацией
 */

class FooterLogosSlider {
  constructor() {
    this.container = document.querySelector('.footer__content__partners__logos');
    this.buttonsContainer = document.querySelector('.footer__content__partners__buttons');
    this.paginationContainer = document.querySelector('.footer__content__partners__pagination');

    if (!this.container || !this.buttonsContainer || !this.paginationContainer) {
      return;
    }

    this.logos = Array.from(this.container.children);
    this.buttons = {
      prev: this.buttonsContainer.children[0],
      next: this.buttonsContainer.children[1],
    };

    this.logosPerPage = 6;
    this.currentPage = 0;
    this.totalPages = Math.ceil(this.logos.length / this.logosPerPage);
    this.isAnimating = false;
    this.animationDuration = 400;
    this.paginationDots = [];

    this.init();
  }

  init() {
    // Если логотипов 6 или меньше, скрываем кнопки и пагинацию, показываем все логотипы
    if (this.logos.length <= this.logosPerPage) {
      this.buttonsContainer.style.display = 'none';
      this.paginationContainer.style.display = 'none';
      this.logos.forEach(logo => {
        logo.style.display = 'block';
        logo.style.opacity = '1';
        logo.style.transform = 'translateX(0)';
      });
      return;
    }

    // Создаём точки пагинации
    this.createPagination();

    // Добавляем классы для управления видимостью
    this.setupLogos();

    // Добавляем обработчики событий на кнопки
    this.buttons.prev.addEventListener('click', () => this.navigate('prev'));
    this.buttons.next.addEventListener('click', () => this.navigate('next'));

    // Показываем первую страницу
    this.showPage(0, false);
  }

  createPagination() {
    // Очищаем контейнер пагинации
    this.paginationContainer.innerHTML = '';
    this.paginationDots = [];

    // Создаём точку для каждой страницы
    for (let i = 0; i < this.totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('footer__content__partners__pagination__dot');
      dot.dataset.page = i;

      // Добавляем обработчик клика
      dot.addEventListener('click', () => this.goToPage(i));

      this.paginationContainer.appendChild(dot);
      this.paginationDots.push(dot);
    }
  }

  updatePagination() {
    this.paginationDots.forEach((dot, index) => {
      if (index === this.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  goToPage(pageIndex) {
    if (this.isAnimating || pageIndex === this.currentPage) {
      return;
    }

    // Определяем направление анимации
    const direction = pageIndex > this.currentPage ? 'next' : 'prev';
    this.currentPage = pageIndex;
    this.showPage(this.currentPage, true, direction);
  }

  setupLogos() {
    this.logos.forEach((logo, index) => {
      logo.classList.add('footer-logo-item');
      logo.dataset.index = index;
      logo.style.opacity = '0';
      logo.style.transform = 'translateX(0)';
      logo.style.transition = `opacity ${this.animationDuration}ms ease, transform ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      logo.style.pointerEvents = 'none';
      logo.style.display = 'none';
    });
  }

  navigate(direction) {
    if (this.isAnimating) {
      return;
    }

    const prevPage = this.currentPage;

    if (direction === 'next') {
      this.currentPage = (this.currentPage + 1) % this.totalPages;
    } else {
      this.currentPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
    }

    this.showPage(this.currentPage, true, direction);
  }

  showPage(pageIndex, withAnimation = true, direction = 'next') {
    this.isAnimating = true;

    const startIndex = pageIndex * this.logosPerPage;
    const endIndex = Math.min(startIndex + this.logosPerPage, this.logos.length);

    // Обновляем индикатор пагинации
    this.updatePagination();

    if (withAnimation) {
      // Определяем направление анимации
      const exitTransform = direction === 'next' ? 'translateX(-30px)' : 'translateX(30px)';
      const enterTransform = direction === 'next' ? 'translateX(30px)' : 'translateX(-30px)';

      // Фаза 1: Плавно скрываем старые элементы
      this.logos.forEach((logo, index) => {
        if (index < startIndex || index >= endIndex) {
          logo.style.opacity = '0';
          logo.style.transform = exitTransform;
          logo.style.pointerEvents = 'none';
        }
      });

      // Фаза 2: После небольшой задержки убираем старые из DOM и подготавливаем новые
      setTimeout(() => {
        // Скрываем старые элементы из layout
        this.logos.forEach((logo, index) => {
          if (index < startIndex || index >= endIndex) {
            logo.style.display = 'none';
          }
        });

        // Подготавливаем новые элементы (невидимые, смещенные)
        this.logos.forEach((logo, index) => {
          if (index >= startIndex && index < endIndex) {
            logo.style.display = 'block';
            logo.style.opacity = '0';
            logo.style.transform = enterTransform;
            logo.style.pointerEvents = 'none';
          }
        });

        // Фаза 3: Плавно показываем новые элементы
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.logos.forEach((logo, index) => {
              if (index >= startIndex && index < endIndex) {
                logo.style.opacity = '1';
                logo.style.transform = 'translateX(0)';
                logo.style.pointerEvents = 'auto';
              }
            });

            // Разблокируем после завершения анимации
            setTimeout(() => {
              this.isAnimating = false;
            }, this.animationDuration);
          });
        });
      }, this.animationDuration * 0.3); // Ждем 30% от времени анимации перед сменой элементов
    } else {
      // Без анимации (для первой загрузки)
      this.logos.forEach((logo, index) => {
        if (index >= startIndex && index < endIndex) {
          logo.style.display = 'block';
          logo.style.opacity = '1';
          logo.style.transform = 'translateX(0)';
          logo.style.pointerEvents = 'auto';
        } else {
          logo.style.display = 'none';
          logo.style.opacity = '0';
          logo.style.transform = 'translateX(0)';
          logo.style.pointerEvents = 'none';
        }
      });

      this.isAnimating = false;
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new FooterLogosSlider();
});
