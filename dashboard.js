(() => {
  'use strict';

  const choices = Array.from(document.querySelectorAll('.dashboard-choice'));
  const frame = document.getElementById('looker-frame');
  const stage = document.getElementById('looker-stage');
  const loader = document.getElementById('looker-loader');
  const title = document.getElementById('dashboard-title');
  const kicker = document.getElementById('dashboard-kicker');
  const description = document.getElementById('dashboard-description');
  const openLink = document.getElementById('open-dashboard');
  const fallbackLink = document.getElementById('fallback-link');
  const reloadButton = document.getElementById('reload-dashboard');
  const fullscreenButton = document.getElementById('fullscreen-dashboard');
  const viewer = document.getElementById('dashboard-viewer');

  if (!choices.length || !frame) return;

  let loadTimer;

  const showLoader = () => {
    clearTimeout(loadTimer);
    loader.classList.remove('is-hidden');
    stage.classList.add('is-loading');
    loadTimer = window.setTimeout(() => {
      loader.classList.add('is-hidden');
      stage.classList.remove('is-loading');
    }, 12000);
  };

  const hideLoader = () => {
    clearTimeout(loadTimer);
    loader.classList.add('is-hidden');
    stage.classList.remove('is-loading');
  };

  const setDashboard = (button, updateHash = true) => {
    const url = button.dataset.url;
    const name = button.dataset.title;

    choices.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    title.textContent = name;
    kicker.textContent = button.dataset.kicker;
    description.textContent = button.dataset.description;
    openLink.href = url;
    fallbackLink.href = url;
    frame.title = name;

    if (frame.src !== url) {
      showLoader();
      frame.src = url;
    }

    if (updateHash) {
      history.replaceState(null, '', `#${button.dataset.dashboard}`);
    }

    if (window.matchMedia('(max-width: 720px)').matches) {
      viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  choices.forEach((button) => {
    button.addEventListener('click', () => setDashboard(button));
  });

  frame.addEventListener('load', hideLoader);

  reloadButton.addEventListener('click', () => {
    showLoader();
    const current = frame.src;
    frame.src = 'about:blank';
    window.setTimeout(() => { frame.src = current; }, 80);
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await stage.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      window.open(frame.src, '_blank', 'noopener,noreferrer');
    }
  });

  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement ? '×' : '⛶';
    fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Keluar dari layar penuh' : 'Tampilkan dashboard layar penuh');
  });

  const initialId = window.location.hash.replace('#', '');
  const initialChoice = choices.find((item) => item.dataset.dashboard === initialId) || choices[0];
  setDashboard(initialChoice, Boolean(initialId));
  showLoader();
})();
