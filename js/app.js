function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('formSubmitBtn');
    const feedback = document.getElementById('formFeedback');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    feedback.className = 'form-feedback';
    feedback.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Sending...';

    feedback.className = 'form-feedback visible success';
    feedback.textContent = 'Thanks! You can reach me directly at leonmwangi595@gmail.com — I\'ll respond within 24 hours.';
    form.reset();

    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initScrollReveal();
  initActiveNav();
  initBackToTop();
  initProjectModals();
  initContactForm();
  initAnimatedLetters();
  initCursor();
});
