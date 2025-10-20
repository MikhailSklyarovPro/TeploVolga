/**
 * Универсальный контроллер для управления видео с модальными окнами
 */
class VideoController {
  constructor(container) {
    this.container = container;
    this.backgroundVideo = container.querySelector('video');
    this.poster = container.querySelector('[data-video-poster]');
    this.modal = document.querySelector(container.dataset.modalTarget);

    // Настройки из data-атрибутов
    this.config = {
      autoPlayBackground: container.dataset.autoPlayBackground !== 'false',
      loopBackground: container.dataset.loopBackground !== 'false',
      muteBackground: container.dataset.muteBackground !== 'false',
      autoPlayModal: container.dataset.autoPlayModal !== 'false',
      showControlsModal: container.dataset.showControlsModal !== 'false',
      transitionDuration: container.dataset.transitionDuration || '300ms',
    };

    this.init();
  }

  init() {
    if (!this.backgroundVideo) {
      console.warn('VideoController: фоновое видео не найдено в контейнере', this.container);
      return;
    }

    if (!this.poster) {
      console.warn('VideoController: постер не найден в контейнере', this.container);
      return;
    }

    if (!this.modal) {
      console.warn('VideoController: модальное окно не найдено', this.container.dataset.modalTarget);
      return;
    }

    this.setupBackgroundVideo();
    this.setupModal();
    this.bindEvents();
  }

  setupBackgroundVideo() {
    // Настройка фонового видео
    if (this.config.loopBackground) {
      this.backgroundVideo.loop = true;
    }

    if (this.config.muteBackground) {
      this.backgroundVideo.muted = true;
    }

    // Автозапуск фонового видео
    if (this.config.autoPlayBackground) {
      this.backgroundVideo.play().catch(error => {
        console.warn('VideoController: не удалось запустить фоновое видео:', error);
      });
    }
  }

  setupModal() {
    const modalVideo = this.modal.querySelector('video');

    if (!modalVideo) {
      console.warn('VideoController: видео в модальном окне не найдено');
      return;
    }

    // Настройка видео в модальном окне
    if (this.config.showControlsModal) {
      modalVideo.controls = true;
    }

    // Копируем src из фонового видео
    const source = this.backgroundVideo.querySelector('source');
    if (source) {
      modalVideo.innerHTML = source.outerHTML;
    }
  }

  bindEvents() {
    // Обработчик клика для открытия модального окна
    this.poster.addEventListener('click', () => {
      this.openModal();
    });

    // Обработчики для модального окна
    this.bindModalEvents();
  }

  bindModalEvents() {
    // Закрытие модального окна по клику на overlay
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });

    // Закрытие по кнопке
    const closeBtn = this.modal.querySelector('[data-modal-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
  }

  openModal() {
    this.modal.style.display = 'flex';
    this.modal.style.opacity = '0';

    // Плавное появление
    requestAnimationFrame(() => {
      this.modal.style.transition = `opacity ${this.config.transitionDuration} ease`;
      this.modal.style.opacity = '1';
    });

    // Автозапуск видео в модальном окне
    if (this.config.autoPlayModal) {
      const modalVideo = this.modal.querySelector('video');
      if (modalVideo) {
        modalVideo.play().catch(error => {
          console.warn('VideoController: не удалось запустить видео в модальном окне:', error);
        });
      }
    }

    // Блокируем скролл body
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.style.opacity = '0';

    setTimeout(
      () => {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';

        // Останавливаем видео в модальном окне
        const modalVideo = this.modal.querySelector('video');
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.currentTime = 0;
        }
      },
      parseInt(this.config.transitionDuration, 10)
    );
  }

  isModalOpen() {
    return this.modal.style.display === 'flex';
  }

  // Публичные методы для программного управления
  getBackgroundVideo() {
    return this.backgroundVideo;
  }

  getModalVideo() {
    return this.modal.querySelector('video');
  }

  isBackgroundPlaying() {
    return !this.backgroundVideo.paused && !this.backgroundVideo.ended;
  }

  isModalPlaying() {
    const modalVideo = this.getModalVideo();
    return modalVideo && !modalVideo.paused && !modalVideo.ended;
  }
}

/**
 * Инициализация всех видео контроллеров на странице
 */
document.addEventListener('DOMContentLoaded', () => {
  const videoContainers = document.querySelectorAll('[data-video-controller]');

  videoContainers.forEach(container => {
    const controller = new VideoController(container);
    // Сохраняем ссылку на контроллер для программного доступа
    container._videoController = controller;
  });
});
