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
  initHeroCarousel();
  initScrollReveal();
});

/* ── THEME ───────────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('nellys_theme') || document.documentElement.getAttribute('data-theme') || 'light';
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

  /* Update logo image for optimal light/white vs dark background contrast */
  document.querySelectorAll('img[src*="nellys-logo"]').forEach(img => {
    img.src = theme === 'light' ? 'nellys-logo-light.svg' : 'nellys-logo-dark.svg';
  });
}

/* ── MOBILE MENU & DRAWER ────────────────────────────────── */
function initMobileMenu() {
  const menuBtn    = document.getElementById('mobile-menu-btn');
  const drawer     = document.getElementById('mobile-drawer');
  const closeBtn   = document.getElementById('close-drawer-btn');

  // Inject backdrop overlay if not already present in DOM
  let backdrop = document.querySelector('.drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    backdrop.classList.add('active');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
    backdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }
  backdrop.addEventListener('click', closeDrawer);

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });

  // Close drawer when any drawer nav link is tapped
  if (drawer) {
    drawer.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', closeDrawer);
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

  // Also highlight active page in mobile drawer
  document.querySelectorAll('#mobile-drawer nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('text-cyan-400', 'font-bold');
      link.classList.remove('text-slate-300');
    } else if (href !== 'login.html') {
      link.classList.remove('text-cyan-400', 'font-bold');
      link.classList.add('text-slate-300');
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
        item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
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

/* ── HERO BACKGROUND CAROUSEL (ALL PAGES) ───────────────── */
function initHeroCarousel() {
  if (window.__heroCarouselInitialized) return;
  const slidesEl = document.getElementById('slides');
  if (!slidesEl) return;
  const total = slidesEl.children.length;
  if (!total) return;

  window.__heroCarouselInitialized = true;
  let idx = 0;
  const interval = 6000;
  let timer;

  const updateDots = () => {
    const dots = document.querySelectorAll('#heroDots .dot, .dot');
    dots.forEach((d, i) => {
      if (i === idx) {
        d.classList.add('bg-cyan-500');
        d.classList.remove('bg-slate-300', 'dark:bg-slate-600');
      } else {
        d.classList.remove('bg-cyan-500');
        d.classList.add('bg-slate-300', 'dark:bg-slate-600');
      }
    });
  };

  const update = (i) => {
    idx = (i + total) % total;
    slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    updateDots();
    resetTimer();
  };

  const next = () => update(idx + 1);
  const prev = () => update(idx - 1);

  const resetTimer = () => {
    clearInterval(timer);
    if (total > 1) {
      timer = setInterval(next, interval);
    }
  };

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); next(); };
  if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); prev(); };

  const dots = document.querySelectorAll('#heroDots .dot, .dot');
  dots.forEach(d => {
    d.onclick = () => {
      const targetIdx = Number(d.dataset.index);
      if (!isNaN(targetIdx)) update(targetIdx);
    };
  });

  const heroSection = document.getElementById('hero') || slidesEl.closest('section');
  if (heroSection) {
    heroSection.onmouseenter = () => clearInterval(timer);
    heroSection.onmouseleave = resetTimer;

    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) next();
        else prev();
        resetTimer();
      }
    }, { passive: true });
  }

  updateDots();
  resetTimer();
}

