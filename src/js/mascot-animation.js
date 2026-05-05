const DEFAULT_TEXT = 'Привет! Нажми на меня 👋';
const HOVER_TEXT = 'Привет! Нажми на меня 👆😊';

const ACTIVE_PHRASES = [
  '✨ AI Power! ✨', '🚀 Поехали!', '💫 Магия найма!', '🔥 Вжух!',
  '⚡ Супер-сила!', '🌟 Автоматизация!', '🎯 В точку!', '💪 Мощь AI!',
];

const AFTER_PHRASES = [
  'Ещё раз? 😊', 'Понравилось? 🤩', 'Давай ещё! 🎯', 'Нажми снова! ✨',
  'Ещё хочешь? 😏', 'Круто, да? 🔥',
];

const ORBIT_PARTICLES = [...Array(12)].map((_, i) => ({
  radius: 120 + (i % 3) * 25,
  duration: 4 + (i % 3) * 0.8,
  delay: i * 0.15,
  size: 3 + (i % 3),
  reverse: i % 2 !== 0,
}));

export function initMascotAnimation() {
  const mascot = document.querySelector('.mascot');
  if (!mascot) return;

  const textEl = mascot.querySelector('.mascot__bubble-text');

  let isActive = false;
  let clickCount = 0;
  let activePhraseIdx = 0;
  let afterPhraseIdx = 0;
  let orbitEl = null;
  let activeTimer = null;

  function setText(text) {
    textEl.classList.add('is-exiting');
    setTimeout(() => {
      textEl.textContent = text;
      textEl.classList.remove('is-exiting');
      void textEl.offsetWidth;
    }, 150);
  }

  function createOrbit() {
    if (orbitEl) return;
    orbitEl = document.createElement('div');
    orbitEl.className = 'mascot__orbit';

    ORBIT_PARTICLES.forEach((p) => {
      const track = document.createElement('div');
      track.className = 'mascot__orbit-track' + (p.reverse ? ' mascot__orbit-track--rev' : '');
      const diameter = p.radius * 2;
      track.style.cssText = [
        `width:${diameter}px`,
        `height:${diameter}px`,
        `margin-left:${-p.radius}px`,
        `margin-top:${-p.radius}px`,
        `--orbit-duration:${p.duration}s`,
        `animation-delay:${-p.delay}s`,
      ].join(';');

      const dot = document.createElement('div');
      dot.className = 'mascot__orbit-dot';
      dot.style.setProperty('--dot-size', p.size + 'px');

      track.appendChild(dot);
      orbitEl.appendChild(track);
    });

    mascot.appendChild(orbitEl);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (orbitEl) orbitEl.style.opacity = '1';
    }));
  }

  function destroyOrbit() {
    if (!orbitEl) return;
    orbitEl.style.opacity = '0';
    const el = orbitEl;
    orbitEl = null;
    setTimeout(() => el.remove(), 350);
  }

  function createNeuralNetwork() {
    const ringDefs = [
      {count: 8, radius: 150},
      {count: 12, radius: 250},
      {count: 16, radius: 350},
    ];

    const nodes = [];
    ringDefs.forEach((ring, ri) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i * (360 / ring.count) + ri * 15) * (Math.PI / 180);
        nodes.push({
          x: Math.cos(angle) * ring.radius,
          y: Math.sin(angle) * ring.radius,
          ring: ri,
          delay: ri * 0.1 + i * 0.02,
        });
      }
    });

    const conns = [];
    for (let i = 0; i < 8; i++) {
      conns.push([i, 8 + (i * 2) % 12]);
      conns.push([i, 8 + (i * 2 + 1) % 12]);
    }
    for (let i = 0; i < 12; i++) {
      conns.push([8 + i, 20 + Math.floor(i * 16 / 12)]);
      conns.push([8 + i, 20 + (Math.floor(i * 16 / 12) + 1) % 16]);
    }
    for (let i = 0; i < 8; i++) conns.push([i, (i + 1) % 8]);
    for (let i = 0; i < 12; i++) conns.push([8 + i, 8 + (i + 1) % 12]);
    for (let i = 0; i < 16; i++) conns.push([20 + i, 20 + (i + 1) % 16]);

    const NS = 'http://www.w3.org/2000/svg';
    const SZ = 800;
    const HALF = SZ / 2;

    const mascotEl = document.querySelector('.mascot');
    const mRect = mascotEl.getBoundingClientRect();

    const svg = document.createElementNS(NS, 'svg');
    svg.style.cssText = [
      'position:absolute',
      `width:${SZ}px`, `height:${SZ}px`,
      `left:${mRect.width / 2 - HALF}px`, `top:${mRect.height / 2 - HALF}px`,
      'pointer-events:none', 'z-index:9',
      'overflow:visible',
    ].join(';');

    const defs = document.createElementNS(NS, 'defs');
    const filter = document.createElementNS(NS, 'filter');
    filter.setAttribute('id', 'ng');
    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '1.5');
    blur.setAttribute('result', 'cb');
    const merge = document.createElementNS(NS, 'feMerge');
    ['cb', 'SourceGraphic'].forEach(src => {
      const mn = document.createElementNS(NS, 'feMergeNode');
      mn.setAttribute('in', src);
      merge.appendChild(mn);
    });
    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);

    conns.forEach(([fi, ti]) => {
      const fn = nodes[fi];
      const tn = nodes[ti];
      if (!fn || !tn) return;
      const delay = (Math.max(fn.delay, tn.delay) + 0.05).toFixed(2);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', HALF + fn.x);
      line.setAttribute('y1', HALF + fn.y);
      line.setAttribute('x2', HALF + tn.x);
      line.setAttribute('y2', HALF + tn.y);
      line.setAttribute('stroke', fn.ring === 0 ? 'rgba(100,180,255,0.85)' : 'rgba(64,169,255,0.65)');
      line.setAttribute('stroke-width', fn.ring === 0 ? '2.5' : '1.5');
      line.setAttribute('filter', 'url(#ng)');
      line.style.animation = `mascot-neural-line 1.5s ease-out ${delay}s both`;
      svg.appendChild(line);
    });

    nodes.forEach((node) => {
      const r = node.ring === 0 ? 6 : node.ring === 1 ? 5 : 4;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', HALF + node.x);
      c.setAttribute('cy', HALF + node.y);
      c.setAttribute('r', r);
      c.setAttribute('fill', '#69c0ff');
      c.setAttribute('filter', 'url(#ng)');
      c.style.animation = `mascot-neural-node 1.5s ease-out ${node.delay.toFixed(2)}s both`;
      svg.appendChild(c);
    });

    mascotEl.appendChild(svg);
    setTimeout(() => svg.remove(), 2200);
  }

  function triggerExplosion() {
    const rect = mascot.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Screen flash
    const flash = document.createElement('div');
    flash.style.cssText = [
      'position:fixed', 'inset:0', 'pointer-events:none', 'z-index:9999',
      `background:radial-gradient(circle at ${cx}px ${cy}px,rgba(24,144,255,0.3) 0%,transparent 60%)`,
      'animation:mascot-flash 0.4s ease-out both',
    ].join(';');
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);

    // Shockwave rings
    for (let i = 0; i < 4; i++) {
      const size = 140;
      const ring = document.createElement('div');
      ring.style.cssText = [
        'position:fixed',
        `width:${size}px`, `height:${size}px`,
        `left:${cx - size / 2}px`, `top:${cy - size / 2}px`,
        'border-radius:50%', 'pointer-events:none', 'z-index:9998',
        'background:radial-gradient(circle,transparent 50%,rgba(24,144,255,0.4) 70%,transparent 100%)',
        `animation:mascot-shockwave 2s ease-out ${i * 0.12}s both`,
      ].join(';');
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 2200 + i * 120);
    }

    // Particle burst
    for (let i = 0; i < 36; i++) {
      const angle = (i * 10) * (Math.PI / 180);
      const distance = 140 + (i % 8) * 20;
      const size = 3 + (i % 4);
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const color = i % 4 === 0 ? '#fff' : '#40a9ff';
      const glow = i % 4 === 0 ? '0 0 8px rgba(255,255,255,0.8)' : 'none';

      const p = document.createElement('div');
      p.style.cssText = [
        'position:fixed',
        `width:${size}px`, `height:${size}px`,
        `left:${cx - size / 2}px`, `top:${cy - size / 2}px`,
        'border-radius:50%', 'pointer-events:none', 'z-index:9998',
        `background:${color}`, `box-shadow:${glow}`,
        `animation:mascot-particle 2s ease-out ${0.05 + (i % 8) * 0.02}s both`,
        `--tx:${tx}px`, `--ty:${ty}px`,
      ].join(';');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2200);
    }

    // Neural network SVG (паутина из узлов и связей)
    createNeuralNetwork();

    // "AI" text burst
    const aiText = document.createElement('div');
    aiText.textContent = 'AI';
    aiText.style.cssText = [
      'position:fixed',
      `left:${cx - 40}px`, `top:${cy - 40}px`,
      'width:80px', 'height:80px',
      'display:flex', 'align-items:center', 'justify-content:center',
      'font-size:3rem', 'font-weight:900', 'color:#fff',
      'text-shadow:0 0 30px rgba(24,144,255,0.9)',
      'pointer-events:none', 'z-index:9999',
      'animation:mascot-ai-text 1.5s ease-out 0.2s both',
    ].join(';');
    document.body.appendChild(aiText);
    setTimeout(() => aiText.remove(), 1800);
  }

  function injectKeyframes() {
    document.getElementById('mascot-explosion-keyframes')?.remove();
    const style = document.createElement('style');
    style.id = 'mascot-explosion-keyframes';
    style.textContent = `
      @keyframes mascot-flash {
        0%   { opacity: 0; }
        30%  { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes mascot-shockwave {
        0%   { transform: scale(1);  opacity: 0.9; }
        100% { transform: scale(10); opacity: 0; }
      }
      @keyframes mascot-particle {
        0%   { transform: translate(0,0) scale(0); opacity: 0; }
        20%  { transform: translate(calc(var(--tx)*0.3),calc(var(--ty)*0.3)) scale(2); opacity: 0.9; }
        100% { transform: translate(var(--tx),var(--ty)) scale(0); opacity: 0; }
      }
      @keyframes mascot-neural-line {
        0%   { opacity: 0; }
        20%  { opacity: 0.9; }
        60%  { opacity: 0.7; }
        100% { opacity: 0; }
      }
      @keyframes mascot-neural-node {
        0%   { opacity: 0; }
        25%  { opacity: 1; }
        65%  { opacity: 0.8; }
        100% { opacity: 0; }
      }
      @keyframes mascot-ai-text {
        0%   { transform: scale(0);   opacity: 0; }
        30%  { transform: scale(3);   opacity: 1; }
        70%  { transform: scale(2.5); opacity: 0.8; }
        100% { transform: scale(2);   opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  mascot.addEventListener('mouseenter', () => {
    if (isActive) return;
    if (clickCount === 0) setText(HOVER_TEXT);
    createOrbit();
  });

  mascot.addEventListener('mouseleave', () => {
    if (isActive) return;
    if (clickCount === 0) setText(DEFAULT_TEXT);
    destroyOrbit();
  });

  mascot.addEventListener('click', () => {
    if (isActive) return;
    isActive = true;
    clickCount++;

    destroyOrbit();
    mascot.classList.add('mascot--active');

    const phrase = ACTIVE_PHRASES[activePhraseIdx % ACTIVE_PHRASES.length];
    activePhraseIdx++;
    setText(phrase);
    triggerExplosion();

    clearTimeout(activeTimer);
    activeTimer = setTimeout(() => {
      isActive = false;
      mascot.classList.remove('mascot--active');
      const afterPhrase = AFTER_PHRASES[afterPhraseIdx % AFTER_PHRASES.length];
      afterPhraseIdx++;
      setText(afterPhrase);
    }, 3500);
  });

  mascot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      mascot.click();
    }
  });

  injectKeyframes();
}
