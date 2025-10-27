(function(){
  const routes = {
    "#/dashboard": window.renderDashboardV8,
    "#/pods": window.renderPodsV8,
    "#/theatre": window.renderTheatreV8,
  };
  function setActive(route){
    document.querySelectorAll('.nav .btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.route===route);
    });
  }
  async function navigate(){
    const h = location.hash || "#/dashboard";
    setActive(h);
    const fn = routes[h] || routes["#/dashboard"];
    const view = document.getElementById('view');
    view.innerHTML = "";
    await fn(view);
  }
  window.addEventListener('hashchange', navigate);
  setInterval(()=>{document.getElementById('utc').textContent=new Date().toISOString().replace(/\..+/, 'Z')},1000);
  navigate();
})();
