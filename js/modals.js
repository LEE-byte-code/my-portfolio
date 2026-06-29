let isModalOpen = false;
let prevFocus = null;

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  if (!modal || !closeBtn) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-project]');
    if (btn) {
      e.preventDefault();
      openModal(btn.getAttribute('data-project'));
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) closeModal();
    if (e.key === 'Tab' && isModalOpen) trapFocus(e);
  });
}

function trapFocus(e) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openModal(project) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  prevFocus = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  isModalOpen = true;

  requestAnimationFrame(() => {
    const cb = document.getElementById('modalClose');
    if (cb) cb.focus();
  });
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  isModalOpen = false;
  if (prevFocus) { prevFocus.focus(); prevFocus = null; }
  setTimeout(() => {
    if (!isModalOpen) {
      const body = document.getElementById('modalBody');
      if (body) body.innerHTML = '';
    }
  }, 300);
}


