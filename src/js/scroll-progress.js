const DEFAULT_START = 0;
const DEFAULT_END = 1;
const DEFAULT_SMOOTH = 1;
const DEFAULT_ACTIVATE_START = 0;
const SNAP_THRESHOLD = 0.0005;
const MODE_KEY_FEATURES_BADGE = 'key-features-badge';
const MODE_WORKHERE_AI_MEDIA = 'workhere-ai-media';
const BADGE_TARGET_TOP_IN_CONTENT = 120;
const BADGE_TARGET_HEIGHT = 62;
const BADGE_FINAL_OFFSET = 220;

const clamp = (value) => Math.min(1, Math.max(0, value));

const getNumberOption = (element, name, fallback) => {
  const value = Number.parseFloat(element.dataset[name]);

  return Number.isFinite(value) ? value : fallback;
};

const getSegmentProgress = (progress, from, to) => {
  if (to <= from) {
    return progress >= to ? 1 : 0;
  }

  return clamp((progress - from) / (to - from));
};

class ScrollProgress {
  constructor(element) {
    this.element = element;
    this.children = Array.from(element.querySelectorAll('[data-progress-child]'));
    this.animationFrame = null;
    this.currentProgress = 0;
    this.targetProgress = 0;

    this.start = getNumberOption(element, 'progressStart', DEFAULT_START);
    this.end = getNumberOption(element, 'progressEnd', DEFAULT_END);
    this.smooth = getNumberOption(element, 'progressSmooth', DEFAULT_SMOOTH);
    this.mode = element.dataset.progressMode || '';

    this.requestUpdate = this.requestUpdate.bind(this);
    this.render = this.render.bind(this);
  }

  init() {
    this.currentProgress = this.getProgress();
    this.targetProgress = this.currentProgress;
    this.applyProgress(this.currentProgress);

    window.addEventListener('scroll', this.requestUpdate, {passive: true});
    window.addEventListener('resize', this.requestUpdate);
  }

  getProgress() {
    if (this.mode === MODE_KEY_FEATURES_BADGE) {
      return this.getKeyFeaturesBadgeProgress();
    }

    if (this.mode === MODE_WORKHERE_AI_MEDIA) {
      return this.getWorkhereAiMediaProgress();
    }

    const rect = this.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const startOffset = rect.height * this.start;
    const endOffset = rect.height * this.end;
    const distance = endOffset - startOffset;

    if (distance <= 0) {
      return viewportHeight >= rect.top + endOffset ? 1 : 0;
    }

    const rawProgress = (viewportHeight - rect.top - startOffset) / distance;

    return rawProgress >= 0.999 ? 1 : clamp(rawProgress);
  }

  getKeyFeaturesBadgeProgress() {
    const rect = this.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const currentScrollY = window.scrollY || window.pageYOffset;
    const label = this.element.querySelector('.feature-section__badge-label');
    const content = this.element.closest('.feature-section')?.querySelector('.feature-section__content');
    const stickyCenterY = rect.top + viewportHeight / 2;
    const labelStartHeight = viewportHeight;
    const labelStartBottom = label
      ? stickyCenterY + labelStartHeight / 2
      : rect.top + viewportHeight;
    const start = currentScrollY + labelStartBottom - viewportHeight;
    const contentTargetTop = (
      viewportHeight / 2
      - BADGE_TARGET_TOP_IN_CONTENT
      - BADGE_TARGET_HEIGHT / 2
      + BADGE_FINAL_OFFSET
    );
    const end = content
      ? currentScrollY + content.getBoundingClientRect().top - contentTargetTop
      : start + viewportHeight / 1.66;
    const distance = end - start;

    if (distance <= 0) {
      return currentScrollY >= end ? 1 : 0;
    }

    const rawProgress = (currentScrollY - start) / distance;

    return rawProgress >= 0.999 ? 1 : clamp(rawProgress);
  }

  getWorkhereAiMediaProgress() {
    const rect = this.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const distance = rect.height - viewportHeight;

    if (distance <= 0) {
      return rect.top <= 0 ? 1 : 0;
    }

    const rawProgress = -rect.top / distance;

    return rawProgress >= 0.999 ? 1 : clamp(rawProgress);
  }

  requestUpdate() {
    this.targetProgress = this.getProgress();

    if (!this.animationFrame) {
      this.animationFrame = window.requestAnimationFrame(this.render);
    }
  }

  render() {
    this.currentProgress += (this.targetProgress - this.currentProgress) * this.smooth;

    if (Math.abs(this.targetProgress - this.currentProgress) < SNAP_THRESHOLD) {
      this.currentProgress = this.targetProgress;
    }

    this.applyProgress(this.currentProgress);

    if (this.currentProgress !== this.targetProgress) {
      this.animationFrame = window.requestAnimationFrame(this.render);
      return;
    }

    this.animationFrame = null;
  }

  applyProgress(progress) {
    this.element.style.setProperty('--progress', progress.toFixed(4));
    this.element.style.setProperty('--scene-progress', progress.toFixed(4));

    this.children.forEach((child) => {
      const from = getNumberOption(child, 'progressFrom', DEFAULT_START);
      const to = getNumberOption(child, 'progressTo', DEFAULT_END);
      const childProgress = getSegmentProgress(progress, from, to);

      child.style.setProperty('--progress', childProgress.toFixed(4));
    });
  }
}

class ProgressActivator {
  constructor(element) {
    this.element = element;
    this.start = getNumberOption(element, 'progressActivateStart', DEFAULT_ACTIVATE_START);
    this.isActive = false;
  }

  update() {
    if (this.isActive) {
      return;
    }

    const rect = this.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const activationPoint = rect.top + rect.height * this.start;

    if (viewportHeight > activationPoint) {
      this.element.classList.add('is-active');
      this.isActive = true;
    }
  }
}

export function initScrollProgress() {
  const activators = Array.from(document.querySelectorAll('[data-progress-activate]')).map((element) => {
    return new ProgressActivator(element);
  });

  const updateActivators = () => {
    activators.forEach((activator) => activator.update());
  };

  document.querySelectorAll('[data-progress]').forEach((element) => {
    new ScrollProgress(element).init();
  });

  updateActivators();

  window.addEventListener('scroll', updateActivators, {passive: true});
  window.addEventListener('resize', updateActivators);
}
