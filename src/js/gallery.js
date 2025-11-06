/**
 * Галерея изображений с плавной анимацией переключения
 * Поддерживает навигацию через кнопки и миниатюры
 * Данные берутся из HTML атрибутов для совместимости с Битрикс
 */

class GalleryController {
  constructor() {
    this.currentIndex = 0;
    this.thumbnails = [];
    this.images = [];

    this.init();
  }

  init() {
    this.mainImage = document.querySelector('[data-gallery-main]');
    this.subtitle = document.querySelector('.gallery__subtitle');
    this.description = document.querySelector('.gallery__description');
    this.prevBtn = document.querySelector('[data-gallery-prev]');
    this.nextBtn = document.querySelector('[data-gallery-next]');
    this.thumbnails = document.querySelectorAll('[data-gallery-thumb]');

    this.parseImagesFromHTML();
    this.bindEvents();
    this.updateGallery();
  }

  parseImagesFromHTML() {
    this.thumbnails.forEach((thumb, index) => {
      const img = thumb.querySelector('img');
      const title = thumb.getAttribute('data-gallery-title');
      const descriptionText = thumb.getAttribute('data-gallery-description');

      // Разделяем описание по символу |
      const description = descriptionText ? descriptionText.split('|') : [];

      this.images.push({
        src: img.src,
        alt: img.alt,
        title: title || '',
        description: description,
      });
    });
  }

  bindEvents() {
    // Навигация кнопками
    this.prevBtn?.addEventListener('click', () => this.previousImage());
    this.nextBtn?.addEventListener('click', () => this.nextImage());

    // Навигация миниатюрами
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.goToImage(index));
    });

    // Клавиатурная навигация
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        this.previousImage();
      }
      if (e.key === 'ArrowRight') {
        this.nextImage();
      }
    });

    // Клики по боковым изображениям на мобильных устройствах
    this.initMobileImageClicks();

    // Свайп на мобильных устройствах
    this.initSwipeNavigation();
  }

  initMobileImageClicks() {
    const imageContainer = document.querySelector('.gallery__image-container');
    if (!imageContainer) {
      return;
    }

    // Обработчик для левого изображения (предыдущее)
    imageContainer.addEventListener('click', e => {
      const rect = imageContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const containerWidth = rect.width;

      // Если клик в левой половине контейнера
      if (clickX < containerWidth * 0.3) {
        this.previousImage();
      }
      // Если клик в правой половине контейнера
      else if (clickX > containerWidth * 0.7) {
        this.nextImage();
      }
    });
  }

  initSwipeNavigation() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    // Добавляем обработчики на контейнер изображения для мобильных устройств
    const imageContainer = document.querySelector('.gallery__image-container');
    const targetElement = imageContainer || this.mainImage;

    targetElement?.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    targetElement?.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Минимальное расстояние для свайпа
      const minSwipeDistance = 50;

      // Проверяем, что свайп горизонтальный (не вертикальный)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.previousImage();
        } else {
          this.nextImage();
        }
      }
    });
  }

  previousImage() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    this.updateGallery();
  }

  nextImage() {
    this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
    this.updateGallery();
  }

  goToImage(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.updateGallery();
    }
  }

  updateGallery() {
    const currentImage = this.images[this.currentIndex];
    const prevIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    const nextIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
    const prevImage = this.images[prevIndex];
    const nextImage = this.images[nextIndex];

    // Плавное переключение изображения
    if (this.mainImage) {
      this.mainImage.style.opacity = '0';

      setTimeout(() => {
        this.mainImage.src = currentImage.src;
        this.mainImage.alt = currentImage.alt;
        this.mainImage.style.opacity = '1';
      }, 150);
    }

    // Обновление CSS переменных для мобильного эффекта
    const imageContainer = document.querySelector('.gallery__image-container');
    if (imageContainer) {
      imageContainer.style.setProperty('--prev-image', `url(${prevImage.src})`);
      imageContainer.style.setProperty('--next-image', `url(${nextImage.src})`);
    }

    // Обновление текстового контента
    if (this.subtitle) {
      this.subtitle.textContent = currentImage.title;
    }

    if (this.description) {
      this.description.innerHTML = currentImage.description.map(paragraph => `<p class="text-description--400">${paragraph}</p>`).join('');
    }

    // Обновление активной миниатюры
    this.thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentIndex);
    });
  }

  // Публичные методы для внешнего управления
  getCurrentIndex() {
    return this.currentIndex;
  }

  getTotalImages() {
    return this.images.length;
  }

  getCurrentImage() {
    return this.images[this.currentIndex];
  }
}

// Инициализация галереи при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что мы на главной странице
  if (document.querySelector('.gallery')) {
    window.galleryController = new GalleryController();
  }
});

// Экспорт для использования в других модулях
// eslint-disable-next-line no-undef
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // eslint-disable-next-line no-undef
  module.exports = GalleryController;
}
