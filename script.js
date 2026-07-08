const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  document.body.classList.toggle('menu-open', Boolean(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  mainNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) {
    mainNav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = Boolean(window.gsap && window.ScrollTrigger);

const forceVisible = (targets = '.reveal') => {
  document.querySelectorAll(targets).forEach((el) => {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.transform = 'none';
  });
};

function initFallbackReveal() {
  if (!('IntersectionObserver' in window)) {
    forceVisible('.reveal');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initFallbackCounters() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count || el.textContent;
    });
    return;
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || el.textContent);
      const start = performance.now();
      const duration = 850;
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
}

function initGsapAnimations() {
  const { gsap, ScrollTrigger } = window;

  try {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('gsap-active');

    const animatedRevealElements = new WeakSet();
    const markAnimated = (targets) => {
      gsap.utils.toArray(targets).forEach((el) => {
        if (el instanceof Element) animatedRevealElements.add(el);
      });
    };

    // GSAP is an enhancement only. Every element remains readable after each tween.
    gsap.set('.reveal', { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsap.set('.hero-actions > *, .hero-module-jump', {
      autoAlpha: 1,
      x: 0,
      y: 0,
      clearProps: 'transform',
    });

    if (prefersReducedMotion) {
      forceVisible('.reveal, .hero-actions > *, .hero-module-jump');
      document.querySelectorAll('[data-count]').forEach((el) => {
        el.textContent = el.dataset.count || el.textContent;
      });
      return;
    }

    const fromScroll = (targets, fromVars = {}, trigger = null, toVars = {}) => {
      const elements = gsap.utils.toArray(targets).filter((el) => el instanceof Element);
      if (!elements.length) return null;
      markAnimated(elements);

      const {
        x = 0,
        y = 28,
        scale = 1,
        autoAlpha = 0,
        ...otherFromVars
      } = fromVars;

      return gsap.fromTo(elements,
        {
          autoAlpha,
          x,
          y,
          scale,
          ...otherFromVars,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.82,
          ease: 'power3.out',
          stagger: elements.length > 1 ? 0.1 : 0,
          ...toVars,
          onComplete: () => {
            gsap.set(elements, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              clearProps: 'transform',
            });
          },
          scrollTrigger: {
            trigger: trigger || elements[0],
            start: 'top 84%',
            once: true,
            ...(toVars.scrollTrigger || {}),
          },
        }
      );
    };

    // Hero entrance. Buttons and module link stay visible throughout.
    markAnimated('.hero-copy, .hero-module-slider');
    const heroTimeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set([
          '.hero-kicker',
          '.hero-copy h1',
          '.hero-copy > p',
          '.hero-actions > *',
          '.hero-module-jump',
          '.hero-proof > div',
          '.hero-module-slider',
        ], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          clearProps: 'transform',
        });
      },
    });

    heroTimeline
      .fromTo('.hero-kicker',
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.58 }
      )
      .fromTo('.hero-copy h1',
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.88 },
        '-=0.34'
      )
      .fromTo('.hero-copy > p',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.66 },
        '-=0.5'
      )
      .fromTo('.hero-proof > div',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.08 },
        '-=0.22'
      )
      .fromTo('.hero-module-slider',
        { autoAlpha: 0, x: 34, y: 12, scale: 0.985 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1.05 },
        0.2
      );

    // Hard safety: the primary navigation actions must never remain hidden.
    window.setTimeout(() => {
      gsap.set('.hero-actions > *, .hero-module-jump', {
        autoAlpha: 1,
        x: 0,
        y: 0,
        clearProps: 'transform',
      });
    }, 1200);

    // Hero statistics count-up.
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count || el.textContent);
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.15,
        delay: 0.72,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => { el.textContent = String(Math.round(state.value)); },
        onComplete: () => { el.textContent = String(target); },
      });
    });

    // Integration strip.
    fromScroll('.integration-status-shell', { y: 22 }, '.integration-status-shell', {
      duration: 0.72,
      scrollTrigger: { start: 'top 94%' },
    });

    // Intro section. Horizontal movement is desktop-only to prevent mobile page overflow.
    const compactViewport = window.matchMedia('(max-width: 820px)').matches;
    fromScroll('.intro .section-heading', { x: compactViewport ? 0 : -26, y: compactViewport ? 18 : 12 }, '.intro');
    fromScroll('.intro .intro-copy', { x: compactViewport ? 0 : 26, y: compactViewport ? 18 : 12 }, '.intro');
    fromScroll('.feature-strip article', { y: 26 }, '.feature-strip', {
      stagger: 0.11,
      duration: 0.72,
    });
    fromScroll('.intro-tags span', { y: 10 }, '.intro-tags', {
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { start: 'top 88%' },
    });

    // Modules section.
    fromScroll('.modules .section-top', { y: 30 }, '.modules');
    fromScroll('.module-grid .module-card', { y: 36, scale: 0.985 }, '.module-grid', {
      duration: 0.82,
      stagger: 0.09,
    });

    // Workflow section.
    fromScroll('.workflow-copy', { x: -32, y: 10 }, '.workflow');
    fromScroll('.workflow-flow .flow-step', { x: 30, y: 0 }, '.workflow-flow', {
      duration: 0.68,
      stagger: 0.11,
    });

    // Coverage.
    fromScroll('.coverage-card', { y: 34, scale: 0.99 }, '.coverage-card');
    fromScroll('.company-cards article', { x: 24, y: 0 }, '.company-cards', {
      duration: 0.65,
      stagger: 0.11,
    });

    // Roadmap and timeline progress.
    fromScroll('.roadmap .section-heading', { y: 28 }, '.roadmap');
    fromScroll('.roadmap-grid .roadmap-card', { y: 32, scale: 0.985 }, '.roadmap-grid', {
      duration: 0.78,
      stagger: 0.11,
    });
    gsap.fromTo('.roadmap-card .timeline i',
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1,
        duration: 0.52,
        stagger: 0.035,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.roadmap-grid', start: 'top 78%', once: true },
      }
    );

    // CTA.
    fromScroll('.cta-shell', { y: 34, scale: 0.992 }, '.cta-shell', { duration: 0.9 });

    // Generic reveal only for elements not already handled above.
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (!(el instanceof Element) || animatedRevealElements.has(el)) return;
      fromScroll(el, { y: 26 }, el, { duration: 0.78 });
    });

    // Desktop-only subtle parallax.
    gsap.matchMedia().add('(min-width: 821px)', () => {
      gsap.to('.hero-grid-bg', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      gsap.utils.toArray('.module-card .module-photo').forEach((image) => {
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
  } catch (error) {
    console.error('GSAP animation initialization failed:', error);
    document.documentElement.classList.remove('gsap-active');
    forceVisible('.reveal, .hero-actions > *, .hero-module-jump');
    initFallbackCounters();
  }
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
