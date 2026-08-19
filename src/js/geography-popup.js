import Swiper from 'swiper';
import {Navigation} from 'swiper/modules';

import {VACANCIES_BY_CITY, pluralizeVacancies} from './geography-data.js';

// Иконки импортом, а не строкой пути: строку Vite не обрабатывает, и в собранном
// виде файла по такому адресу нет.
import ICON_PLUS from '../assets/figma/geography/icon-plus-circle.svg';
import ICON_TAIL from '../assets/figma/geography/pin-tail.svg';
import ICON_PREV from '../assets/figma/geography/chevron-left.svg';
import ICON_NEXT from '../assets/figma/geography/chevron-right.svg';

// Ниже этой ширины карта тянется, поэтому привязанный к пину попап уезжал бы
// вместе с картой — показываем модалку по центру экрана. Граница совпадает
// с той, на которой включается панорама карты.
const MODAL_QUERY = '(max-width: 1399.98px)';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const createMarkup = () => `
  <div class="geo-popup__scrim" data-geography-popup-scrim></div>
  <div class="geo-popup__panel"
       role="dialog"
       aria-labelledby="geo-popup-title"
  >
    <div class="geo-popup__head">
      <span class="geo-popup__marker" aria-hidden="true">
        <span class="geo-popup__badge" data-geography-popup-badge></span>
        <img class="geo-popup__tail" src="${ICON_TAIL}" width="16" height="11" alt="" aria-hidden="true">
      </span>
      <p class="geo-popup__title" id="geo-popup-title">
        <span class="geo-popup__city" data-geography-popup-city></span>
        <span class="geo-popup__count" data-geography-popup-count></span>
      </p>
      <button class="geo-popup__close"
              type="button"
              aria-label="Закрыть"
              data-geography-popup-close
      ><span aria-hidden="true">&times;</span></button>
    </div>

    <div class="geo-popup__slider swiper" data-geography-popup-slider>
      <div class="geo-popup__wrapper swiper-wrapper" data-geography-popup-slides></div>
    </div>

    <div class="geo-popup__footer">
      <a class="geo-popup__add" href="#demo-request">
        <img class="geo-popup__add-icon" src="${ICON_PLUS}" width="26" height="26" alt="" aria-hidden="true">
        Добавить вакансию
      </a>
      <div class="geo-popup__nav">
        <button class="geo-popup__arrow geo-popup__arrow--prev"
                type="button"
                aria-label="Предыдущая вакансия"
                data-geography-popup-prev
        ><img src="${ICON_PREV}" width="12" height="19" alt="" aria-hidden="true"></button>
        <button class="geo-popup__arrow geo-popup__arrow--next"
                type="button"
                aria-label="Следующая вакансия"
                data-geography-popup-next
        ><img src="${ICON_NEXT}" width="12" height="19" alt="" aria-hidden="true"></button>
      </div>
    </div>
  </div>
`;

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const renderAvatars = (vacancy) => {
  const items = vacancy.applicants.map((src) => `
    <li class="geo-popup__avatar">
      <img src="${src}" width="66" height="66" alt="" aria-hidden="true" loading="lazy">
    </li>
  `).join('');

  const rest = vacancy.applicantsRest
    ? `<li class="geo-popup__avatar-rest">+${vacancy.applicantsRest}</li>`
    : '';

  return items + rest;
};

const renderSlide = (vacancy) => `
  <div class="geo-popup__slide swiper-slide">
    <article class="geo-popup__card">
      <h3 class="geo-popup__card-title">${escapeHtml(vacancy.title)}</h3>
      <p class="geo-popup__card-salary">${escapeHtml(vacancy.salary)}</p>
      <div class="geo-popup__applicants">
        <p class="geo-popup__applicants-label">Соискатели:</p>
        <ul class="geo-popup__avatars">${renderAvatars(vacancy)}</ul>
      </div>
    </article>
  </div>
`;

