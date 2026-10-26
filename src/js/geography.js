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
    badge: pin.offsetWidth,
    badgeHeight: pin.offsetHeight,
    plateOffset: plate.offsetLeft,
    plateTop: pin.offsetTop + plate.offsetTop,
    plateWidth: plate.offsetWidth,
    plateHeight: plate.offsetHeight,
    flipped: false,
  };
});

// Кружок и плашка меряются порознь: плашка ниже и короче кружка, и если взять
// их одним боксом, соседи «конфликтуют» там, где на экране просвет.
const circleRect = (item) => ({
  left: item.left,
  right: item.left + item.badge,
  top: item.top,
  bottom: item.top + item.badgeHeight,
});

const plateRect = (item) => {
  const right = item.flipped
    ? item.left + item.badge - item.plateOffset
    : item.left + item.plateOffset + item.plateWidth;

  return {
    left: right - item.plateWidth,
    right,
    top: item.plateTop,
    bottom: item.plateTop + item.plateHeight,
  };
};

const intersection = (a, b) => {
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);

  return width > 0 && height > 0 ? width * height : 0;
};

// Кружки стоят на своих городах и разойтись не могут, поэтому их пересечение
// между собой не считаем: двигать всё равно нечего. Считаем только то, что
// лечится разворотом, — наезд плашки на чужую плашку или на чужой кружок.
const overlapArea = (a, b) => {
  const plateA = plateRect(a);
  const plateB = plateRect(b);

  return intersection(plateA, plateB)
    + intersection(plateA, circleRect(b))
    + intersection(plateB, circleRect(a));
};

const outsideArea = (item, canvasWidth) => {
  const plate = plateRect(item);
  const cut = Math.max(0, -plate.left) + Math.max(0, plate.right - canvasWidth);

  return cut * item.plateHeight;
};

// Считаем не количество бед, а их размер. Соседние города иногда стоят так
// близко, что совсем развести плашки нельзя: при счёте по штукам разворот,
// который уменьшает наезд в разы, не улучшал оценку, и раскладка оставалась
// худшей из возможных. Площадь же видит разницу между «краем задел» и
// «накрыл целиком».
// Срезанная краем карты плашка весомее наезда: наезд читается как слоистость,
// а обрезанный текст — как ошибка.
const OUTSIDE_WEIGHT = 2;

const scoreLayout = (items, canvasWidth) => {
  let score = 0;

  for (let i = 0; i < items.length; i += 1) {
    score += outsideArea(items[i], canvasWidth) * OUTSIDE_WEIGHT;

    for (let j = i + 1; j < items.length; j += 1) {
      score += overlapArea(items[i], items[j]);
    }
  }

  return score;
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

// Отступ от края окна, когда пины в него не помещаются: иначе крайний из них
// прилипает к границе и выглядит обрезанным.
const FOCUS_EDGE = 16;

// Наводим стартовый кадр на сами пины, а не на середину холста: вокруг карты
// пустые поля, и от их размера зависит, куда попадёт центр. По горизонтали это
// важнее всего — у карт разных стран поля разные, и кадр с краю холста мог
// открываться на пустом месте. Привязка к пинам не зависит от набора городов.
const focusAxis = (band, windowSize, extra) => {
  if (extra <= 0) {
    return 0;
  }

  const size = band.max - band.min;
  const target = size >= windowSize
    ? band.min - FOCUS_EDGE
    : band.min - (windowSize - size) / 2;

  return Math.round(Math.min(Math.max(target, 0), extra));
};

const focusPins = (viewport, pins) => {
  if (!pins.length) {
    return;
  }

  // Плашка может быть развёрнута влево, поэтому границу берём по ней, а не по
  // одному кружку: иначе крайний город уедет за кадр вместе с подписью.
  const spans = pins.map((pin) => {
    const plate = pin.querySelector('.geography__pin-plate');
    const plateLeft = pin.offsetLeft + plate.offsetLeft;

    return {
      left: Math.min(pin.offsetLeft, plateLeft),
      right: Math.max(pin.offsetLeft + pin.offsetWidth, plateLeft + plate.offsetWidth),
      top: pin.offsetTop,
      bottom: pin.offsetTop + pin.offsetHeight,
    };
  });

  const across = {
    min: Math.min(...spans.map((span) => span.left)),
    max: Math.max(...spans.map((span) => span.right)),
  };
  const down = {
    min: Math.min(...spans.map((span) => span.top)),
    max: Math.max(...spans.map((span) => span.bottom)),
  };

  viewport.scrollLeft = focusAxis(
    across,
    viewport.clientWidth,
    viewport.scrollWidth - viewport.clientWidth,
  );
  viewport.scrollTop = focusAxis(
    down,
    viewport.clientHeight,
    viewport.scrollHeight - viewport.clientHeight,
  );
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
