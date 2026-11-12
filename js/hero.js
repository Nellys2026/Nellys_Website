// -------------------------------------------------
// HERO CAROUSEL + SCROLL‑TRIGGERED REVEAL
// -------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Carousel ----------
  const slides   = document.getElementById('slides');
  const total    = slides.children.length;
  let   idx      = 0;
  const interval = 5000;               // 5 seconds
  let   timer;

  const update = (i) => {
    idx = (i + total) % total;
    slides.style.transform = `translateX(-${idx * 100}%)`;
    updateDots();
    resetTimer();
  };
  const next = () => update(idx + 1);
  const prev = () => update(idx - 1);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, interval);
  };

  // navigation buttons
  document.getElementById('nextBtn').onclick = next;
  document.getElementById('prevBtn').onclick = prev;

  // pagination dots
  const dots = document.querySelectorAll('.dot');
  const updateDots = () => {
    dots.forEach((d, i) => d.classList.toggle('bg-white/80', i === idx));
  };
  dots.forEach(d => d.onclick = () => update(Number(d.dataset.index)));

  // pause on hover
  const carousel = document.getElementById('carousel');
  carousel.onmouseenter = () => clearInterval(timer);
  carousel.onmouseleave = resetTimer;

  resetTimer();

  // ---------- Scroll‑triggered reveal ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');

        // animate heading words
        const words = entry.target.querySelectorAll('#engineer-heading span');
        words.forEach((w, i) => {
          w.style.transition = `all 400ms ease ${i * 100}ms`;
          w.classList.replace('blur-sm', 'blur-0');
          w.classList.replace('opacity-0', 'opacity-100');
          w.classList.replace('translate-y-4', 'translate-y-0');
        });

        // animate paragraph
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
