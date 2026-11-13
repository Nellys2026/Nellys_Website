// -------------------------------------------------
// HERO CAROUSEL + MULTI-LINE TYPEWRITER + SCROLL REVEAL
// -------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

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

  // ---------- Scroll‑triggered reveal ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');

        const words = entry.target.querySelectorAll('#engineer-heading span');
        words.forEach((w, i) => {
          w.style.transition = `all 400ms ease ${i * 100}ms`;
          w.classList.replace('blur-sm', 'blur-0');
          w.classList.replace('opacity-0', 'opacity-100');
          w.classList.replace('translate-y-4', 'translate-y-0');
        });

        const p = entry.target.querySelector('p');
        if (p) {
          p.style.transition = 'opacity 300ms ease 600ms, transform 300ms ease 600ms';
          p.classList.replace('opacity-0', 'opacity-100');
          p.classList.replace('translate-y-4', 'translate-y-0');
        }
      }
    });
  }, { threshold: 0.2 });

  const reveal = document.querySelector('[data-observe]');
  if (reveal) observer.observe(reveal);
});
