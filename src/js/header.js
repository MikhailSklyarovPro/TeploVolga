/**
 * Модуль управления шапкой сайта (Header Navigation)
 *
 * Этот модуль реализует интерактивное поведение навигационного меню в шапке сайта.
 * При наведении на пункты главного меню отображается соответствующее подменю.
 */

(() => {
  'use strict';

  /**
   * Класс для управления навигацией в шапке сайта
   */
  class HeaderNavigation {
    /**
     * Создает экземпляр HeaderNavigation
     * @param {Object} options - Опции конфигурации
     * @param {string} options.headerSelector - Селектор для шапки (по умолчанию '.header')
     * @param {string} options.mainMenuSelector - Селектор для главного меню (по умолчанию '.header__main-menu nav')
     * @param {string} options.subMenuSelector - Селектор для контейнера подменю (по умолчанию '.header__sub-menu')
     * @param {string} options.menuItemSelector - Селектор для пунктов меню с id (по умолчанию '[id]')
     * @param {string} options.subMenuAttribute - Атрибут для связи подменю (по умолчанию 'data-sub-menu')
     * @param {string} options.activeClass - Класс для активного состояния (по умолчанию 'header__sub-menu--visible')
     * @param {number} options.hideDelay - Задержка перед скрытием подменю в мс (по умолчанию 200)
     */
    constructor(options = {}) {
      // Конфигурация по умолчанию
      this.config = {
        headerSelector: '.header',
        mainMenuSelector: '.header__main-menu nav',
        subMenuSelector: '.header__sub-menu',
        menuItemSelector: '[id]',
        subMenuAttribute: 'data-sub-menu',
        activeClass: 'header__sub-menu--visible',
        hideDelay: 200,
        ...options,
      };

      // DOM элементы
      this.header = null;
      this.mainMenu = null;
      this.subMenuContainer = null;
      this.menuItems = [];
      this.subMenus = [];
      this.arrowElement = null;
      this.checkmarkElement = null;

      // Таймер для задержки скрытия
      this.hideTimer = null;

      // Текущее активное подменю
      this.currentActiveSubMenu = null;

      // Текущий активный пункт меню
      this.currentActiveMenuItem = null;

      // Модальное меню
      this.modalMenu = null;
      this.burgerButton = null;
      this.modalCloseButton = null;

      // Инициализация
      this.init();
    }

    /**
     * Инициализация модуля
     */
    init() {
      // Поиск DOM элементов
      if (!this.findElements()) {
        console.warn('HeaderNavigation: Не удалось найти необходимые элементы');
        return;
      }

      // Установка начального состояния
      this.setupInitialState();

      // Привязка обработчиков событий
      this.bindEvents();

      // Инициализация модального меню
      this.initModalMenu();

      // Инициализация мобильного аккордеона
      this.initMobileAccordion();

      console.log('HeaderNavigation: Модуль успешно инициализирован');
    }

    /**
     * Поиск необходимых DOM элементов
     * @returns {boolean} - true если все элементы найдены, иначе false
     */
    findElements() {
      this.header = document.querySelector(this.config.headerSelector);
      if (!this.header) {
        console.error(`HeaderNavigation: Шапка не найдена (${this.config.headerSelector})`);
        return false;
      }

      this.mainMenu = this.header.querySelector(this.config.mainMenuSelector);
      if (!this.mainMenu) {
        console.error(`HeaderNavigation: Главное меню не найдено (${this.config.mainMenuSelector})`);
        return false;
      }

      this.subMenuContainer = this.header.querySelector(this.config.subMenuSelector);
      if (!this.subMenuContainer) {
        console.error(`HeaderNavigation: Контейнер подменю не найден (${this.config.subMenuSelector})`);
        return false;
      }

      // Получение элементов стрелки и галочки
      this.arrowElement = this.subMenuContainer.querySelector('.header__sub-menu__arrow');
      this.checkmarkElement = this.subMenuContainer.querySelector('.header__sub-menu__checkmark');

      // Получение пунктов меню с id
      this.menuItems = Array.from(this.mainMenu.querySelectorAll(this.config.menuItemSelector));

      // Получение всех подменю с data-sub-menu
      this.subMenus = Array.from(this.subMenuContainer.querySelectorAll(`[${this.config.subMenuAttribute}]`));

      if (this.menuItems.length === 0) {
        console.warn('HeaderNavigation: Пункты меню с id не найдены');
      }

      if (this.subMenus.length === 0) {
        console.warn(`HeaderNavigation: Подменю с атрибутом ${this.config.subMenuAttribute} не найдены`);
      }

      return true;
    }

    /**
     * Установка начального состояния - скрытие всех подменю
     */
    setupInitialState() {
      this.subMenus.forEach(subMenu => {
        subMenu.style.display = 'none';
      });

      // Скрытие контейнера подменю
      this.subMenuContainer.classList.remove(this.config.activeClass);
    }

    /**
     * Привязка обработчиков событий
     */
    bindEvents() {
      // Обработчики для пунктов главного меню
      this.menuItems.forEach(menuItem => {
        menuItem.addEventListener('mouseenter', this.handleMenuItemMouseEnter.bind(this));
        menuItem.addEventListener('mouseleave', this.handleMenuItemMouseLeave.bind(this));
      });

      // Обработчики для контейнера подменю
      this.subMenuContainer.addEventListener('mouseenter', this.handleSubMenuMouseEnter.bind(this));
      this.subMenuContainer.addEventListener('mouseleave', this.handleSubMenuMouseLeave.bind(this));

      // Обработчик для шапки (для закрытия при уходе мыши)
      this.header.addEventListener('mouseleave', this.handleHeaderMouseLeave.bind(this));

      // Обработчики для модального меню
      if (this.burgerButton) {
        this.burgerButton.addEventListener('click', this.openModalMenu.bind(this));
      }
    }

    /**
     * Обработчик наведения на пункт меню
     * @param {MouseEvent} event - Событие мыши
     */
    handleMenuItemMouseEnter(event) {
      // Отмена таймера скрытия, если он был запущен
      this.cancelHideTimer();

      const menuItem = event.currentTarget;
      const menuId = menuItem.id;

      if (!menuId) {
        console.warn('HeaderNavigation: Пункт меню не имеет id');
        return;
      }

      // Поиск соответствующего подменю
      this.showSubMenu(menuId);
    }

    /**
     * Обработчик ухода мыши с пункта меню
     */
    handleMenuItemMouseLeave() {
      // Запуск таймера для скрытия подменю с задержкой
      this.startHideTimer();
    }

    /**
     * Обработчик наведения на контейнер подменю
     */
    handleSubMenuMouseEnter() {
      // Отмена таймера скрытия при наведении на подменю
      this.cancelHideTimer();
    }

    /**
     * Обработчик ухода мыши с контейнера подменю
     */
    handleSubMenuMouseLeave() {
      // Запуск таймера для скрытия
      this.startHideTimer();
    }

    /**
     * Обработчик ухода мыши с шапки
     */
    handleHeaderMouseLeave() {
      // Немедленное скрытие подменю при уходе с шапки
      this.hideAllSubMenus();
    }

    /**
     * Показать подменю по id
     * @param {string} menuId - ID пункта меню
     */
    showSubMenu(menuId) {
      // Найти подменю с соответствующим data-sub-menu
      const targetSubMenu = this.subMenus.find(subMenu => subMenu.getAttribute(this.config.subMenuAttribute) === menuId);

      if (!targetSubMenu) {
        console.warn(`HeaderNavigation: Подменю с ${this.config.subMenuAttribute}="${menuId}" не найдено`);
        this.hideAllSubMenus();
        return;
      }

      // Найти пункт меню для позиционирования стрелочки
      const menuItem = this.menuItems.find(item => item.id === menuId);

      // Скрыть все подменю
      this.subMenus.forEach(subMenu => {
        if (subMenu !== targetSubMenu) {
          subMenu.style.display = 'none';
        }
      });

      // Показать целевое подменю
      targetSubMenu.style.display = 'flex';
      this.subMenuContainer.classList.add(this.config.activeClass);

      // Позиционировать стрелочку над активным пунктом меню
      if (menuItem) {
        this.positionArrow(menuItem);
        this.setActiveMenuItem(menuItem);
      }

      // Сохранить ссылку на текущее активное подменю
      this.currentActiveSubMenu = targetSubMenu;
    }

    /**
     * Позиционировать стрелочку над активным пунктом меню
     * @param {HTMLElement} menuItem - Активный пункт меню
     */
    positionArrow(menuItem) {
      const menuItemRect = menuItem.getBoundingClientRect();
      const subMenuRect = this.subMenuContainer.getBoundingClientRect();

      // Вычислить центр пункта меню относительно контейнера подменю
      const arrowLeft = menuItemRect.left - subMenuRect.left + menuItemRect.width / 2 - 20;

      // Позиционировать оба элемента (стрелку и галочку)
      if (this.arrowElement) {
        this.arrowElement.style.left = `${arrowLeft}px`;
      }
      if (this.checkmarkElement) {
        this.checkmarkElement.style.left = `${arrowLeft}px`;
      }
    }

    /**
     * Установить активный пункт меню
     * @param {HTMLElement} menuItem - Пункт меню для активации
     */
    setActiveMenuItem(menuItem) {
      // Убрать класс активности со всех пунктов меню
      this.menuItems.forEach(item => {
        item.classList.remove('header__menu-item--active');
      });

      // Добавить класс активности к текущему пункту
      menuItem.classList.add('header__menu-item--active');
      this.currentActiveMenuItem = menuItem;
    }

    /**
     * Скрыть все подменю
     */
    hideAllSubMenus() {
      this.subMenus.forEach(subMenu => {
        subMenu.style.display = 'none';
      });

      // Убрать класс активности со всех пунктов меню
      this.menuItems.forEach(item => {
        item.classList.remove('header__menu-item--active');
      });

      this.subMenuContainer.classList.remove(this.config.activeClass);
      this.currentActiveSubMenu = null;
      this.currentActiveMenuItem = null;
    }

    /**
     * Запустить таймер скрытия подменю
     */
    startHideTimer() {
      // Отменить предыдущий таймер, если он существует
      this.cancelHideTimer();

      // Запустить новый таймер
      this.hideTimer = setTimeout(() => {
        this.hideAllSubMenus();
      }, this.config.hideDelay);
    }

    /**
     * Отменить таймер скрытия подменю
     */
    cancelHideTimer() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    }

    /**
     * Инициализация модального меню
     */
    initModalMenu() {
      // Поиск элементов модального меню
      this.modalMenu = document.querySelector('.header__modal-menu');
      this.burgerButton = document.querySelector('.header__main-menu__buttons__burger-menu');

      if (!this.modalMenu) {
        console.warn('HeaderNavigation: Модальное меню не найдено');
        return;
      }

      this.modalCloseButton = this.modalMenu.querySelector('.header__modal-menu__close');

      // Навешиваем обработчик на бургер-кнопку здесь, т.к. она ищется только на этом шаге
      if (this.burgerButton) {
        this.burgerButton.addEventListener('click', this.openModalMenu.bind(this));
      }

      // Привязка обработчиков
      if (this.modalCloseButton) {
        this.modalCloseButton.addEventListener('click', this.closeModalMenu.bind(this));
      }

      // Закрытие по ESC
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.modalMenu.classList.contains('header__modal-menu--open')) {
          this.closeModalMenu();
        }
      });
    }

    /**
     * Открыть модальное меню
     */
    openModalMenu() {
      if (!this.modalMenu) {
        return;
      }

      // Добавить класс для открытия меню
      this.modalMenu.classList.add('header__modal-menu--open');

      // Заблокировать скролл body
      document.body.classList.add('modal-menu-open');

      console.log('HeaderNavigation: Модальное меню открыто');
    }

    /**
     * Закрыть модальное меню
     */
    closeModalMenu() {
      if (!this.modalMenu) {
        return;
      }

      // Убрать класс для закрытия меню
      this.modalMenu.classList.remove('header__modal-menu--open');

      // Разблокировать скролл body
      document.body.classList.remove('modal-menu-open');

      console.log('HeaderNavigation: Модальное меню закрыто');
    }

    /**
     * Инициализация мобильного аккордеона для выпадающих подпунктов
     */
    initMobileAccordion() {
      // Найти все элементы с выпадающими списками
      const accordionItems = document.querySelectorAll('.header__modal-menu__detailed__item');

      if (accordionItems.length === 0) {
        return;
      }

      // Функция для проверки ширины экрана
      const isMobile = () => window.innerWidth <= 744;

      // Функция для применения/удаления мобильного режима
      const toggleMobileMode = () => {
        accordionItems.forEach(item => {
          const header = item.querySelector('.header__modal-menu__detailed__item__header');
          const button = header ? header.querySelector('button') : null;
          const ul = item.querySelector('ul');

          if (!header || !ul) {
            return;
          }

          if (isMobile()) {
            // Скрываем списки по умолчанию на мобильных (если не открыты)
            if (!item.classList.contains('header__modal-menu__detailed__item--open')) {
              ul.style.display = 'none';
              ul.style.maxHeight = '0';
              ul.style.opacity = '0';
              if (button) {
                button.classList.remove('header__modal-menu__detailed__item__button--rotated');
              }
            }
          } else {
            // Показываем списки на десктопе
            ul.style.display = '';
            ul.style.maxHeight = '';
            ul.style.opacity = '';
            if (button) {
              button.classList.remove('header__modal-menu__detailed__item__button--rotated');
            }
            item.classList.remove('header__modal-menu__detailed__item--open');
          }
        });
      };

      // Инициализация обработчиков кликов
      accordionItems.forEach(item => {
        const header = item.querySelector('.header__modal-menu__detailed__item__header');
        const button = header ? header.querySelector('button') : null;
        const ul = item.querySelector('ul');

        if (!header || !ul) {
          return;
        }

        // Обработчик клика на header
        const handleHeaderClick = e => {
          e.preventDefault();
          e.stopPropagation();

          // Работает только на мобильных устройствах
          if (!isMobile()) {
            return;
          }

          const isOpen = item.classList.contains('header__modal-menu__detailed__item--open');

          if (isOpen) {
            // Закрываем
            ul.style.maxHeight = '0';
            ul.style.opacity = '0';
            if (button) {
              button.classList.remove('header__modal-menu__detailed__item__button--rotated');
            }
            item.classList.remove('header__modal-menu__detailed__item--open');

            setTimeout(() => {
              if (!item.classList.contains('header__modal-menu__detailed__item--open')) {
                ul.style.display = 'none';
              }
            }, 300);
          } else {
            // Открываем
            // Сначала делаем элемент видимым для вычисления высоты
            ul.style.display = 'flex';
            ul.style.maxHeight = 'none'; // Убираем ограничение для вычисления
            ul.style.visibility = 'hidden'; // Скрываем визуально, но элемент занимает место
            ul.style.opacity = '0';

            // Вычисляем реальную высоту контента
            const height = ul.scrollHeight;

            // Возвращаем видимость
            ul.style.visibility = '';

            // Устанавливаем начальное состояние для анимации
            ul.style.maxHeight = '0';

            // Запускаем анимацию через requestAnimationFrame для плавности
            requestAnimationFrame(() => {
              ul.style.maxHeight = `${height}px`;
              ul.style.opacity = '1';
            });

            if (button) {
              button.classList.add('header__modal-menu__detailed__item__button--rotated');
            }
            item.classList.add('header__modal-menu__detailed__item--open');
          }
        };

        header.addEventListener('click', handleHeaderClick);
      });

      // Инициализация при загрузке
      toggleMobileMode();

      // Обработка изменения размера окна
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          toggleMobileMode();
        }, 100);
      };

      window.addEventListener('resize', handleResize);

      // Сохраняем обработчики для возможности очистки
      this._accordionResizeHandler = handleResize;
    }

    /**
     * Уничтожить экземпляр и очистить обработчики
     */
    destroy() {
      // Отмена таймера
      this.cancelHideTimer();

      // Удаление обработчиков событий
      this.menuItems.forEach(menuItem => {
        menuItem.removeEventListener('mouseenter', this.handleMenuItemMouseEnter.bind(this));
        menuItem.removeEventListener('mouseleave', this.handleMenuItemMouseLeave.bind(this));
      });

      this.subMenuContainer.removeEventListener('mouseenter', this.handleSubMenuMouseEnter.bind(this));
      this.subMenuContainer.removeEventListener('mouseleave', this.handleSubMenuMouseLeave.bind(this));
      this.header.removeEventListener('mouseleave', this.handleHeaderMouseLeave.bind(this));

      // Удаление обработчиков модального меню
      if (this.burgerButton) {
        this.burgerButton.removeEventListener('click', this.openModalMenu.bind(this));
      }
      if (this.modalCloseButton) {
        this.modalCloseButton.removeEventListener('click', this.closeModalMenu.bind(this));
      }

      // Сброс состояния
      this.hideAllSubMenus();
      this.closeModalMenu();

      console.log('HeaderNavigation: Модуль уничтожен');
    }
  }

  /**
   * Инициализация модуля при загрузке DOM
   */
  function initHeaderNavigation() {
    // Проверка готовности DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        new HeaderNavigation();
      });
    } else {
      // DOM уже готов
      new HeaderNavigation();
    }
  }

  // Автоматическая инициализация
  initHeaderNavigation();

  // Экспорт класса для возможного повторного использования
  window.HeaderNavigation = HeaderNavigation;
})();
