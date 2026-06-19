async function initNavFooter() {
  try {
    const [navRes, footerRes] = await Promise.all([
      fetch('nav.html'),
      fetch('footer.html')
    ]);
    const navHtml = await navRes.text();
    const footerHtml = await footerRes.text();
    const navEl = document.getElementById('nav-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.innerHTML = navHtml;
    if (footerEl) footerEl.innerHTML = footerHtml;
  } catch {}
}

function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  if (window.scrollY > 60) header.classList.add('scrolled');
}

function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !e.target.closest('.header-inner')) {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains('skip-link')) return;
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id && id !== '#') {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          target.focus({ preventScroll: true });
        } else {
          window.location.href = window.location.pathname.replace(/\/[^/]*$/, '/') + 'index.html' + id;
        }
      }
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'section');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}
