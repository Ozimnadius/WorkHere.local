export function initHeaderScroll() {
  const header = document.querySelector('.page__header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('active', window.scrollY > 200);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}
