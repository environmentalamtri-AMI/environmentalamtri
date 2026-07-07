(() => {
  'use strict';
  const choices = Array.from(document.querySelectorAll('.module-report-card'));
  const frame = document.getElementById('moduleReportFrame');
  const loader = document.getElementById('moduleLoader');
  const loaderText = document.getElementById('moduleLoaderText');
  const label = document.getElementById('moduleReportLabel');
  const title = document.getElementById('moduleReportTitle');
  const description = document.getElementById('moduleReportDescription');
  const openReport = document.getElementById('moduleOpenReport');
  const fallbackLink = document.getElementById('moduleFallbackLink');
  const refresh = document.getElementById('moduleRefresh');
  const fullscreen = document.getElementById('moduleFullscreen');
  const stage = document.getElementById('moduleLookerStage');
  const viewer = document.getElementById('live-dashboard');
  if (!choices.length || !frame || !loader || !stage) return;

  let active = choices[0];
  let timer;

  function showLoader(companyName) {
    clearTimeout(timer);
    loaderText.textContent = companyName || 'Looker Studio';
    loader.classList.remove('is-hidden');
    timer = window.setTimeout(() => loader.classList.add('is-hidden'), 15000);
  }
  function hideLoader() {
    clearTimeout(timer);
    window.setTimeout(() => loader.classList.add('is-hidden'), 300);
  }
  function selectReport(button, updateHash = true) {
    active = button;
    choices.forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle('active', selected);
      choice.setAttribute('aria-selected', String(selected));
    });
    const url = button.dataset.url;
    const company = button.dataset.company;
    const companyName = button.dataset.companyName;
    const reportTitle = button.dataset.title;
    const reportDescription = button.dataset.description;
    label.textContent = company;
    title.textContent = reportTitle;
    description.textContent = reportDescription;
    openReport.href = url;
    fallbackLink.href = url;
    frame.title = `${reportTitle} — ${companyName}`;
    showLoader(companyName);
    frame.src = url;
    if (updateHash) history.replaceState(null, '', `#${button.dataset.report}`);
    if (window.matchMedia('(max-width: 720px)').matches) viewer?.scrollIntoView({behavior:'smooth', block:'start'});
  }

  choices.forEach((button) => button.addEventListener('click', () => selectReport(button)));
  frame.addEventListener('load', hideLoader);
  refresh?.addEventListener('click', () => {
    showLoader(active.dataset.companyName);
    const current = frame.src;
    frame.src = 'about:blank';
    window.setTimeout(() => { frame.src = current; }, 80);
  });
  fullscreen?.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await stage.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      window.open(frame.src, '_blank', 'noopener,noreferrer');
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement ? '×' : '⛶';
    fullscreen.setAttribute('aria-label', document.fullscreenElement ? 'Keluar dari layar penuh' : 'Tampilkan dashboard layar penuh');
  });

  const initialKey = location.hash.replace('#','').toLowerCase();
  const initial = choices.find((choice) => choice.dataset.report === initialKey) || choices[0];
  selectReport(initial, Boolean(initialKey));
})();