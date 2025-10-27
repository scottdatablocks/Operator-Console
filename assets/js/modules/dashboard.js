window.HMX_DASHBOARD = async function(root){
  root.innerHTML = `
    <div class="card fade">
      <h3 class="section-title">System Overview</h3>
      <div class="kv">
        <div class="box"><div class="muted">Runtime</div><div id="kv_rt" class="big mono">—</div></div>
        <div class="box"><div class="muted">Integrity</div><div id="kv_sec" class="big mono">—</div></div>
        <div class="box"><div class="muted">Preflight</div><div id="kv_pf" class="big mono">—</div></div>
      </div>
    </div>
    <div class="card fade"><h3 class="section-title">Recent Events</h3>
      <div id="events" class="list"></div>
    </div>
  `;
  async function get(u){ try{ const r=await fetch(u,{cache:'no-cache'}); if(!r.ok) throw 0; return await r.json(); }catch{ return null; } }
  const [rt,sec,pf] = await Promise.all([
    get('/metrics/runtime_status.json'),
    get('/security/boot_guard_report.json'),
    get('/preflight/reports/latest.json'),
  ]);
  document.getElementById('kv_rt').textContent = rt?`${rt.cpu_pct}% · ${rt.mem_pct}% · L1 ${rt.load1}`:"—";
  document.getElementById('kv_sec').textContent = sec?`${sec.files_verified} files · ${sec.status}`:"—";
  document.getElementById('kv_pf').textContent = pf?`${pf.chart_version} · ${pf.result}`:"—";
  document.getElementById('events').innerHTML = `
    <div class="row"><div>Boot-Guard</div><div class="badge">${sec?sec.timestamp:"—"}</div></div>
    <div class="row"><div>Preflight</div><div class="badge">${pf?pf.timestamp:"—"}</div></div>
    <div class="row"><div>Runtime</div><div class="badge">${rt?rt.timestamp:"—"}</div></div>
  `;
};
