import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export function initCasesSlider() {
  const sliders = document.querySelectorAll('[data-cases-slider]');

  sliders.forEach((slider) => {
    const root = slider.closest('.cases');

    if (!root) {
      return;
    }

    new Swiper(slider, {
      modules: [Navigation, Pagination],
      slidesPerView: 2,
      spaceBetween: 24,
      loop: true,
      speed: 500,
      navigation: {
        prevEl: root.querySelector('.cases__button--prev'),
        nextEl: root.querySelector('.cases__button--next'),
      },
      pagination: {
        el: root.querySelector('.cases__pagination'),
        bulletClass: 'cases__bullet',
        bulletActiveClass: 'cases__bullet--active',
        clickable: true,
      },
    });
  });
}
