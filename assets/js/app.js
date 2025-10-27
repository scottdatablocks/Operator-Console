/* Harmonix Operator Console App Shell v5 */

(function(){
  const routes = {
    dashboard: '/assets/js/modules/dashboard.js',
    theatre: '/assets/js/modules/theatre.js',
    pods: '/assets/js/modules/pods.js',
    preflight: '/assets/js/modules/preflight.js',
    security: '/assets/js/modules/security.js',
    rules: '/assets/js/modules/rules_panel.js'
  };

  const view = document.getElementById('view');
  const nav = document.getElementById('nav');
  const utcSpan = document.getElementById('utc');

  function setUTC() {
    const d = new Date();
    utcSpan.textContent = d.toISOString().split('.')[0].replace('T',' ');
  }

  setInterval(setUTC,1000);
  setUTC();

  function setActive(route) {
    if(!nav) return;
    nav.querySelectorAll('a').forEach(a=>{
      a.classList.toggle('active', a.dataset.route===route);
    });
  }

  async function loadRoute(route) {
    const scriptURL = routes[route] || routes.dashboard;
    setActive(route);
    view.innerHTML = `<div class="card" style="grid-column: span 12;">Loading ${route}…</div>`;

    try {
      const mod = await import(scriptURL + '?v=' + Date.now());
      if (typeof mod.render === 'function') {
        const html = await mod.render();
        view.innerHTML = html;
      } else {
        view.innerHTML = `<div class="card">No render() export found in ${route}</div>`;
      }
    } catch (err) {
      console.error(err);
      view.innerHTML = `<div class="card err mono">Failed to load ${route}: ${err}</div>`;
    }
  }

  function router() {
    const hash = location.hash.replace('#/','') || 'dashboard';
    loadRoute(hash);
  }

  window.addEventListener('hashchange', router);
  document.addEventListener('DOMContentLoaded', router);

  // initial route
  router();
})();
