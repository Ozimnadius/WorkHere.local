const ANIMATION_DURATION = 1100;

const clearAnimationClasses = (card) => {
  card.classList.remove('is-leaving', 'is-entering');
};

export const initWorkhereAiCssAnimation = () => {
  const blocks = document.querySelectorAll('.workhere-ai');

  blocks.forEach((block) => {
    const cards = Array.from(block.querySelectorAll('.workhere-ai__details'));

    if (cards.length < 2) {
      return;
    }

    let isAnimating = false;

    block.addEventListener('click', (event) => {
      const activeCard = event.target.closest('.workhere-ai__details.active');

      if (!activeCard || !block.contains(activeCard) || isAnimating) {
        return;
      }

      const currentIndex = cards.indexOf(activeCard);
      const nextCard = cards[(currentIndex + 1) % cards.length];

      if (!nextCard || nextCard === activeCard) {
        return;
      }

      isAnimating = true;
      block.classList.add('is-css-animating');
      nextCard.classList.add('is-next');

      requestAnimationFrame(() => {
        activeCard.classList.add('is-leaving');
        nextCard.classList.add('is-entering');
      });

      window.setTimeout(() => {
        activeCard.classList.remove('active');
        nextCard.classList.remove('is-next');
        nextCard.classList.add('active');

        clearAnimationClasses(activeCard);
        clearAnimationClasses(nextCard);
        block.classList.remove('is-css-animating');

        isAnimating = false;
      }, ANIMATION_DURATION);
    });
  });
};
