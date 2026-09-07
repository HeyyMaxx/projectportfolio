// Hash routing. No framework, no build — the browser loads these modules directly.
export function createRouter(routes, { mount, tabbar, onRoute }) {
  const ids = Object.keys(routes);

  tabbar.innerHTML = ids.map(id =>
    `<button type="button" data-route="${id}">${routes[id].label}</button>`).join('');

  tabbar.addEventListener('click', e => {
    const btn = e.target.closest('button[data-route]');
    if (btn) location.hash = '#/' + btn.dataset.route;
  });

  function current() {
    const id = location.hash.replace(/^#\/?/, '');
    return ids.includes(id) ? id : ids[0];
  }

  function render() {
    const id = current();
    mount.innerHTML = routes[id].view();
    mount.scrollTop = 0;
    window.scrollTo(0, 0);
    for (const btn of tabbar.querySelectorAll('button')) {
      const active = btn.dataset.route === id;
      btn.toggleAttribute('aria-current', active);
      if (active) btn.setAttribute('aria-current', 'page');
    }
    onRoute?.(id);
  }

  addEventListener('hashchange', render);
  render();
}
