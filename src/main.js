import './scss/main.scss';

const interfaceSection = document.querySelector('.interface-section');

if (interfaceSection) {
  let ticking = false;

  function clamp(value) {
    return Math.min(1, Math.max(0, value));
  }

  function updateInterfaceProgress() {
    const rect = interfaceSection.getBoundingClientRect();

    const distance = window.innerHeight;
    const current = window.innerHeight - rect.top;

    const progress = clamp(current / distance);
    const easedProgress = 1 - Math.pow(1 - progress, 2);

    interfaceSection.style.setProperty('--progress', easedProgress.toFixed(4));

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateInterfaceProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  updateInterfaceProgress();
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href');

    if (!id || id === '#') {
      return;
    }

    const target = document.querySelector(id);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-form]').forEach((form) => {
  const input = form.querySelector('input[type="email"]');
  const message = form.querySelector('[data-form-message]');

  if (!input || !message) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const value = input.value.trim();
    form.classList.remove('lead-form--error', 'lead-form--success');

    if (!value) {
      form.classList.add('lead-form--error');
      message.textContent = '* Заполните обязательное поле';
      input.focus();
      return;
    }

    if (!emailPattern.test(value)) {
      form.classList.add('lead-form--error');
      message.textContent = '* Введите корректную эл. почту';
      input.focus();
      return;
    }

    form.classList.add('lead-form--success');
    message.textContent = 'Заявка подготовлена. Мы свяжемся с вами после подключения формы.';
    input.value = '';
  });

  input.addEventListener('input', () => {
    if (!form.classList.contains('lead-form--error')) {
      return;
    }

    form.classList.remove('lead-form--error');
    message.textContent = '';
  });
});
