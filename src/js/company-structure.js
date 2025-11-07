/**
 * Модуль управления таблицами структуры компании (Company Structure Tables)
 *
 * Этот модуль реализует переключение между таблицами филиалов и обособленных подразделений
 * с плавной анимацией fade-in/fade-out и сдвигом.
 */

(() => {
  'use strict';

  /**
   * Класс для управления переключением таблиц структуры компании
   */
  class CompanyStructureTables {
    /**
     * Создает экземпляр CompanyStructureTables
     * @param {Object} options - Опции конфигурации
     * @param {string} options.containerSelector - Селектор для контейнера таблиц (по умолчанию '.company-structure__table-container')
     * @param {string} options.tableSelector - Селектор для таблиц (по умолчанию '.company-structure__table')
     * @param {string} options.activeTableClass - Класс для активной таблицы (по умолчанию 'company-structure__table--active')
     * @param {string} options.navButtonSelector - Селектор для кнопок навигации (по умолчанию '.company-structure__nav-button')
     * @param {string} options.activeNavButtonClass - Класс для активной кнопки навигации (по умолчанию 'company-structure__nav-button--active')
     * @param {string} options.tableDataAttribute - Атрибут для связи таблицы с кнопкой (по умолчанию 'data-table-content')
     * @param {string} options.buttonDataAttribute - Атрибут для связи кнопки с таблицей (по умолчанию 'data-table')
     * @param {number} options.animationDuration - Длительность анимации в мс (по умолчанию 400)
     */
    constructor(options = {}) {
      // Конфигурация по умолчанию
      this.config = {
        containerSelector: '.company-structure__table-container',
        tableSelector: '.company-structure__table',
        activeTableClass: 'company-structure__table--active',
        navButtonSelector: '.company-structure__nav-button',
        activeNavButtonClass: 'company-structure__nav-button--active',
        tableDataAttribute: 'data-table-content',
        buttonDataAttribute: 'data-table',
        animationDuration: 400,
        ...options,
      };

      // DOM элементы
      this.container = null;
      this.tables = [];
      this.navButtons = [];
      this.currentActiveTable = null;
      this.currentActiveButton = null;

      // Флаг для предотвращения множественных переключений во время анимации
      this.isAnimating = false;

      // Инициализация
      this.init();
    }

    /**
     * Инициализация модуля
     */
    init() {
      // Проверка наличия необходимых элементов
      if (!this.checkElements()) {
        console.warn('CompanyStructureTables: Не найдены необходимые элементы DOM');
        return;
      }

      // Находим активную таблицу и кнопку
      this.findActiveElements();

      // Привязываем обработчики событий
      this.attachEventListeners();
    }

    /**
     * Проверка наличия необходимых элементов DOM
     * @returns {boolean} - true если все элементы найдены
     */
    checkElements() {
      this.container = document.querySelector(this.config.containerSelector);
      if (!this.container) {
        return false;
      }

      this.tables = Array.from(this.container.querySelectorAll(this.config.tableSelector));
      if (this.tables.length === 0) {
        return false;
      }

      this.navButtons = Array.from(document.querySelectorAll(this.config.navButtonSelector));
      if (this.navButtons.length === 0) {
        return false;
      }

      return true;
    }

    /**
     * Поиск активных элементов (таблицы и кнопки)
     */
    findActiveElements() {
      // Находим активную таблицу
      this.currentActiveTable = this.tables.find(table => table.classList.contains(this.config.activeTableClass));

      // Находим активную кнопку
      this.currentActiveButton = this.navButtons.find(button => button.classList.contains(this.config.activeNavButtonClass));

      // Если активная таблица не найдена, активируем первую
      if (!this.currentActiveTable && this.tables.length > 0) {
        this.currentActiveTable = this.tables[0];
        this.currentActiveTable.classList.add(this.config.activeTableClass);
      }

      // Если активная кнопка не найдена, активируем первую
      if (!this.currentActiveButton && this.navButtons.length > 0) {
        this.currentActiveButton = this.navButtons[0];
        this.currentActiveButton.classList.add(this.config.activeNavButtonClass);
      }
    }

    /**
     * Привязка обработчиков событий
     */
    attachEventListeners() {
      this.navButtons.forEach(button => {
        button.addEventListener('click', e => {
          e.preventDefault();
          this.handleButtonClick(button);
        });
      });
    }

    /**
     * Обработчик клика по кнопке навигации
     * @param {HTMLElement} button - Нажатая кнопка
     */
    handleButtonClick(button) {
      // Предотвращаем переключение во время анимации
      if (this.isAnimating) {
        return;
      }

      // Предотвращаем повторное переключение на ту же таблицу
      if (button === this.currentActiveButton) {
        return;
      }

      // Получаем идентификатор таблицы из атрибута кнопки
      const tableId = button.getAttribute(this.config.buttonDataAttribute);
      if (!tableId) {
        console.warn('CompanyStructureTables: У кнопки отсутствует атрибут data-table');
        return;
      }

      // Находим соответствующую таблицу
      const targetTable = this.tables.find(table => table.getAttribute(this.config.tableDataAttribute) === tableId);

      if (!targetTable) {
        console.warn(`CompanyStructureTables: Таблица с id "${tableId}" не найдена`);
        return;
      }

      // Переключаем таблицы
      this.switchTable(targetTable, button);
    }

    /**
     * Переключение таблиц с анимацией
     * @param {HTMLElement} targetTable - Целевая таблица для отображения
     * @param {HTMLElement} targetButton - Целевая кнопка для активации
     */
    switchTable(targetTable, targetButton) {
      this.isAnimating = true;

      // Удаляем активный класс с текущей таблицы
      if (this.currentActiveTable) {
        this.currentActiveTable.classList.remove(this.config.activeTableClass);
      }

      // Удаляем активный класс с текущей кнопки
      if (this.currentActiveButton) {
        this.currentActiveButton.classList.remove(this.config.activeNavButtonClass);
      }

      // Добавляем активный класс к целевой кнопке
      targetButton.classList.add(this.config.activeNavButtonClass);

      // Запускаем анимацию появления новой таблицы
      // Используем requestAnimationFrame для плавности
      requestAnimationFrame(() => {
        targetTable.classList.add(this.config.activeTableClass);
      });

      // Обновляем текущие активные элементы
      this.currentActiveTable = targetTable;
      this.currentActiveButton = targetButton;

      // Сбрасываем флаг анимации после завершения
      setTimeout(() => {
        this.isAnimating = false;
      }, this.config.animationDuration);
    }

    /**
     * Публичный метод для программного переключения таблицы
     * @param {string} tableId - Идентификатор таблицы для переключения
     */
    switchToTable(tableId) {
      const targetButton = this.navButtons.find(button => button.getAttribute(this.config.buttonDataAttribute) === tableId);

      if (targetButton) {
        this.handleButtonClick(targetButton);
      } else {
        console.warn(`CompanyStructureTables: Кнопка с data-table="${tableId}" не найдена`);
      }
    }

    /**
     * Публичный метод для получения текущей активной таблицы
     * @returns {HTMLElement|null} - Активная таблица или null
     */
    getActiveTable() {
      return this.currentActiveTable;
    }

    /**
     * Публичный метод для получения текущей активной кнопки
     * @returns {HTMLElement|null} - Активная кнопка или null
     */
    getActiveButton() {
      return this.currentActiveButton;
    }
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CompanyStructureTables();
    });
  } else {
    new CompanyStructureTables();
  }
})();
