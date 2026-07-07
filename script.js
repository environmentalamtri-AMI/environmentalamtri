const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || el.textContent);
    const start = performance.now();
    const duration = 850;
    const animate = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(el);
  });
}, { threshold: .8 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

const switchButtons = document.querySelectorAll('.company-switch button');
switchButtons.forEach(button => button.addEventListener('click', () => {
  switchButtons.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
}));

// Hero module slider — autoplay 4.6 seconds with smooth crossfade
(() => {
  const slider = document.querySelector('.hero-module-slider');
  if (!slider) return;

  const slides = [...slider.querySelectorAll('.hero-slide')];
  const tabs = [...slider.querySelectorAll('.slider-tab')];
  const prev = slider.querySelector('.slider-prev');
  const next = slider.querySelector('.slider-next');
  const currentLabel = slider.querySelector('[data-slider-current]');
  const progress = slider.querySelector('.slider-progress i');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interval = Number(slider.dataset.autoplay || 4600);
  let current = 0;
  let timer = null;
  let pointerStartX = null;

  slider.style.setProperty('--slide-duration', `${interval}ms`);

  const restartProgress = () => {
    if (!progress || reduceMotion) return;
    progress.style.animation = 'none';
    void progress.offsetWidth;
    progress.style.animation = `heroSlideProgress ${interval}ms linear forwards`;
  };

  const show = (index, userInitiated = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.tabIndex = active ? 0 : -1;
    });
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    if (currentLabel) currentLabel.textContent = String(current + 1).padStart(2, '0');
    restartProgress();
    if (userInitiated) restart();
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
    slider.classList.add('is-paused');
  };

  const start = () => {
    if (reduceMotion || document.hidden) return;
    if (timer) window.clearInterval(timer);
    slider.classList.remove('is-paused');
    timer = window.setInterval(() => show(current + 1), interval);
  };

  const restart = () => {
    stop();
    window.setTimeout(start, 80);
  };

  prev?.addEventListener('click', () => show(current - 1, true));
  next?.addEventListener('click', () => show(current + 1, true));
  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i, true)));

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', (event) => {
    if (!slider.contains(event.relatedTarget)) start();
  });

  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1, true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1, true);
    }
  });

  slider.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });
  slider.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(distance) < 50) return;
    show(current + (distance < 0 ? 1 : -1), true);
  });
  slider.addEventListener('pointercancel', () => { pointerStartX = null; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  show(0);
  start();
})();
