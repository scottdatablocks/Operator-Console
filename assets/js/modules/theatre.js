window.HMX_THEATRE = async function(root){
  root.innerHTML = `
    <div class="card center fade" style="min-height:320px">
      <div class="sphere-fallback" title="Theatre mode (local THREE fallback)"></div>
    </div>
    <div class="card fade">
      <h3 class="section-title">Live Pulse</h3>
      <div id="pulse" class="mono">—</div>
    </div>
  `;
  try{
    const r = await fetch('/metrics/runtime_status.json',{cache:'no-cache'}); 
    const j = r.ok ? await r.json() : null;
    document.getElementById('pulse').textContent = j?`CPU ${j.cpu_pct}% · MEM ${j.mem_pct}% · L1 ${j.load1}`:"—";
  }catch{ document.getElementById('pulse').textContent='—'; }
};
