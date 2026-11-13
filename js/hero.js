// -------------------------------------------------
// HERO CAROUSEL + MULTI-LINE TYPEWRITER + SCROLL REVEAL
// -------------------------------------------------

function initHero() {

  // ---------- Slide captions ----------
  // Each slide has a heading (with a gradient portion), subtitle, and body.
  const captions = [
    {
      heading:  "Engineering tomorrow\u2019s ",
      gradient: "intelligent tech ecosystems.",
      subtitle: "Technology that runs your business. Visibility that grows it.",
      body:     "At Nellys Tech, software engineers, cloud and security specialists work alongside brand, content, and marketing experts. One unified team in Thiruvananthapuram \u2014 solutions built around your business."
    },
    {
      heading:  "Powering your ",
      gradient: "digital transformation.",
      subtitle: "From strategy to execution, one team delivers it all.",
      body:     "We combine deep technical expertise with creative brand thinking. Twenty capabilities, two pillars, one direction \u2014 everything built around your business."
    },
    {
      heading:  "Building secure ",
      gradient: "cloud-native solutions.",
      subtitle: "Enterprise-grade technology. Start-up agility.",
      body:     "Custom software, managed cloud infrastructure, cybersecurity and DevOps \u2014 every layer of your IT ecosystem built around your business."
    }
  ];

  // ---------- DOM refs ----------
  const twHeading  = document.getElementById('tw-heading');
  const twSubtitle = document.getElementById('tw-subtitle');
  const twBody     = document.getElementById('tw-body');
  const twCursor   = document.getElementById('typewriter-cursor');

  let typeTimer = null;

  // Moves the blinking cursor to immediately follow whichever element is currently typing
  function attachCursorTo(parentEl) {
    if (twCursor && parentEl) {
      parentEl.appendChild(twCursor);
    }
  }

  // ---------- Typewriter engine ----------
  // Types a sequence of { el, text, isGradient } segments sequentially
  function typeSequence(segments, onDone) {
    let segIdx  = 0;
    let charIdx = 0;
    const speed = 25; // ms per character for smooth reading speed

    // Clear all target elements
    segments.forEach(s => { s.el.innerHTML = ''; });

    function tick() {
      if (segIdx >= segments.length) {
        if (onDone) onDone();
        return;
      }

      const seg  = segments[segIdx];
      const text = seg.text;

      // Ensure cursor follows active typing container
      attachCursorTo(seg.cursorContainer || seg.el);

      if (charIdx <= text.length) {
        const typed = text.substring(0, charIdx);

        if (seg.isGradient) {
          seg.el.innerHTML = seg.plainHtml + '<span class="typed-gradient">' + escapeHtml(typed) + '</span>';
        } else {
          seg.el.textContent = typed;
        }

        // Re-attach cursor right after text update
        attachCursorTo(seg.cursorContainer || seg.el);

        charIdx++;
        typeTimer = setTimeout(tick, speed);
      } else {
        // Segment done, proceed to next
        segIdx++;
        charIdx = 0;
        typeTimer = setTimeout(tick, speed);
      }
    }

    tick();
  }

  function clearTypewriter() {
    if (typeTimer) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Build typing segments for a given caption
  function buildSegments(caption) {
    const headingParent = document.getElementById('hero-heading');
    const bodyParent    = document.getElementById('hero-body-paragraph');

    return [
      // 1) heading plain part
      { el: twHeading, text: caption.heading, isGradient: false, cursorContainer: headingParent },
      // 2) heading gradient part
      { el: twHeading, text: caption.gradient, isGradient: true, plainHtml: escapeHtml(caption.heading), cursorContainer: headingParent },
      // 3) subtitle
      { el: twSubtitle, text: caption.subtitle, isGradient: false },
      // 4) body paragraph right up to "...built around your business."
      { el: twBody, text: caption.body, isGradient: false, cursorContainer: bodyParent }
    ];
  }

  function startTypewriter(captionIdx) {
    clearTypewriter();
    twHeading.innerHTML  = '';
    twSubtitle.innerHTML = '';
    twBody.innerHTML     = '';
    const segments = buildSegments(captions[captionIdx % captions.length]);
    typeSequence(segments);
  }

  // ---------- Carousel ----------
  const slidesEl = document.getElementById('slides');
  const total    = slidesEl ? slidesEl.children.length : 0;
  let   idx      = 0;
  const interval = 12000; // 12 seconds per slide (gives full typewriter sequence time to complete)
  let   timer;

  const update = (i) => {
    idx = (i + total) % total;
    if (slidesEl) {
      slidesEl.style.transform = `translateX(-${idx * 100}%)`;
    }
    updateDots();
    startTypewriter(idx);
    resetTimer();
  };

  const next = () => update(idx + 1);
  const prev = () => update(idx - 1);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, interval);
  };

  // Navigation buttons
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.onclick = next;
  if (prevBtn) prevBtn.onclick = prev;

  // Pagination dots
  const dots = document.querySelectorAll('.dot');
  const updateDots = () => {
    dots.forEach((d, i) => d.classList.toggle('bg-white/80', i === idx));
  };
  dots.forEach(d => d.onclick = () => update(Number(d.dataset.index)));

  // Pause on hover
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.onmouseenter = () => clearInterval(timer);
    carousel.onmouseleave = resetTimer;
  }

  // Initial kick-off
  startTypewriter(0);
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