export function createGeoPopup(root) {
  const element = document.createElement('div');
  element.className = 'geo-popup';
  element.hidden = true;
  element.innerHTML = createMarkup();
  root.appendChild(element);

  const panel = element.querySelector('.geo-popup__panel');
  const scrim = element.querySelector('[data-geography-popup-scrim]');
  const marker = element.querySelector('.geo-popup__marker');
  const badge = element.querySelector('[data-geography-popup-badge]');
  const city = element.querySelector('[data-geography-popup-city]');
  const count = element.querySelector('[data-geography-popup-count]');
  const closeButton = element.querySelector('[data-geography-popup-close]');
  const slidesHolder = element.querySelector('[data-geography-popup-slides]');
  const sliderElement = element.querySelector('[data-geography-popup-slider]');
  const prevButton = element.querySelector('[data-geography-popup-prev]');
  const nextButton = element.querySelector('[data-geography-popup-next]');

  const modalQuery = window.matchMedia(MODAL_QUERY);

  let swiper = null;
  let activePin = null;

  const isModal = () => modalQuery.matches;

  const fillContent = (pin) => {
    const id = pin.dataset.geographyPin;
    const cityName = pin.dataset.geographyCity || '';
    const vacancies = VACANCIES_BY_CITY[id] || [];
    const total = Number.parseInt(pin.dataset.geographyCount, 10) || vacancies.length;

    badge.textContent = String(total);
    city.textContent = cityName;
    count.textContent = `${total} ${pluralizeVacancies(total)}`;
    slidesHolder.innerHTML = vacancies.map(renderSlide).join('');
  };

  const buildSwiper = () => {
    if (swiper) {
      swiper.update();
      swiper.slideTo(0, 0);
      return;
    }

    swiper = new Swiper(sliderElement, {
      modules: [Navigation],
      slidesPerView: 'auto',
      spaceBetween: 10,
      speed: 400,
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
        disabledClass: 'swiper-button-disabled',
      },
    });
  };

  // В режиме «из пина» бейдж всплывашки должен лечь ровно на пин, где бы
  // сама панель ни оказалась после переворота и подгонки по краям.
  const positionAnchored = () => {
    if (!activePin) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const pinRect = activePin.getBoundingClientRect();
    const pinLeft = pinRect.left - rootRect.left;
    const pinTop = pinRect.top - rootRect.top;
    const badgeSize = pinRect.height;
    const overlap = 4;

    panel.style.left = '0px';
    panel.style.top = '0px';
    const panelWidth = panel.offsetWidth;
    const panelHeight = panel.offsetHeight;

    const flipX = pinLeft + 29 + panelWidth > rootRect.width;
    const flipY = pinTop + overlap + panelHeight > rootRect.height;

    let left = flipX ? pinLeft + 29 - panelWidth : pinLeft + 29;
    left = Math.max(0, Math.min(left, rootRect.width - panelWidth));

    let top = flipY
      ? pinTop + badgeSize - overlap - panelHeight
      : pinTop + overlap;
    top = Math.max(0, Math.min(top, rootRect.height - panelHeight));

    // Квадратным остаётся тот угол, из которого «вырос» попап — там лежит пин.
    const radius = flipY
      ? (flipX ? '33px 33px 0 33px' : '33px 33px 33px 0')
      : (flipX ? '33px 0 33px 33px' : '0 33px 33px 33px');

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.borderRadius = radius;
    panel.style.transformOrigin = `${flipX ? '100%' : '0'} ${flipY ? '100%' : '0'}`;

    marker.style.left = `${pinLeft - left}px`;
    marker.style.top = `${pinTop - top}px`;
  };

  const applyMode = () => {
    const modal = isModal();

    element.classList.toggle('geo-popup--modal', modal);
    panel.setAttribute('aria-modal', modal ? 'true' : 'false');

    if (modal) {
      panel.style.left = '';
      panel.style.top = '';
      panel.style.borderRadius = '';
      panel.style.transformOrigin = '';
      marker.style.left = '';
      marker.style.top = '';
      return;
    }

    positionAnchored();
  };

  const close = ({restoreFocus = true} = {}) => {
    if (!activePin) {
      return;
    }

    const pin = activePin;

    activePin = null;
    element.classList.remove('is-open');
    pin.classList.remove('is-open');
    pin.setAttribute('aria-expanded', 'false');

    const finish = () => {
      if (!activePin) {
        element.hidden = true;
      }
    };

    panel.addEventListener('transitionend', finish, {once: true});
    window.setTimeout(finish, 400);

    if (restoreFocus) {
      pin.focus();
    }
  };

  const open = (pin) => {
    if (activePin === pin) {
      close();
      return;
    }

    if (activePin) {
      activePin.classList.remove('is-open');
      activePin.setAttribute('aria-expanded', 'false');
    }

    activePin = pin;
    pin.classList.add('is-open');
    pin.setAttribute('aria-expanded', 'true');

    fillContent(pin);
    element.hidden = false;
    applyMode();
    buildSwiper();

    // Даём браузеру кадр на раскладку, иначе transition не проиграется.
    window.requestAnimationFrame(() => {
      if (!activePin) {
        return;
      }

      applyMode();
      element.classList.add('is-open');

      if (isModal()) {
        closeButton.focus();
      }
    });
  };

  const handleKeydown = (event) => {
    if (!activePin) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab' || !isModal()) {
      return;
    }

    const items = Array.from(panel.querySelectorAll(FOCUSABLE))
      .filter((item) => item.offsetParent !== null);

    if (!items.length) {
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleDocumentPointer = (event) => {
    if (!activePin || panel.contains(event.target)) {
      return;
    }

    if (activePin.contains(event.target)) {
      return;
    }

    close({restoreFocus: false});
  };

  const handleViewportChange = () => {
    if (activePin) {
      applyMode();
    }
  };

  closeButton.addEventListener('click', () => close());
  scrim.addEventListener('click', () => close({restoreFocus: false}));
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('pointerdown', handleDocumentPointer);
  window.addEventListener('resize', handleViewportChange);
  window.addEventListener('scroll', handleViewportChange, {passive: true});

  return {open, close};
}
