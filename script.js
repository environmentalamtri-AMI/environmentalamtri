const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = Boolean(window.gsap && window.ScrollTrigger);

function initFallbackReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initFallbackCounters() {
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
}

function initGsapAnimations() {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-active');

  const revealElements = gsap.utils.toArray('.reveal');
  gsap.set(revealElements, { autoAlpha: 1, y: 0 });

  const mark = (targets) => {
    gsap.utils.toArray(targets).forEach(el => { el.dataset.gsapAnimated = 'true'; });
  };

  const fromScroll = (targets, vars = {}, trigger = null) => {
    const elements = gsap.utils.toArray(targets);
    if (!elements.length) return null;
    mark(elements);
    return gsap.from(elements, {
      autoAlpha: 0,
      y: 28,
      duration: 0.82,
      ease: 'power3.out',
      stagger: elements.length > 1 ? 0.1 : 0,
      clearProps: 'transform,opacity,visibility',
      ...vars,
      scrollTrigger: {
        trigger: trigger || elements[0],
        start: 'top 84%',
        once: true,
        ...vars.scrollTrigger,
      },
    });
  };

  if (prefersReducedMotion) {
    gsap.set(revealElements, { autoAlpha: 1, y: 0, x: 0, scale: 1, clearProps: 'all' });
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = el.dataset.count || el.textContent;
    });
    return;
  }

  // Hero entrance: editorial, quick, and restrained.
  gsap.set('.hero-copy, .hero-module-slider', { autoAlpha: 1, y: 0 });
  mark(['.hero-copy', '.hero-module-slider']);
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-kicker', { autoAlpha: 0, y: 14, duration: 0.58 })
    .from('.hero-copy h1', { autoAlpha: 0, y: 28, duration: 0.88 }, '-=0.34')
    .from('.hero-copy > p', { autoAlpha: 0, y: 18, duration: 0.66 }, '-=0.5')
    .from('.hero-actions > *', { autoAlpha: 0, y: 14, duration: 0.55, stagger: 0.09 }, '-=0.38')
    .from('.hero-module-jump', { autoAlpha: 0, y: 10, duration: 0.45 }, '-=0.32')
    .from('.hero-proof > div', { autoAlpha: 0, y: 16, duration: 0.52, stagger: 0.08 }, '-=0.25')
    .from('.hero-module-slider', { autoAlpha: 0, x: 34, y: 12, scale: 0.985, duration: 1.05 }, 0.2);

  // Hero statistics count-up.
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count || el.textContent);
    const state = { value: 0 };
    gsap.to(state, {
      value: target,
      duration: 1.15,
      delay: 0.72,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => { el.textContent = String(Math.round(state.value)); },
    });
  });

  // Integration strip.
  fromScroll('.integration-status-shell', {
    y: 22,
    duration: 0.72,
    scrollTrigger: { start: 'top 94%' },
  });

  // Intro section.
  fromScroll('.intro .section-heading', { x: -26, y: 12 }, '.intro');
  fromScroll('.intro .intro-copy', { x: 26, y: 12 }, '.intro');
  fromScroll('.feature-strip article', {
    y: 26,
    stagger: 0.11,
    duration: 0.72,
  }, '.feature-strip');
  gsap.from('.intro-tags span', {
    autoAlpha: 0,
    y: 10,
    duration: 0.5,
    stagger: 0.06,
    ease: 'power2.out',
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.intro-tags', start: 'top 88%', once: true },
  });

  // Modules section.
  fromScroll('.modules .section-top', { y: 30 }, '.modules');
  fromScroll('.module-grid .module-card', {
    y: 36,
    scale: 0.985,
    duration: 0.82,
    stagger: 0.09,
  }, '.module-grid');

  // Workflow section.
  fromScroll('.workflow-copy', { x: -32, y: 10 }, '.workflow');
  fromScroll('.workflow-flow .flow-step', {
    x: 30,
    y: 0,
    duration: 0.68,
    stagger: 0.11,
  }, '.workflow-flow');

  // Coverage.
  fromScroll('.coverage-card', { y: 34, scale: 0.99 }, '.coverage-card');
  gsap.from('.company-cards article', {
    autoAlpha: 0,
    x: 24,
    duration: 0.65,
    stagger: 0.11,
    ease: 'power3.out',
    clearProps: 'transform,opacity,visibility',
    scrollTrigger: { trigger: '.company-cards', start: 'top 84%', once: true },
  });

  // Roadmap and timeline progress.
  fromScroll('.roadmap .section-heading', { y: 28 }, '.roadmap');
  fromScroll('.roadmap-grid .roadmap-card', {
    y: 32,
    scale: 0.985,
    duration: 0.78,
    stagger: 0.11,
  }, '.roadmap-grid');
  gsap.from('.roadmap-card .timeline i', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.52,
    stagger: 0.035,
    ease: 'power2.out',
    clearProps: 'transform',
    scrollTrigger: { trigger: '.roadmap-grid', start: 'top 78%', once: true },
  });

  // CTA.
  fromScroll('.cta-shell', { y: 34, scale: 0.992, duration: 0.9 }, '.cta-shell');

  // Generic fallback for any reveal element not explicitly animated.
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.dataset.gsapAnimated === 'true') return;
    gsap.from(el, {
      autoAlpha: 0,
      y: 26,
      duration: 0.78,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });

  // Desktop-only subtle parallax; intentionally disabled on touch/mobile.
  gsap.matchMedia().add('(min-width: 821px)', () => {
    gsap.to('.hero-grid-bg', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    });

    gsap.utils.toArray('.module-card .module-photo').forEach(image => {
      gsap.fromTo(image,
        { yPercent: -2, scale: 1.045 },
        {
          yPercent: 3,
          scale: 1.075,
          ease: 'none',
          scrollTrigger: {
            trigger: image.closest('.module-card'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    });

    gsap.to('.cta-petals', {
      y: -20,
      rotate: 2,
      ease: 'none',
      scrollTrigger: { trigger: '.cta-shell', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

if (hasGsap) {
  initGsapAnimations();
} else {
  initFallbackReveal();
  initFallbackCounters();
}

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
  const reduceMotion = prefersReducedMotion;
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
