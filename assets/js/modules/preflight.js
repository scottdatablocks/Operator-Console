window.HMX_PREFLIGHT = async function(root){
  root.innerHTML = `
    <div class="card fade">
      <h3 class="section-title">Latest Preflight Report</h3>
      <div id="pf" class="mono">—</div>
    </div>
  `;
  try{
    const r = await fetch('/preflight/reports/latest.json',{cache:'no-cache'});
    const j = r.ok ? await r.json() : null;
    document.getElementById('pf').textContent = j ? JSON.stringify(j,null,2) : 'No report';
  }catch{ document.getElementById('pf').textContent='No report'; }
};
