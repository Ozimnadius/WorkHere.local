const CARD_WIDTH = 723;
const CARD_HEIGHT = 715;
const UI_LEFT = 344;
const UI_TOP = 480.5;
const UI_WIDTH = 1232;
const UI_HEIGHT = 959;
const SCREEN_START = 7;
const SCREEN_END = 10.8333333333333;
const CURSOR_HIT_OFFSET = [-1.2, 4.9];

const cursorPositionKeyframes = [
  {time: 7.03333333333333, value: [1635.7894744873, 1256.84210205078]},
  {time: 9, value: [1091.05224609375, 1165.80381774902]},
];

const cursorOpacityKeyframes = [
  {time: 7, value: 0},
  {time: 7.6, value: 1},
];

const cursorScaleKeyframes = [
  {time: 9, value: 0.59},
  {time: 9.56666666666667, value: 0.59},
  {time: 9.73333333333333, value: 0.44},
  {time: 9.9, value: 0.59},
];

const currentCardPositionKeyframes = [
  {time: 9.93333333333333, value: [1155.98138427734, 950.49201965332]},
  {time: 10.7333333333333, value: [706.24169921875, 549.861831665039]},
];

const currentCardScaleKeyframes = [
  {time: 9.6, value: 1},
  {time: 9.76666666666667, value: 0.93},
  {time: 9.93333333333333, value: 1},
  {time: 10.5, value: 0.11},
];

const currentCardRotateKeyframes = [
  {time: 8.66666666666667, value: 0},
  {time: 9, value: -4},
];

const currentCardOpacityKeyframes = [
  {time: 10.5, value: 1},
  {time: 10.7333333333333, value: 0},
];

const nextCardScaleKeyframes = [
  {time: 10.1, value: 0},
  {time: 10.8333333333333, value: 0.971400156350765},
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const mix = (from, to, progress) => from + (to - from) * progress;

const easeInOutCubic = (value) => (
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
);

const interpolateKeyframes = (keyframes, time) => {
  if (time <= keyframes[0].time) {
    return keyframes[0].value;
  }

  const lastKeyframe = keyframes[keyframes.length - 1];

  if (time >= lastKeyframe.time) {
    return lastKeyframe.value;
  }

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const from = keyframes[index];
    const to = keyframes[index + 1];

    if (time < from.time || time > to.time) {
      continue;
    }

    const progress = easeInOutCubic(clamp((time - from.time) / (to.time - from.time)));

    if (Array.isArray(from.value)) {
      return from.value.map((value, valueIndex) => mix(value, to.value[valueIndex], progress));
    }

    return mix(from.value, to.value, progress);
  }

  return lastKeyframe.value;
};

const getProgress = (element) => {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue('--progress'));

  return Number.isFinite(value) ? clamp(value) : 0;
};

const setVariable = (element, name, value) => {
  element.style.setProperty(name, value);
};

const setPercentVariable = (element, name, value) => {
  setVariable(element, name, `${value.toFixed(2)}%`);
};

const setNumberVariable = (element, name, value) => {
  setVariable(element, name, value.toFixed(4));
};

const setDegreeVariable = (element, name, value) => {
  setVariable(element, name, `${value.toFixed(2)}deg`);
};

const getScreenTime = (progress) => mix(SCREEN_START, SCREEN_END, progress);

const getCardTranslate = (position) => {
  const initialPosition = currentCardPositionKeyframes[0].value;

  return [
    ((position[0] - initialPosition[0]) / CARD_WIDTH) * 100,
    ((position[1] - initialPosition[1]) / CARD_HEIGHT) * 100,
  ];
};

const getCursorPositionPercent = (position) => {
  return [
    ((position[0] - UI_LEFT) / UI_WIDTH) * 100 + CURSOR_HIT_OFFSET[0],
    ((position[1] - UI_TOP) / UI_HEIGHT) * 100 + CURSOR_HIT_OFFSET[1],
  ];
};

const applySceneProgress = (media, progress) => {
  const screenTime = getScreenTime(progress);
  const cursorPosition = interpolateKeyframes(cursorPositionKeyframes, screenTime);
  const cursorPositionPercent = getCursorPositionPercent(cursorPosition);
  const currentCardPosition = interpolateKeyframes(currentCardPositionKeyframes, screenTime);
  const currentCardTranslate = getCardTranslate(currentCardPosition);

  setPercentVariable(media, '--hand-x', cursorPositionPercent[0]);
  setPercentVariable(media, '--hand-y', cursorPositionPercent[1]);
  setNumberVariable(media, '--hand-scale', interpolateKeyframes(cursorScaleKeyframes, screenTime));
  setDegreeVariable(media, '--hand-rotate', 0);
  setNumberVariable(media, '--hand-opacity', interpolateKeyframes(cursorOpacityKeyframes, screenTime));

  setPercentVariable(media, '--card-current-x', currentCardTranslate[0]);
  setPercentVariable(media, '--card-current-y', currentCardTranslate[1]);
  setNumberVariable(media, '--card-current-scale', interpolateKeyframes(currentCardScaleKeyframes, screenTime));
  setDegreeVariable(media, '--card-current-rotate', interpolateKeyframes(currentCardRotateKeyframes, screenTime));
  setNumberVariable(media, '--card-current-opacity', interpolateKeyframes(currentCardOpacityKeyframes, screenTime));

  setPercentVariable(media, '--card-next-x', 0);
  setPercentVariable(media, '--card-next-y', 0);
  setNumberVariable(media, '--card-next-scale', interpolateKeyframes(nextCardScaleKeyframes, screenTime));
  setDegreeVariable(media, '--card-next-rotate', 0);
  setNumberVariable(media, '--card-next-opacity', screenTime >= nextCardScaleKeyframes[0].time ? 1 : 0);
};

const initScene = (stage) => {
  const media = stage.querySelector('.workhere-ai__media');

  if (!media) {
    return;
  }

  let previousProgress = -1;

  const tick = () => {
    const progress = getProgress(stage);

    if (Math.abs(progress - previousProgress) > 0.0001) {
      applySceneProgress(media, progress);
      previousProgress = progress;
    }

    requestAnimationFrame(tick);
  };

  applySceneProgress(media, getProgress(stage));
  requestAnimationFrame(tick);
};

export const initWorkhereAiAnimation = () => {
  document.querySelectorAll('.workhere-ai__media-stage[data-progress]').forEach(initScene);
};
