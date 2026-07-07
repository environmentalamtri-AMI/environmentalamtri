(() => {
  const search = document.querySelector("#databaseSearch");
  const filters = [...document.querySelectorAll(".database-filter")];
  const cards = [...document.querySelectorAll(".database-input-card")];
  const count = document.querySelector("#databaseResultCount");
  const empty = document.querySelector("#databaseEmpty");
  let activeFilter = "all";

  const normalize = value => (value || "").toLowerCase().trim();

  function render() {
    const query = normalize(search?.value);
    let visible = 0;

    cards.forEach(card => {
      const companyMatch = activeFilter === "all" || card.dataset.company === activeFilter;
      const textMatch = !query || normalize(card.dataset.search + " " + card.textContent).includes(query);
      const show = companyMatch && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} database ditampilkan`;
    if (empty) empty.hidden = visible !== 0;
  }

  filters.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filters.forEach(item => item.classList.toggle("is-active", item === button));
      render();
    });
  });

  search?.addEventListener("input", render);

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      search?.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      search.blur();
      render();
    }
  });

  render();
})();
