import Swiper from 'swiper';
import {Navigation, Pagination} from 'swiper/modules';

export function initReviewsSlider() {
  const sliders = document.querySelectorAll('[data-reviews-slider]');

  sliders.forEach((slider) => {
    const root = slider.closest('.reviews');

    if (!root) {
      return;
    }

    new Swiper(slider, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      speed: 500,
      navigation: {
        prevEl: root.querySelector('.reviews__button--prev'),
        nextEl: root.querySelector('.reviews__button--next'),
      },
      pagination: {
        el: root.querySelector('.reviews__pagination'),
        bulletClass: 'reviews__bullet',
        bulletActiveClass: 'reviews__bullet--active',
        clickable: true,
      },
    });
  });
}
