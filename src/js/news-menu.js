import { Pagination } from './pagination.js';

/**
 * Класс для управления фильтрацией и отображением новостей
 */
class NewsMenu {
  /**
   * @param {Object} options - Настройки
   * @param {HTMLElement|string} options.filtersContainer - Контейнер с фильтрами
   * @param {HTMLElement|string} options.gridContainer - Контейнер для сетки новостей
   * @param {HTMLElement|string} options.paginationContainer - Контейнер для пагинации
   * @param {Array} options.news - Массив всех новостей
   * @param {number} options.itemsPerPage - Новостей на странице
   */
  constructor(options = {}) {
    this.filtersContainer = typeof options.filtersContainer === 'string' ? document.querySelector(options.filtersContainer) : options.filtersContainer;

    this.gridContainer = typeof options.gridContainer === 'string' ? document.querySelector(options.gridContainer) : options.gridContainer;

    this.paginationContainer = typeof options.paginationContainer === 'string' ? document.querySelector(options.paginationContainer) : options.paginationContainer;

    if (!this.filtersContainer || !this.gridContainer || !this.paginationContainer) {
      console.error('NewsMenu: не все контейнеры найдены');
      return;
    }

    this.options = {
      news: options.news || [],
      itemsPerPage: options.itemsPerPage || 9,
      activeFilter: 'all',
      ...options,
    };

    this.filteredNews = [...this.options.news];
    this.pagination = null;

    this.init();
  }

  /**
   * Инициализация
   */
  init() {
    this.attachFilterEvents();
    this.initPagination();
    this.renderNews();
  }

