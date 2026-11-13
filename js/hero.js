// -------------------------------------------------
// HERO CAROUSEL + MULTI-LINE TYPEWRITER + SCROLL REVEAL
// -------------------------------------------------

function initHero() {
  if (window.__heroCarouselInitialized) return;
  window.__heroCarouselInitialized = true;

  // ---------- Background Carousel Track ----------
  const slidesEl = document.getElementById('slides');
  const total    = slidesEl ? slidesEl.children.length : 0;
  let   idx      = 0;
  const interval = 6000; // 6 seconds per background slide
  let   timer;

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
    if (!total) return;
    idx = (i + total) % total;
    if (slidesEl) {
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    }
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

  // Navigation buttons
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.onclick = (e) => { e.preventDefault(); next(); };
  if (prevBtn) prevBtn.onclick = (e) => { e.preventDefault(); prev(); };

  // Pagination dots
  const dots = document.querySelectorAll('#heroDots .dot, .dot');
  dots.forEach(d => {
    d.onclick = () => {
      const targetIdx = Number(d.dataset.index);
      if (!isNaN(targetIdx)) update(targetIdx);
    };
  });

  // Pause on hover over hero section
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.onmouseenter = () => clearInterval(timer);
    heroSection.onmouseleave = resetTimer;

    // Mobile touch swipe gestures for hero background slides
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) { // minimum swipe distance
        if (diff < 0) {
          next(); // swiped left -> next slide
        } else {
          prev(); // swiped right -> previous slide
        }
        resetTimer();
      }
    }, { passive: true });
  }

  // Initial kick-off
  updateDots();
  resetTimer();

  // ---------- Scroll‑triggered reveal (All Index Page Content - Bidirectional) ----------
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

  initScrollReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero);
} else {
  initHero();
}
