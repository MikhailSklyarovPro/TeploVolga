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
    this.resizeHandler = null;
    this.resizeTimeout = null;
    this.init();
  }

  /**
   * Инициализация пагинации
   */
  init() {
    this.render();
    this.attachEvents();
    this.attachResizeHandler();
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
   * Получение списка видимых страниц с троеточием
   * Статическая логика: всегда показываем первую, последнюю и 3 промежуточные страницы
   * @returns {Array<number|string>} Массив номеров страниц и троеточий
   */
  getVisiblePages() {
    const { currentPage } = this.options;
    const pages = [];

    // Если страниц 5 или меньше, показываем все
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Всегда показываем первую страницу
    pages.push(1);

    // Определяем, какие страницы показывать между первой и последней
    if (currentPage <= 2) {
      // Страница 1-2: 1, 2, троеточие, 9, 10
      pages.push(2);
      pages.push('ellipsis-end');
      pages.push(this.totalPages - 1);
    } else if (currentPage === 3) {
      // Страница 3: 1, 2, 3, троеточие, 10
      pages.push(2);
      pages.push(3);
      pages.push('ellipsis-end');
    } else if (currentPage >= this.totalPages - 2) {
      // Страница 8-10: 1, троеточие, 8, 9, 10
      pages.push('ellipsis-start');
      pages.push(this.totalPages - 2);
      pages.push(this.totalPages - 1);
    } else {
      // Страница 4-8: 1, троеточие, текущая, троеточие, 10
      pages.push('ellipsis-start');
      pages.push(currentPage);
      pages.push('ellipsis-end');
    }

    // Всегда показываем последнюю страницу
    pages.push(this.totalPages);

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
      // Обработка троеточия
      if (page === 'ellipsis-start' || page === 'ellipsis-end') {
        html.push(`
          <span class="${buttonClass} ${buttonClass}--ellipsis" aria-hidden="true">
            ...
          </span>
        `);
        return;
      }

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
   * Привязка обработчика изменения размера окна
   */
  attachResizeHandler() {
    // Используем debounce для оптимизации
    this.resizeHandler = () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        this.render();
      }, 150);
    };

    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * Уничтожение экземпляра
   */
  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
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
