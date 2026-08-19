import {createGeoPopup} from './geography-popup.js';

// Разброс появления пинов: «грибочки после дождя» — порядок случайный,
// шаг фиксированный, чтобы вся группа успевала за разумное время.
const PIN_DELAY_STEP = 0.07;
const DRAG_THRESHOLD = 5;

const FLIP_CLASS = 'geography__pin--plate-left';
const LAYOUT_PASSES = 3;

const shuffle = (items) => {
  const result = items.slice();

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const setupPinDelays = (pins) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    return;
  }

  shuffle(pins).forEach((pin, index) => {
    pin.style.setProperty('--pin-delay', `${(index * PIN_DELAY_STEP).toFixed(2)}s`);
  });
};

// Сторона раскрытия плашки. Пины стоят на своих городах, а плашки не сжимаются
// вместе с картой — на узких экранах они начинают наезжать друг на друга.
// Ничего не зашиваем в разметку: замеряем боксы и разворачиваем ровно те пины,
// которые иначе конфликтуют. При смене городов раскладка пересчитается сама.
// Считаем всегда от исходного состояния «все плашки вправо», иначе результат
// зависел бы от того, через какие ширины окно тянули до этого.
// Размеры берём замером, а не константами: на планшете и мобильном пин мельче.
const measurePins = (pins) => pins.map((pin) => {
  const plate = pin.querySelector('.geography__pin-plate');

  return {
    pin,
    left: pin.offsetLeft,
    top: pin.offsetTop,
    height: pin.offsetHeight,
    badge: pin.offsetWidth,
    offset: plate.offsetLeft,
    width: plate.offsetWidth,
    flipped: false,
  };
});

const boxOf = (item) => (item.flipped
  ? {left: item.left + item.badge - item.offset - item.width, right: item.left + item.badge}
  : {left: item.left, right: item.left + item.offset + item.width});

const overlaps = (a, b) => {
  const boxA = boxOf(a);
  const boxB = boxOf(b);

  return boxA.left < boxB.right
    && boxB.left < boxA.right
    && a.top < b.top + b.height
    && b.top < a.top + a.height;
};

// Пересечения весомее, чем выход за край карты: наезд читается как ошибка,
// а срезанная у края плашка — нет, карту можно потянуть.
const scoreLayout = (items, canvasWidth) => {
  let conflicts = 0;
  let outside = 0;

  for (let i = 0; i < items.length; i += 1) {
    const box = boxOf(items[i]);

    if (box.left < 0 || box.right > canvasWidth) {
      outside += 1;
    }

    for (let j = i + 1; j < items.length; j += 1) {
      if (overlaps(items[i], items[j])) {
        conflicts += 1;
      }
    }
  }

  return conflicts * 100 + outside;
};

const layoutPins = (pins, canvas) => {
  const canvasWidth = canvas.offsetWidth;

  if (!canvasWidth) {
    return;
  }

  pins.forEach((pin) => pin.classList.remove(FLIP_CLASS));

  const items = measurePins(pins);
  let best = scoreLayout(items, canvasWidth);

  // Жадный проход: разворачиваем пин, только если от этого стало лучше.
  for (let pass = 0; pass < LAYOUT_PASSES && best > 0; pass += 1) {
    let improved = false;

    items.forEach((item) => {
      item.flipped = !item.flipped;
      const score = scoreLayout(items, canvasWidth);

      if (score < best) {
        best = score;
        improved = true;
      } else {
        item.flipped = !item.flipped;
      }
    });

    if (!improved) {
      break;
    }
  }

  items.forEach((item) => item.pin.classList.toggle(FLIP_CLASS, item.flipped));
};

// Холст выше окна только на мобильном. Наводим стартовый кадр на сами пины,
// а не на середину холста: у карты сверху и снизу пустое море, и от его размера
// зависит, куда попадёт центр. Привязка к пинам не зависит от набора городов.
const focusPins = (viewport, pins) => {
  const extra = viewport.scrollHeight - viewport.clientHeight;

  if (extra <= 0 || !pins.length) {
    return;
  }

  const tops = pins.map((pin) => pin.offsetTop);
  const bottoms = pins.map((pin) => pin.offsetTop + pin.offsetHeight);
  const top = Math.min(...tops);
  const band = Math.max(...bottoms) - top;
  const target = band >= viewport.clientHeight
    ? top
    : top - (viewport.clientHeight - band) / 2;

  viewport.scrollTop = Math.round(Math.min(Math.max(target, 0), extra));
};

const setupPinLayout = (pins, canvas) => {
  const relayout = () => layoutPins(pins, canvas);

  relayout();

  // Ширина плашек зависит от шрифта — после его загрузки пересчитываем.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(relayout);
  }

  let frame = null;
  window.addEventListener('resize', () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }

    frame = window.requestAnimationFrame(() => {
      frame = null;
      relayout();
    });
  });
};

// Тяга карты мышью по обеим осям. На тач-устройствах хватает нативного overflow.
const setupDrag = (viewport) => {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startScrollX = 0;
  let startScrollY = 0;
  let moved = false;

  const stop = () => {
    if (pointerId === null) {
      return;
    }

    if (viewport.hasPointerCapture(pointerId)) {
      viewport.releasePointerCapture(pointerId);
    }

    pointerId = null;
    viewport.classList.remove('is-grabbing');
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    const scrollableX = viewport.scrollWidth > viewport.clientWidth;
    const scrollableY = viewport.scrollHeight > viewport.clientHeight;

    if (!scrollableX && !scrollableY) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScrollX = viewport.scrollLeft;
    startScrollY = viewport.scrollTop;
    moved = false;
  });

  viewport.addEventListener('pointermove', (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!moved) {
      if (Math.hypot(deltaX, deltaY) <= DRAG_THRESHOLD) {
        return;
      }

      moved = true;
      viewport.classList.add('is-grabbing');
      // Захват указателя ставим только когда карту реально потянули: если
      // захватить его на pointerdown, click уходит на окно карты, а не на пин,
      // и всплывашка города перестаёт открываться.
      viewport.setPointerCapture(pointerId);
    }

    viewport.scrollLeft = startScrollX - deltaX;
    viewport.scrollTop = startScrollY - deltaY;
  });

  viewport.addEventListener('pointerup', stop);
  viewport.addEventListener('pointercancel', stop);

  // Клик после протяжки не должен открывать всплывашку города.
  viewport.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }
  }, true);

  viewport.addEventListener('dragstart', (event) => event.preventDefault());
};

export function initGeography() {
  const root = document.querySelector('.geography');

  if (!root) {
    return;
  }

  const viewport = root.querySelector('[data-geography-viewport]');
  const pins = Array.from(root.querySelectorAll('[data-geography-pin]'));

  if (!pins.length) {
    return;
  }

  setupPinDelays(pins);

  const canvas = root.querySelector('.geography__canvas');

  if (canvas) {
    setupPinLayout(pins, canvas);
  }

  if (viewport) {
    setupDrag(viewport);
    focusPins(viewport, pins);
    window.addEventListener('resize', () => focusPins(viewport, pins));
  }

  const popup = createGeoPopup(root);

  pins.forEach((pin) => {
    pin.addEventListener('click', () => popup.open(pin));
  });
}
