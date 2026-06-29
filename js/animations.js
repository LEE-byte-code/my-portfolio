function initScrollReveal() {
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = container.querySelectorAll('[data-reveal]');
          const delay = parseFloat(container.getAttribute('data-stagger')) || 0.1;
          children.forEach((child, idx) => {
            setTimeout(() => child.classList.add('revealed'), idx * delay * 1000);
          });
          observer.unobserve(container);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    observer.observe(container);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (!el.closest('[data-stagger]')) {
      observer.observe(el);
    }
  });
}

function initAnimatedLetters() {
  const el = document.querySelector('[data-animate-letters]');
  if (!el) return;

  const text = el.textContent;
  const chars = text.split('');
  el.innerHTML = '';
  const spans = chars.map((c) => {
    const span = document.createElement('span');
    span.textContent = c;
    if (c === ' ') span.style.display = 'inline';
    span.style.opacity = '0.2';
    el.appendChild(span);
    return span;
  });

  const total = chars.length;
  let raf = null;

  const handleScroll = () => {
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = Math.max(0, Math.min(1, 1 - (rect.top - 0.2 * viewH) / (rect.bottom - 0.8 * viewH)));
    spans.forEach((span, i) => {
      const charProgress = i / total;
      const start = Math.max(0, charProgress - 0.1);
      const end = Math.min(1, charProgress + 0.05);
      const p = (progress - start) / (end - start);
      span.style.opacity = String(Math.max(0.2, Math.min(1, p)));
    });
    raf = requestAnimationFrame(handleScroll);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!raf) raf = requestAnimationFrame(handleScroll);
    } else {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }
  }, { threshold: 0 });

  observer.observe(el);
}

function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  }, { passive: true });

  document.querySelectorAll('a, button, input, textarea, [data-project]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();
}
