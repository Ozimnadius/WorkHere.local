export function initMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const openButton = document.querySelector('.header__burger-btn');

  if (!menu || !openButton) {
    return;
  }

  const closeButton = menu.querySelector('.mobile-menu__close');
  const featureToggle = menu.querySelector('.mobile-menu__toggle');
  const featureDropdown = menu.querySelector('.mobile-menu__dropdown');
  const mobileQuery = window.matchMedia('(max-width: 1199.98px)');

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.inert = true;
    openButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-mobile-menu-open');
  };

  const openMenu = () => {
    menu.classList.add('is-open');
    menu.inert = false;
    openButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-mobile-menu-open');
  };

  openButton.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) {
      closeMenu();
      return;
    }

    openMenu();
  });
  closeButton?.addEventListener('click', closeMenu);

  menu.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('.mobile-menu__close')) {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (target.closest('.mobile-menu a')) {
      closeMenu();
    }
  });

  featureToggle?.addEventListener('click', () => {
    if (!featureDropdown) {
      return;
    }

    const isOpen = featureToggle.getAttribute('aria-expanded') === 'true';
    featureToggle.setAttribute('aria-expanded', String(!isOpen));
    featureToggle.setAttribute(
      'aria-label',
      isOpen ? 'Показать подразделы возможностей' : 'Скрыть подразделы возможностей',
    );
    featureDropdown.hidden = isOpen;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });
}
