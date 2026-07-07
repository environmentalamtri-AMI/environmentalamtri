(() => {
  const reports = {
    mc: {
      company: 'PT MARUWAI COAL',
      companyName: 'PT Maruwai Coal',
      title: 'Pembukaan Lahan & Reklamasi',
      description: 'Laporan aktual PT Maruwai Coal dari Looker Studio.',
      url: 'https://datastudio.google.com/embed/reporting/6b88573f-2e10-45a1-b1bf-842a8e8700db/page/SnbUF'
    },
    lc: {
      company: 'PT LAHAI COAL',
      companyName: 'PT Lahai Coal',
      title: 'Pembukaan Lahan & Reklamasi',
      description: 'Laporan aktual PT Lahai Coal dari Looker Studio.',
      url: 'https://datastudio.google.com/embed/reporting/7242b049-d985-4125-b48c-711ded9a631c/page/SnbUF'
    }
  };

  const choices = [...document.querySelectorAll('.land-company-card')];
  const frame = document.getElementById('landLookerFrame');
  const loader = document.getElementById('landLoader');
  const loaderText = document.getElementById('landLoaderText');
  const label = document.getElementById('landReportLabel');
  const title = document.getElementById('landReportTitle');
  const description = document.getElementById('landReportDescription');
  const openReport = document.getElementById('landOpenReport');
  const fallbackLink = document.getElementById('landFallbackLink');
  const refresh = document.getElementById('landRefresh');
  const fullscreen = document.getElementById('landFullscreen');
  const stage = document.getElementById('landLookerStage');

  if (!frame || !loader || !stage) return;

  let activeKey = 'mc';

  function showLoader(companyName) {
    loaderText.textContent = companyName;
    loader.classList.remove('is-hidden');
  }

  function hideLoader() {
    loader.classList.add('is-hidden');
  }

  function loadReport(key, updateHash = true) {
    const report = reports[key] || reports.mc;
    activeKey = key in reports ? key : 'mc';

    choices.forEach((choice) => {
      const selected = choice.dataset.report === activeKey;
      choice.classList.toggle('active', selected);
      choice.setAttribute('aria-selected', String(selected));
    });

    label.textContent = report.company;
    title.textContent = report.title;
    description.textContent = report.description;
    openReport.href = report.url;
    fallbackLink.href = report.url;
    frame.title = `Dashboard Pembukaan Lahan dan Reklamasi ${report.companyName}`;

    showLoader(report.companyName);
    frame.src = report.url;

    if (updateHash) {
      history.replaceState(null, '', `#${activeKey}`);
    }
  }

  choices.forEach((choice) => {
    choice.addEventListener('click', () => {
      loadReport(choice.dataset.report);
      document.getElementById('live-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  frame.addEventListener('load', () => {
    window.setTimeout(hideLoader, 350);
  });

  refresh?.addEventListener('click', () => {
    showLoader(reports[activeKey].companyName);
    const current = frame.src;
    frame.src = 'about:blank';
    window.setTimeout(() => { frame.src = current; }, 80);
  });

  fullscreen?.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await stage.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen tidak tersedia:', error);
    }
  });

  const initial = location.hash.replace('#', '').toLowerCase();
  loadReport(initial === 'lc' ? 'lc' : 'mc', false);
})();
