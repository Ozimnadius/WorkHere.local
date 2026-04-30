const ACTIVE_CLASS = 'active';

const setActiveItem = (items, activeIndex, callback) => {
  items.forEach((item, index) => {
    callback(item, index === activeIndex, index);
  });
};

const initFeatureSection = (section) => {
  const tabs = Array.from(section.querySelectorAll('.feature-section__tab'));
  const panels = Array.from(section.querySelectorAll('.feature-section__panel'));
  const dots = Array.from(section.querySelectorAll('.feature-section__dot'));

  if (!tabs.length || tabs.length !== panels.length || tabs.length !== dots.length) {
    return;
  }

  const setActiveIndex = (activeIndex) => {
    setActiveItem(tabs, activeIndex, (tab, isActive) => {
      tab.classList.toggle(ACTIVE_CLASS, isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    setActiveItem(panels, activeIndex, (panel, isActive) => {
      panel.hidden = !isActive;
      panel.classList.toggle(ACTIVE_CLASS, isActive);
    });

    setActiveItem(dots, activeIndex, (dot, isActive) => {
      dot.classList.toggle(ACTIVE_CLASS, isActive);

      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActiveIndex(index));

    tab.addEventListener('keydown', (event) => {
      const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      const isPrevious = event.key === 'ArrowLeft' || event.key === 'ArrowUp';

      if (!isNext && !isPrevious) {
        return;
      }

      event.preventDefault();

      const direction = isNext ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;

      setActiveIndex(nextIndex);
      tabs[nextIndex].focus();
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => setActiveIndex(index));
  });

  const initialIndex = tabs.findIndex((tab) => tab.classList.contains(ACTIVE_CLASS));

  setActiveIndex(initialIndex >= 0 ? initialIndex : 0);
};

export function initFeatureSectionTabs() {
  document.querySelectorAll('.feature-section').forEach(initFeatureSection);
}
