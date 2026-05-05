const SCENE_DURATION = 7.2;
const SCENE_RISE_DURATION = 6;
const SCENE_CENTER_Y = 715;
const SCENE_START_Y = 715;
const SCENE_END_Y = 407;
const SCENE_SCALE = 1.08;
const SCENE_ROTATION_SPEED = 80;
const LAPTOP_MEDIA_QUERY = '(max-width: 1799.98px)';
const ORBIT_X_SCALE = 0.9;
const ORBIT_DEPTH_SCALE = 0.5;
const LOGO_PULSE_DURATION = 11.9666666666667;
const AI_PETALS_CENTER_X = 194.827;
const AI_PETALS_CENTER_Y = 180.202;
const AI_PETALS_SCALE_KEYFRAMES = [
  [0, 1],
  [3, 0.9],
  [6, 1],
  [9, 0.9],
  [LOGO_PULSE_DURATION, 1],
];
const aiConfig = {
  position: [0, 0, 0],
};

const cardsConfig = [
  {
    selector: '.ai-stage__card--expertise',
    position: [-498.9692, 88.5963, 215.2098],
    scale: 0.52,
    xScale: 0.9,
    depthScale: 0.5,
    rotateY: 0,
    xlg: {
      scale: 0.46,
      xScale: 0.72,
      depthScale: 0.42,
    },
    opacity: [
      [-0.0667, 0],
      [0.5667, 1],
      [2.7667, 1],
      [3.2333, 0],
    ],
  },
  {
    selector: '.ai-stage__card--clients',
    position: [266.5801, 169.2130, 355.5573],
    scale: 0.5653,
    xScale: 0.9,
    depthScale: 0.5,
    rotateY: 0,
    xlg: {
      scale: 0.5,
      xScale: 0.78,
      depthScale: 0.42,
    },
    opacity: [
      [0.3, 0],
      [0.7667, 1],
      [4.0667, 1],
      [4.6, 0],
    ],
  },
  {
    selector: '.ai-stage__card--recruiters',
    position: [429.6892, 106.1756, -91.2314],
    scale: 0.5453,
    xScale: 0.9,
    depthScale: 0.42,
    rotateY: 0,
    xlg: {
      scale: 0.49,
      xScale: 0.72,
      depthScale: 0.36,
    },
    opacity: [
      [0.9333, 0],
      [1.3333, 1],
      [4.8, 1],
      [5.3667, 0],
    ],
  },
  {
    selector: '.ai-stage__card--years',
    position: [-107.0693, 396.1177, -302.8389],
    scale: 0.5153,
    xScale: 1.5,
    depthScale: 0.8,
    rotateY: 0,
    xlg: {
      scale: 0.46,
      xScale: 1,
      depthScale: 0.55,
    },
    opacity: [
      [2.1667, 0],
      [3.6667, 1],
      [5.7333, 1],
      [6.2667, 0],
    ],
  },
  {
    selector: '.ai-stage__card--candidates',
    position: [-499.9179, 232.9113, -12.2544],
    scale: 0.4876,
    xScale: 0.75,
    depthScale: 0.45,
    rotateY: 5.4518,
    xlg: {
      scale: 0.43,
      xScale: 0.62,
      depthScale: 0.38,
    },
    opacity: [
      [3.3, 0],
      [4.0667, 1],
      [6.6, 1],
      [7.1667, 0],
    ],
  },
];

const clamp = (value) => Math.min(1, Math.max(0, value));

const lerp = (from, to, progress) => from + (to - from) * progress;

const readProgress = (element) => {
  const value = Number.parseFloat(element.style.getPropertyValue('--scene-progress'));

  return Number.isFinite(value) ? clamp(value) : 0;
};

const getTimelineValue = (time, keyframes) => {
  if (time <= keyframes[0][0]) {
    return keyframes[0][1];
  }

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const [fromTime, fromValue] = keyframes[index];
    const [toTime, toValue] = keyframes[index + 1];

    if (time >= fromTime && time <= toTime) {
      const distance = toTime - fromTime;
      const progress = distance > 0 ? (time - fromTime) / distance : 0;

      return lerp(fromValue, toValue, progress);
    }
  }

  return keyframes[keyframes.length - 1][1];
};

