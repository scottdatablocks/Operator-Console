window.HMX_INVESTOR = async function(root){
  root.innerHTML = `
    <div class="card fade">
      <h3 class="section-title">Investor Overview</h3>
      <div class="list">
        <div class="row"><div>Uptime</div><div id="iv1" class="badge">—</div></div>
        <div class="row"><div>Integrity</div><div id="iv2" class="badge">—</div></div>
        <div class="row"><div>Preflight</div><div id="iv3" class="badge">—</div></div>
      </div>
    </div>
    <div class="card center fade" style="min-height:320px">
      <div class="sphere-fallback" title="Cinematic Reel"></div>
    </div>
  `;
  async function g(u){ try{ const r=await fetch(u,{cache:'no-cache'}); if(!r.ok) throw 0; return await r.json(); }catch{ return null; } }
  const [rt,sec,pf] = await Promise.all([
    g('/metrics/runtime_status.json'),
    g('/security/boot_guard_report.json'),
    g('/preflight/reports/latest.json'),
  ]);
  document.getElementById('iv1').textContent = rt?`CPU ${rt.cpu_pct}% · MEM ${rt.mem_pct}% · L1 ${rt.load1}`:"—";
  document.getElementById('iv2').textContent = sec?`${sec.files_verified} files · ${sec.status}`:"—";
  document.getElementById('iv3').textContent = pf?`${pf.chart_version} · ${pf.result}`:"—";
};