/* ── SCROLL-TRIGGERED REVEAL ANIMATIONS (ALL PAGES - BIDIRECTIONAL) ──────── */
function initScrollReveal() {
  if (window.__scrollRevealInitialized) return;
  window.__scrollRevealInitialized = true;

  // Reduced motion preference check
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-enrich data-reveal-group children with reveal classes and staggered delays
  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    const children = group.querySelectorAll(
      ':scope > div, :scope > article, :scope > .stat-box, :scope > a, :scope > li'
    );
    children.forEach((child, i) => {
      const hasRevealClass = child.classList.contains('reveal-on-scroll') ||
                             child.classList.contains('reveal-from-left') ||
                             child.classList.contains('reveal-from-right') ||
                             child.classList.contains('reveal-scale');
      if (!hasRevealClass) {
        child.classList.add('reveal-on-scroll');
      }
      if (!child.style.transitionDelay && !child.className.includes('reveal-delay-')) {
        child.style.transitionDelay = `${(i % 8) * 80}ms`;
      }
    });
  });

  const revealTargets = Array.from(document.querySelectorAll(
    '[data-observe], .reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-scale, [data-reveal-group]'
  ));

  if (!revealTargets.length) return;

  function revealElement(target) {
    if (!target) return;
    if (target.classList.contains('is-revealed')) return;

    target.classList.add('is-revealed');

    if (target.hasAttribute('data-observe')) {
      target.classList.add('opacity-100', 'translate-y-0');
      target.classList.remove('opacity-0', 'translate-y-10');
    }

    // Stagger child cards if container is a reveal group
    if (target.hasAttribute('data-reveal-group')) {
      const childCards = target.querySelectorAll(
        ':scope > .reveal-on-scroll, :scope > .reveal-from-left, :scope > .reveal-from-right, :scope > .reveal-scale, :scope > div, :scope > article'
      );
      childCards.forEach((child, i) => {
        if (!child.style.transitionDelay && !child.className.includes('reveal-delay-')) {
          child.style.transitionDelay = `${(i % 8) * 80}ms`;
        }
        child.classList.add('is-revealed');
      });
    }

    // Special heading word-by-word blur reveal (engineer-heading)
    const words = target.querySelectorAll('#engineer-heading span');
    if (words.length) {
      words.forEach((w, i) => {
        w.style.transition = `all 400ms ease ${i * 100}ms`;
        w.classList.remove('blur-sm', 'opacity-0', 'translate-y-4');
        w.classList.add('blur-0', 'opacity-100', 'translate-y-0');
      });
    }

    // Paragraph inside engineer-section or data-observe
    const p = target.querySelector('#engineer-section p, [data-observe] p');
    if (p) {
      p.style.transition = 'opacity 350ms ease 450ms, transform 350ms ease 450ms';
      p.classList.remove('opacity-0', 'translate-y-4');
      p.classList.add('opacity-100', 'translate-y-0');
    }
  }

  function hideElement(target) {
    if (!target || !target.classList.contains('is-revealed')) return;

    // Reset offscreen cleanly with transitions disabled to prevent reverse animation glitches
    target.style.transition = 'none';
    target.classList.remove('is-revealed');

    if (target.hasAttribute('data-observe')) {
      target.classList.remove('opacity-100', 'translate-y-0');
      target.classList.add('opacity-0', 'translate-y-10');
    }

    if (target.hasAttribute('data-reveal-group')) {
      const childCards = target.querySelectorAll(
        ':scope > .reveal-on-scroll, :scope > .reveal-from-left, :scope > .reveal-from-right, :scope > .reveal-scale, :scope > div, :scope > article'
      );
      childCards.forEach(child => {
        child.style.transition = 'none';
        child.classList.remove('is-revealed');
        void child.offsetHeight;
        child.style.transition = '';
      });
    }

    const words = target.querySelectorAll('#engineer-heading span');
    if (words.length) {
      words.forEach(w => {
        w.style.transition = 'none';
        w.classList.remove('blur-0', 'opacity-100', 'translate-y-0');
        w.classList.add('blur-sm', 'opacity-0', 'translate-y-4');
        void w.offsetHeight;
        w.style.transition = '';
      });
    }

    const p = target.querySelector('#engineer-section p, [data-observe] p');
    if (p) {
      p.style.transition = 'none';
      p.classList.remove('opacity-100', 'translate-y-0');
      p.classList.add('opacity-0', 'translate-y-4');
      void p.offsetHeight;
      p.style.transition = '';
    }

    void target.offsetHeight;
    target.style.transition = '';
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => revealElement(el));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        revealElement(el);
      } else {
        const rect = el.getBoundingClientRect();
        // Only reset if completely offscreen (either scrolled past top or below bottom)
        if (rect.bottom < 40 || rect.top > vh - 20) {
          hideElement(el);
        }
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  revealTargets.forEach(el => revealObserver.observe(el));

  // Check elements already in the initial viewport
  function checkInitialViewport() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealTargets.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh - 20 && r.bottom > 10) {
        revealElement(el);
      }
    });
  }

  checkInitialViewport();
}