  /**
   * Привязка событий к фильтрам
   */
  attachFilterEvents() {
    const filterButtons = this.filtersContainer.querySelectorAll('[data-filter]');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.setActiveFilter(filter);
      });
    });
  }

  /**
   * Установка активного фильтра
   * @param {string} filter - Значение фильтра
   */
  setActiveFilter(filter) {
    if (this.options.activeFilter === filter) {
      return;
    }

    this.options.activeFilter = filter;

    // Обновляем визуальное состояние кнопок
    const filterButtons = this.filtersContainer.querySelectorAll('[data-filter]');
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('news__filters__item--active');
      } else {
        btn.classList.remove('news__filters__item--active');
      }
    });

    // Фильтруем новости
    this.filterNews();

    // Обновляем пагинацию
    this.updatePagination();

    // Показываем первую страницу
    this.renderNews();
  }

  /**
   * Фильтрация новостей по категории
   */
  filterNews() {
    if (this.options.activeFilter === 'all') {
      this.filteredNews = [...this.options.news];
    } else {
      this.filteredNews = this.options.news.filter(news => {
        return news.category === this.options.activeFilter;
      });
    }
  }

  /**
   * Инициализация пагинации
   */
  initPagination() {
    this.pagination = new Pagination(this.paginationContainer, {
      totalItems: this.filteredNews.length,
      itemsPerPage: this.options.itemsPerPage,
      currentPage: 1,
      onPageChange: () => {
        this.renderNews();
      },
    });
  }

  /**
   * Обновление пагинации
   */
  updatePagination() {
    if (this.pagination) {
      this.pagination.update({
        totalItems: this.filteredNews.length,
        currentPage: 1,
      });
    }
  }

  /**
   * Отрисовка новостей на текущей странице
   */
  renderNews() {
    if (!this.pagination) {
      this.renderAllNews();
      return;
    }

    const pageData = this.pagination.getPageData();
    const startIndex = pageData.start - 1;
    const endIndex = pageData.end;
    const newsToShow = this.filteredNews.slice(startIndex, endIndex);

    this.renderNewsGrid(newsToShow);
  }

  /**
   * Отрисовка всех новостей (без пагинации)
   */
  renderAllNews() {
    this.renderNewsGrid(this.filteredNews);
  }

  /**
   * Отрисовка сетки новостей
   * @param {Array} news - Массив новостей для отображения
   */
  renderNewsGrid(news) {
    if (news.length === 0) {
      this.gridContainer.innerHTML = '';
      return;
    }

    const html = news.map(item => this.createNewsCard(item)).join('');
    this.gridContainer.innerHTML = html;
  }

  /**
   * Создание HTML карточки новости
   * @param {Object} news - Объект новости
   * @returns {string} HTML строка
   */
  createNewsCard(news) {
    const date = this.formatDate(news.date);
    const tagText = this.getTagText(news.category);

    return `
      <a href="${news.link || '#'}" class="wrapper-card-new">
        <span class="card-news__date text-description--300">${date}</span>
        <div class="card-news">
          <div class="card-news__image">
            <img src="${news.image}" alt="${news.imageAlt || news.title}" />
          </div>
          <div class="card-news__content">
            <div class="card-news__tags">
              <span class="card-news__tag text-description--300">${tagText}</span>
            </div>
            <div class="card-news__info">
              <p class="caption--500">${news.title}</p>
              <p class="text-description--400">${news.description}</p>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  /**
   * Форматирование даты
   * @param {string|Date} date - Дата
   * @returns {string} Отформатированная дата
   */
  formatDate(date) {
    if (!date) {
      return '';
    }

    const d = new Date(date);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    return `${d.getDate()} ${months[d.getMonth()]}`;
  }

  /**
   * Получение текста для тега категории
   * @param {string} category - Категория
   * @returns {string} Текст тега
   */
  getTagText(category) {
    const tagTexts = {
      enplusGroup: 'ЭН+ Групп',
      heatingNetworks: 'Теплосети',
      generation: 'Генерация тепло',
      avtozavodskayaTpp: 'Автозаводская ТЭЦ',
      factoryNetworks: 'Заводские сети',
      youthCouncil: 'Молодежный совет',
      worksCouncil: 'Рабочий совет',
      ecology: 'Экология',
    };

    return tagTexts[category] || 'Эн+ Тепло Волга';
  }

  /**
   * Обновление списка новостей
   * @param {Array} news - Новый массив новостей
   */
  updateNews(news) {
    this.options.news = news;
    this.filterNews();
    this.updatePagination();
    this.renderNews();
  }

  /**
   * Уничтожение экземпляра
   */
  destroy() {
    if (this.pagination) {
      this.pagination.destroy();
    }
    this.gridContainer.innerHTML = '';
  }
}

/**
 * Автоматическая инициализация через data-атрибуты
 */
function initNewsMenuFromAttributes() {
  const filtersContainer = document.querySelector('[data-news-filters]');
  const gridContainer = document.querySelector('[data-news-grid]');
  const paginationContainer = document.querySelector('[data-pagination]');

  if (!filtersContainer || !gridContainer || !paginationContainer) {
    return;
  }

  // Если уже инициализирован, пропускаем
  if (gridContainer.newsMenuInstance) {
    return;
  }

  // Получаем данные новостей из data-атрибута или используем тестовые данные
  let news = [];

  try {
    const newsData = gridContainer.dataset.news;
    if (newsData) {
      news = JSON.parse(newsData);
    }
  } catch {
    console.warn('NewsMenu: не удалось загрузить данные новостей из data-атрибута');
  }

  // Если данных нет, используем тестовые данные
  if (news.length === 0) {
    news = getTestNewsData();
  }

  const newsMenu = new NewsMenu({
    filtersContainer,
    gridContainer,
    paginationContainer,
    news,
    itemsPerPage: parseInt(gridContainer.dataset.itemsPerPage, 10) || 9,
  });

  gridContainer.newsMenuInstance = newsMenu;
}

/**
 * Тестовые данные новостей, структурированные по категориям
 * @returns {Object} Объект с массивами новостей по категориям
 */
function getTestNewsDataByCategory() {
  const today = new Date();

  return {
    enplusGroup: [
      {
        id: 1,
        title: 'Стратегическое развитие ЭН+ Групп в 2024 году',
        description: 'ЭН+ Групп объявляет о новых стратегических инициативах, направленных на устойчивое развитие и инновации в энергетическом секторе.',
        category: 'enplusGroup',
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Стратегическое развитие ЭН+ Групп',
        link: '../home/news-details.html',
      },
      {
        id: 2,
        title: 'Корпоративные программы ЭН+ Групп',
        description: 'Новые корпоративные программы для сотрудников компании, включающие обучение, развитие и социальные инициативы.',
        category: 'enplusGroup',
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Корпоративные программы ЭН+ Групп',
        link: '../home/news-details.html',
      },
      {
        id: 3,
        title: 'Инвестиции ЭН+ Групп в экологические проекты',
        description: 'Компания объявляет о значительных инвестициях в экологические проекты и переход на возобновляемые источники энергии.',
        category: 'enplusGroup',
        date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news3.webp',
        imageAlt: 'Экологические проекты ЭН+ Групп',
        link: '../home/news-details.html',
      },
    ],
    heatingNetworks: [
      {
        id: 4,
        title: 'Модернизация тепловых сетей в Нижнем Новгороде',
        description: 'Начата масштабная модернизация тепловых сетей с применением современных технологий и материалов для повышения надежности.',
        category: 'heatingNetworks',
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news4.webp',
        imageAlt: 'Модернизация тепловых сетей',
        link: '../home/news-details.html',
      },
      {
        id: 5,
        title: 'Новые технологии бестраншейной прокладки труб',
        description: 'Внедрение уникальной технологии бестраншейной прокладки трубопроводов для минимизации воздействия на городскую инфраструктуру.',
        category: 'heatingNetworks',
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Бестраншейная прокладка труб',
        link: '../home/news-details.html',
      },
      {
        id: 6,
        title: 'Повышение эффективности работы теплосетей',
        description: 'Реализация программы по повышению энергетической эффективности тепловых сетей и снижению потерь тепла.',
        category: 'heatingNetworks',
        date: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news4.webp',
        imageAlt: 'Эффективность теплосетей',
        link: '../home/news-details.html',
      },
    ],
    generation: [
      {
        id: 7,
        title: 'Реконструкция котельных установок',
        description: 'Масштабные работы по реконструкции котельных установок с переходом на экологически чистое топливо.',
        category: 'generation',
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news3.webp',
        imageAlt: 'Реконструкция котельных',
        link: '../home/news-details.html',
      },
      {
        id: 8,
        title: 'От старых котлов к экологичному будущему',
        description: 'Программа по замене устаревшего оборудования на современные экологичные системы генерации тепла.',
        category: 'generation',
        date: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Экологичное будущее генерации',
        link: '../home/news-details.html',
      },
      {
        id: 9,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 43,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 3535,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 45454,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 434,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 2233,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
    ],
    avtozavodskayaTpp: [
      {
        id: 10,
        title: 'Обновление оборудования Автозаводской ТЭЦ',
        description: 'Проведение плановых работ по обновлению и модернизации основного оборудования Автозаводской ТЭЦ.',
        category: 'avtozavodskayaTpp',
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Обновление оборудования ТЭЦ',
        link: '../home/news-details.html',
      },
      {
        id: 11,
        title: 'Повышение надежности работы ТЭЦ',
        description: 'Реализация мероприятий по повышению надежности и безопасности работы Автозаводской ТЭЦ.',
        category: 'avtozavodskayaTpp',
        date: new Date(today.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Надежность работы ТЭЦ',
        link: '../home/news-details.html',
      },
      {
        id: 12,
        title: 'Экологические инициативы на Автозаводской ТЭЦ',
        description: 'Внедрение экологических программ и технологий для снижения воздействия на окружающую среду.',
        category: 'avtozavodskayaTpp',
        date: new Date(today.getTime() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news3.webp',
        imageAlt: 'Экология на ТЭЦ',
        link: '../home/news-details.html',
      },
    ],
    factoryNetworks: [
      {
        id: 13,
        title: 'Развитие заводских тепловых сетей',
        description: 'Расширение и модернизация заводских тепловых сетей для обеспечения надежного теплоснабжения.',
        category: 'factoryNetworks',
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news4.webp',
        imageAlt: 'Заводские тепловые сети',
        link: '../home/news-details.html',
      },
      {
        id: 14,
        title: 'Новые проекты в заводских сетях',
        description: 'Запуск новых проектов по развитию инфраструктуры заводских тепловых сетей.',
        category: 'factoryNetworks',
        date: new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Проекты заводских сетей',
        link: '../home/news-details.html',
      },
      {
        id: 15,
        title: 'Оптимизация работы заводских сетей',
        description: 'Внедрение систем оптимизации для повышения эффективности работы заводских тепловых сетей.',
        category: 'factoryNetworks',
        date: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news4.webp',
        imageAlt: 'Оптимизация заводских сетей',
        link: '../home/news-details.html',
      },

      {
        id: 1111,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
      {
        id: 6767676,
        title: 'Внедрение автоматизированных систем управления',
        description: 'Внедрение современных автоматизированных систем управления генерацией тепла для оптимизации процессов.',
        category: 'generation',
        date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Автоматизированные системы',
        link: '../home/news-details.html',
      },
    ],
    youthCouncil: [
      {
        id: 16,
        title: '120 этажей вверх: марафон по-нижегородски',
        description: 'Более 50 коллег из «Эн+ Тепло Волга» приняли участие в пятом «Марафоне Нижний Новгород».',
        category: 'youthCouncil',
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news3.webp',
        imageAlt: 'Марафон по-нижегородски',
        link: '../home/news-details.html',
      },
      {
        id: 17,
        title: 'Молодежные инициативы в компании',
        description: 'Активная работа молодежного совета по реализации социальных и профессиональных инициатив.',
        category: 'youthCouncil',
        date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Молодежные инициативы',
        link: '../home/news-details.html',
      },
      {
        id: 18,
        title: 'Спортивные достижения сотрудников',
        description: 'Сотрудники компании показывают отличные результаты в корпоративных спортивных мероприятиях.',
        category: 'youthCouncil',
        date: new Date(today.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Спортивные достижения',
        link: '../home/news-details.html',
      },
    ],
    worksCouncil: [
      {
        id: 19,
        title: 'Безопасность по-новому',
        description: 'В «Теплосетях» прошла двухдневная коучинговая сессия по охране труда для руководителей «ЭН+ ТЕПЛО ВОЛГА».',
        category: 'worksCouncil',
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Безопасность по-новому',
        link: '../home/news-details.html',
      },
      {
        id: 20,
        title: 'Рабочий совет: новые решения',
        description: 'Заседание рабочего совета, на котором были приняты важные решения по улучшению условий труда.',
        category: 'worksCouncil',
        date: new Date(today.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Рабочий совет',
        link: '../home/news-details.html',
      },
      {
        id: 21,
        title: '130 метров под землей',
        description: 'Новый жилой комплекс «Чкалов» в Нижнем Новгороде получил горячую воду благодаря уникальной технологии бестраншейной прокладки.',
        category: 'worksCouncil',
        date: new Date(today.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news3.webp',
        imageAlt: '130 метров под землей',
        link: '../home/news-details.html',
      },
    ],
    ecology: [
      {
        id: 22,
        title: 'Экологические программы компании',
        description: 'Реализация комплексных экологических программ, направленных на снижение воздействия на окружающую среду.',
        category: 'ecology',
        date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news4.webp',
        imageAlt: 'Экологические программы',
        link: '../home/news-details.html',
      },
      {
        id: 23,
        title: 'Переход на экологичное топливо',
        description: 'Программа по переходу на использование экологически чистого топлива в котельных установках.',
        category: 'ecology',
        date: new Date(today.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news1.webp',
        imageAlt: 'Экологичное топливо',
        link: '../home/news-details.html',
      },
      {
        id: 24,
        title: 'Охрана окружающей среды',
        description: 'Мероприятия по охране окружающей среды и внедрению природоохранных технологий.',
        category: 'ecology',
        date: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        image: '../../img/news/cards/news2.webp',
        imageAlt: 'Охрана окружающей среды',
        link: '../home/news-details.html',
      },
    ],
  };
}

/**
 * Преобразование структурированных данных в плоский массив
 * @returns {Array} Массив всех новостей
 */
function getTestNewsData() {
  const newsByCategory = getTestNewsDataByCategory();
  const allNews = [];

  // Объединяем все новости из всех категорий в один массив
  Object.values(newsByCategory).forEach(categoryNews => {
    allNews.push(...categoryNews);
  });

  // Сортируем по дате (новые первыми)
  allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

  return allNews;
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNewsMenuFromAttributes);
} else {
  initNewsMenuFromAttributes();
}

// Экспорт для использования в других модулях
export { getTestNewsData, initNewsMenuFromAttributes, NewsMenu };
