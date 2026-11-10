/* Nellys Technologies — main.js
   Theme driven by [data-theme] attribute on <html>
   Saves to localStorage key: nellys_theme
*/

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  setActiveNavLink();
  initModals();
  initFilters();
  initCoworkingCalculator();
  initContactForm();
});

/* ── THEME ───────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('nellys_theme') || 'dark';
  applyTheme(saved);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  localStorage.setItem('nellys_theme', theme);

  /* Update icon on every toggle button */
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      btn.className = 'theme-toggle-btn w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-all hover:border-amber-400/60 shadow-sm';
      icon.className = 'fas fa-sun text-amber-400 text-base';
      btn.title = 'Switch to Light Theme';
    } else {
      btn.className = 'theme-toggle-btn w-9 h-9 rounded-xl bg-white border border-slate-300 flex items-center justify-center transition-all hover:border-indigo-400 shadow-sm';
      icon.className = 'fas fa-moon text-indigo-600 text-base';
      btn.title = 'Switch to Dark Theme';
    }
  });
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
function initMobileMenu() {
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const drawer     = document.getElementById('mobile-drawer');
  const closeBtn   = document.getElementById('close-drawer-btn');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
    });
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('translate-x-full');
      drawer.classList.remove('translate-x-0');
    });
  }
}

/* ── ACTIVE NAV ──────────────────────────────────────────── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active', 'font-semibold');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ── MODALS ──────────────────────────────────────────────── */
function initModals() {
  window.openModal = modalId => {
    const m = document.getElementById(modalId);
    if (!m) return;
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = modalId => {
    const m = document.getElementById(modalId);
    if (!m) return;
    m.classList.add('hidden');
    m.classList.remove('flex');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ── FILTERS ─────────────────────────────────────────────── */
function initFilters() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.filter-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.category === cat) ? 'block' : 'none';
      });
    });
  });
}

/* ── CO-WORKING CALCULATOR ───────────────────────────────── */
function initCoworkingCalculator() {
  const deskType   = document.getElementById('calc-desk-type');
  const deskCount  = document.getElementById('calc-desk-count');
  const duration   = document.getElementById('calc-duration');
  const totalEl    = document.getElementById('calc-total-price');
  if (!deskType || !deskCount || !duration || !totalEl) return;

  const rates = { hot_desk: 150, dedicated_desk: 280, private_cabin: 500, server_rack: 450 };

  function calc() {
    const count    = parseInt(deskCount.value) || 1;
    const months   = parseInt(duration.value)  || 1;
    const base     = rates[deskType.value]     || 200;
    const discount = months >= 12 ? 0.80 : months >= 6 ? 0.90 : 1.0;
    totalEl.textContent = `$${Math.round(count * base * months * discount).toLocaleString()} USD`;
  }

  [deskType, deskCount, duration].forEach(el => el.addEventListener('change', calc));
  deskCount.addEventListener('input', calc);
  calc();
}

/* ── CONTACT FORM ────────────────────────────────────────── */
function initContactForm() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast(`Thank you! Your ${form.dataset.formName || 'Inquiry'} was received. We'll be in touch shortly.`, 'success');
      form.reset();
      const modal = form.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });
}

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm';
    document.body.appendChild(container);
  }

  const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-cyan-600' };
  const icons  = { success: 'fa-circle-check', error: 'fa-triangle-exclamation', info: 'fa-circle-info' };

  const toast = document.createElement('div');
  toast.className = `${colors[type] || colors.info} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium transition-all duration-300 translate-y-4 opacity-0`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info} text-lg"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