const getSceneY = (time) => {
  const progress = clamp(time / SCENE_RISE_DURATION);
  const y = lerp(SCENE_START_Y, SCENE_END_Y, progress);

  return y - SCENE_CENTER_Y;
};

const getResponsiveCardConfig = (config, isLaptop) => {
  if (!isLaptop || !config.xlg) {
    return config;
  }

  return {
    ...config,
    ...config.xlg,
  };
};

const setCardStyles = (element, config, time, sceneRotateY, isLaptop) => {
  const responsiveConfig = getResponsiveCardConfig(config, isLaptop);
  const [x, y, z] = responsiveConfig.position;
  const opacity = getTimelineValue(time, responsiveConfig.opacity);
  const facingRotateY = responsiveConfig.rotateY - sceneRotateY;
  const xScale = responsiveConfig.xScale ?? ORBIT_X_SCALE;
  const depthScale = responsiveConfig.depthScale ?? ORBIT_DEPTH_SCALE;

  element.style.setProperty('--card-x', `${(x * xScale).toFixed(2)}px`);
  element.style.setProperty('--card-y', `${y.toFixed(2)}px`);
  element.style.setProperty('--card-z', `${(-z * depthScale).toFixed(2)}px`);
  element.style.setProperty('--card-scale', responsiveConfig.scale.toFixed(4));
  element.style.setProperty('--card-opacity', opacity.toFixed(4));
  element.style.setProperty('--card-facing-rotate-y', `${facingRotateY.toFixed(4)}deg`);
};

const setAiStyles = (element, sceneRotateY, sceneY) => {
  const [x, y, z] = aiConfig.position;
  const compensatedY = y - sceneY / SCENE_SCALE;

  element.style.setProperty('--ai-x', `${x.toFixed(2)}px`);
  element.style.setProperty('--ai-y', `${compensatedY.toFixed(2)}px`);
  element.style.setProperty('--ai-z', `${(-z).toFixed(2)}px`);
  element.style.setProperty('--ai-facing-rotate-y', `${(-sceneRotateY).toFixed(4)}deg`);
};

const setAiPetalsStyles = (element, time) => {
  const logoPulseTime = Math.min(time, LOGO_PULSE_DURATION);
  const rotate = lerp(0, -360, logoPulseTime / LOGO_PULSE_DURATION);
  const scale = getTimelineValue(logoPulseTime, AI_PETALS_SCALE_KEYFRAMES);

  element.setAttribute(
    'transform',
    `translate(${AI_PETALS_CENTER_X} ${AI_PETALS_CENTER_Y}) ` +
      `rotate(${rotate.toFixed(4)}) ` +
      `scale(${scale.toFixed(4)}) ` +
      `translate(${-AI_PETALS_CENTER_X} ${-AI_PETALS_CENTER_Y})`,
  );
};

export function initAiStageWhirl() {
  const stage = document.querySelector('.ai-stage');

  if (!stage) {
    return;
  }

  const cardsContainer = stage.querySelector('.ai-stage__cards');
  const ai = stage.querySelector('.ai-stage__ai');
  const aiPetals = stage.querySelector('.ai-stage__ai-petals');

  if (!cardsContainer || !ai) {
    return;
  }

  const cards = cardsConfig
    .map((config) => {
      return {
        element: stage.querySelector(config.selector),
        config,
      };
    })
    .filter((card) => card.element);

  if (!cards.length) {
    return;
  }

  let animationFrame = null;
  const laptopMedia = window.matchMedia(LAPTOP_MEDIA_QUERY);

  const render = () => {
    const progress = readProgress(stage);
    const time = progress * SCENE_DURATION;
    const rotateY = SCENE_ROTATION_SPEED * time;
    const sceneY = getSceneY(time);
    const isLaptop = laptopMedia.matches;

    cardsContainer.style.transform = `
      translate3d(-50%, calc(-50% + ${sceneY.toFixed(2)}px), 0)
      scale(${SCENE_SCALE})
      rotateY(${rotateY.toFixed(2)}deg)
    `;

    setAiStyles(ai, rotateY, sceneY);

    if (aiPetals) {
      setAiPetalsStyles(aiPetals, time);
    }

    cards.forEach(({element, config}) => {
      setCardStyles(element, config, time, rotateY, isLaptop);
    });

    animationFrame = window.requestAnimationFrame(render);
  };

  render();

  window.addEventListener('pagehide', () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
}
