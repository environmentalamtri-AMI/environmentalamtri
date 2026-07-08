
(() => {
  const data = Array.isArray(window.BIODIVERSITY_SPECIES) ? window.BIODIVERSITY_SPECIES : [];
  const grid = document.getElementById('bioSpeciesGrid');
  if (!grid) return;

  const search = document.getElementById('bioSearch');
  const count = document.getElementById('bioResultCount');
  const empty = document.getElementById('bioEmpty');
  const groupButtons = [...document.querySelectorAll('[data-group]')];
  const statusButtons = [...document.querySelectorAll('[data-status]')];
  let activeGroup = 'Semua';
  let activeStatus = 'Semua';

  const esc = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const badgeClass = s => String(s || '').toLowerCase();
  const badges = item => {
    const arr = [];
    if (item.iucn && item.iucn !== '-') arr.push(`<b class="${badgeClass(item.iucn)}">IUCN ${esc(item.iucn)}</b>`);
    if (item.protected) arr.push('<b class="legal">Dilindungi</b>');
    if (item.endemic) arr.push('<b class="endemic">Endemik</b>');
    if (item.cites && item.cites !== '-') arr.push(`<b>CITES ${esc(item.cites)}</b>`);
    return arr.join('');
  };

  function filtered(){
    const q = (search?.value || '').trim().toLowerCase();
    return data.filter(item => {
      const matchGroup = activeGroup === 'Semua' || item.group === activeGroup;
      let matchStatus = true;
      if (activeStatus === 'Dilindungi') matchStatus = item.protected;
      else if (activeStatus === 'Endemik') matchStatus = item.endemic;
      else if (activeStatus !== 'Semua') matchStatus = item.iucn === activeStatus;
      const hay = `${item.local} ${item.scientific} ${item.family} ${item.group} ${item.summary}`.toLowerCase();
      return matchGroup && matchStatus && (!q || hay.includes(q));
    });
  }

  function render(){
    const items = filtered();
    grid.innerHTML = items.map((item,index) => `
      <button class="bio-species-card" data-species-id="${esc(item.id)}">
        <span class="bio-species-image"><img loading="lazy" decoding="async" src="${esc(item.image)}" alt="${esc(item.local)}"><i class="bio-species-index">${String(index+1).padStart(2,'0')}</i></span>
        <span class="bio-species-body"><span>${esc(item.group)}</span><h3>${esc(item.local)}</h3><em>${esc(item.scientific)}</em><p>${esc(item.summary)}</p><span class="bio-card-badges">${badges(item)}</span></span>
      </button>`).join('');
    count.textContent = `${items.length} spesies ditampilkan`;
    empty.hidden = items.length !== 0;
  }

  groupButtons.forEach(btn => btn.addEventListener('click', () => {
    activeGroup = btn.dataset.group;
    groupButtons.forEach(b => b.classList.toggle('is-active', b === btn));
    render();
  }));
  statusButtons.forEach(btn => btn.addEventListener('click', () => {
    activeStatus = btn.dataset.status;
    statusButtons.forEach(b => b.classList.toggle('is-active', b === btn));
    render();
  }));
  search?.addEventListener('input', render);

  document.querySelectorAll('[data-filter-group]').forEach(card => card.addEventListener('click', () => {
    const target = groupButtons.find(b => b.dataset.group === card.dataset.filterGroup);
    if (target) target.click();
    document.getElementById('species')?.scrollIntoView({behavior:'smooth'});
  }));

  const modal = document.getElementById('bioModal');
  const set = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val || '—'; };
  function openModal(item){
    const img = document.getElementById('bioModalImage');
    img.src = item.image; img.alt = item.local;
    set('bioModalGroup', item.group); set('bioModalTitle', item.local); set('bioModalScientific', item.scientific);
    set('bioModalSummary', item.summary); set('bioModalFamily', item.family); set('bioModalHabitat', item.habitat);
    set('bioModalDistribution', item.distribution); set('bioModalDetail', item.detail); set('bioModalSource', `Sumber: Buku Keanekaragaman Hayati Alamtri Geo 2026 · slide ${item.sourceSlide}`);
    document.getElementById('bioModalBadges').innerHTML = badges(item);
    modal.hidden = false; modal.setAttribute('aria-hidden','false'); document.body.classList.add('bio-modal-open');
  }
  function closeModal(){ modal.hidden = true; modal.setAttribute('aria-hidden','true'); document.body.classList.remove('bio-modal-open'); }
  grid.addEventListener('click', e => {
    const card = e.target.closest('[data-species-id]'); if (!card) return;
    const item = data.find(x => x.id === card.dataset.speciesId); if (item) openModal(item);
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !modal.hidden) closeModal(); });
  render();
})();
