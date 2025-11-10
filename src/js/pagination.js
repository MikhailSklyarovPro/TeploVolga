/**
 * Универсальный класс для создания пагинации
 * Поддерживает автоматическую инициализацию через data-атрибуты
 * и программное создание экземпляров
 */
class Pagination {
  /**
   * @param {HTMLElement|string} container - Контейнер для пагинации или селектор
   * @param {Object} options - Настройки пагинации
   * @param {number} options.totalItems - Общее количество элементов
   * @param {number} options.itemsPerPage - Количество элементов на странице
   * @param {number} options.currentPage - Текущая страница (начиная с 1)
   * @param {Function} options.onPageChange - Callback при смене страницы
   * @param {number} options.maxVisiblePages - Максимальное количество видимых страниц
   * @param {string} options.buttonClass - CSS класс для кнопок
   * @param {string} options.activeClass - CSS класс для активной кнопки
   * @param {boolean} options.showArrows - Показывать ли стрелки навигации
   */
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;

    if (!this.container) {
      console.error('Pagination: контейнер не найден');
      return;
    }

    this.options = {
      totalItems: options.totalItems || 0,
      itemsPerPage: options.itemsPerPage || 9,
      currentPage: options.currentPage || 1,
      onPageChange: options.onPageChange || (() => {}),
      maxVisiblePages: options.maxVisiblePages || 5,
      buttonClass: options.buttonClass || 'pagination__button',
      activeClass: options.activeClass || 'pagination__button--active',
      showArrows: options.showArrows !== false,
      ...options,
    };

    this.totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    this.init();
  }

  /**
   * Инициализация пагинации
   */
  init() {
    this.render();
    this.attachEvents();
  }

  /**
   * Обновление данных пагинации
   * @param {Object} data - Новые данные
   */
  update(data) {
    if (data.totalItems !== undefined) {
      this.options.totalItems = data.totalItems;
      this.totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    }
    if (data.itemsPerPage !== undefined) {
      this.options.itemsPerPage = data.itemsPerPage;
      this.totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    }
    if (data.currentPage !== undefined) {
      this.options.currentPage = Math.max(1, Math.min(data.currentPage, this.totalPages));
    }
    this.render();
  }

  /**
   * Отрисовка пагинации
   */
  render() {
    if (this.totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    const pages = this.getVisiblePages();
    const html = this.buildHTML(pages);
    this.container.innerHTML = html;
  }

  /**
   * Получение списка видимых страниц
   * @returns {Array<number>} Массив номеров страниц
   */
  getVisiblePages() {
    const { currentPage, maxVisiblePages } = this.options;
    const pages = [];

    if (this.totalPages <= maxVisiblePages) {
      // Если страниц меньше максимума, показываем все
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Вычисляем диапазон страниц для отображения
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Корректируем начало, если достигли конца
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  /**
   * Построение HTML разметки
   * @param {Array<number>} pages - Массив номеров страниц
   * @returns {string} HTML строка
   */
  buildHTML(pages) {
    const { currentPage, buttonClass, activeClass, showArrows } = this.options;
    const html = [];

    // Стрелка "Назад"
    if (showArrows) {
      html.push(`
        <button
          class="${buttonClass} ${buttonClass}--arrow"
          data-page="${currentPage - 1}"
          ${currentPage === 1 ? 'disabled' : ''}
          aria-label="Предыдущая страница"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="27" viewBox="0 0 13 27" fill="none">
            <path d="M3.24323 10.7957C2.00483 12.0563 2.00483 14.1781 3.24334 15.4389L12.3437 24.7028L10.8391 26.2346L1.73866 16.9706C1.64706 16.8774 1.5483 16.7768 1.44395 16.6706C-0.483438 14.7086 -0.484116 11.5268 1.44327 9.56477L10.8392 0L12.3438 1.53161L3.24323 10.7957Z" fill="#717171"/>
          </svg>
        </button>
      `);
    }

    // Номера страниц
    pages.forEach(page => {
      const isActive = page === currentPage;
      html.push(`
        <button
          class="${buttonClass} ${isActive ? activeClass : ''}"
          data-page="${page}"
          ${isActive ? 'aria-current="page"' : ''}
        >
          ${page}
        </button>
      `);
    });

    // Стрелка "Вперед"
    if (showArrows) {
      html.push(`
        <button
          class="${buttonClass} ${buttonClass}--arrow"
          data-page="${currentPage + 1}"
          ${currentPage === this.totalPages ? 'disabled' : ''}
          aria-label="Следующая страница"
        >
         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="27" viewBox="0 0 13 27" fill="none">
            <path d="M9.10052 10.7957C10.3389 12.0563 10.3389 14.1781 9.10041 15.4389L1.5093e-06 24.7028L1.50468 26.2346L10.6051 16.9706C10.6967 16.8774 10.7954 16.7768 10.8998 16.6706C12.8272 14.7086 12.8279 11.5268 10.9005 9.56477L1.50457 0L0 1.53161L9.10052 10.7957Z" fill="#717171"/>
          </svg>
        </button>
      `);
    }

    return html.join('');
  }

  /**
   * Привязка событий
   */
  attachEvents() {
    this.container.addEventListener('click', e => {
      const button = e.target.closest(`.${this.options.buttonClass}`);
      if (!button || button.disabled) {
        return;
      }

      const page = parseInt(button.dataset.page, 10);
      if (page && page !== this.options.currentPage && page >= 1 && page <= this.totalPages) {
        this.goToPage(page);
      }
    });
  }

  /**
   * Переход на указанную страницу
   * @param {number} page - Номер страницы
   */
  goToPage(page) {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.options.currentPage = page;
    this.render();
    this.options.onPageChange(page, this.getPageData());
  }

  /**
   * Получение данных текущей страницы
   * @returns {Object} Объект с данными страницы
   */
  getPageData() {
    const { currentPage, itemsPerPage, totalItems } = this.options;
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages: this.totalPages,
      itemsPerPage,
      totalItems,
      start: start + 1,
      end,
    };
  }

  /**
   * Уничтожение экземпляра
   */
  destroy() {
    this.container.innerHTML = '';
    this.container = null;
  }
}

/**
 * Автоматическая инициализация пагинации через data-атрибуты
 */
function initPaginationFromAttributes() {
  const containers = document.querySelectorAll('[data-pagination]');

  containers.forEach(container => {
    // Если пагинация уже инициализирована, пропускаем
    if (container.paginationInstance) {
      return;
    }

    const totalItems = parseInt(container.dataset.totalItems, 10) || 0;
    const itemsPerPage = parseInt(container.dataset.itemsPerPage, 10) || 9;
    const currentPage = parseInt(container.dataset.currentPage, 10) || 1;

    // Создаем экземпляр и сохраняем в элементе
    const pagination = new Pagination(container, {
      totalItems,
      itemsPerPage,
      currentPage,
      onPageChange: (page, data) => {
        // Можно добавить кастомную логику через data-атрибут
        const event = new CustomEvent('pagination:change', {
          detail: { page, data },
        });
        container.dispatchEvent(event);
      },
    });

    container.paginationInstance = pagination;
  });
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaginationFromAttributes);
} else {
  initPaginationFromAttributes();
}

// Экспорт для использования в других модулях
export { initPaginationFromAttributes, Pagination };
