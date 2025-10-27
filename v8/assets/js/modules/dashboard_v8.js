window.renderDashboardV8 = async function mount(el){
  // top row: API integrity card
  const api = document.createElement('div');
  api.className = 'card span12';
  api.innerHTML = `
    <h3 class="mono">API Integrity</h3>
    <div class="api-card mono" id="api-pills">
      <div class="pill" id="pill-metrics">metrics</div>
      <div class="pill" id="pill-security">security</div>
      <div class="pill" id="pill-preflight">preflight</div>
    </div>`;
  el.appendChild(api);

  // middle row: animated metrics
  const metrics = document.createElement('div');
  metrics.className = 'card span6';
  metrics.innerHTML = `
     <h3 class="mono">Runtime · Animated</h3>
     <div class="metric-bars">
       <div class="metric"><div class="label"><span>CPU</span><span id="cpuPct">–</span></div><div class="bar"><span id="barCPU"></span></div></div>
       <div class="metric"><div class="label"><span>MEM</span><span id="memPct">–</span></div><div class="bar"><span id="barMEM"></span></div></div>
       <div class="metric"><div class="label"><span>Load1</span><span id="ld1">–</span></div><div class="bar"><span id="barLD"></span></div></div>
     </div>
  `;
  el.appendChild(metrics);

  // right: pods snapshot preview (uses same grid renderer as pods view)
  const podsPreview = document.createElement('div');
  podsPreview.className = 'card span6';
  podsPreview.innerHTML = `<h3 class="mono">Pods Snapshot</h3><div id="podsPreview"></div>`;
  el.appendChild(podsPreview);

  // lower: theatre note
  const th = document.createElement('div');
  th.className = 'card span12';
  th.innerHTML = `<h3 class="mono">Theatre</h3>
    <div class="canvas-wrap" id="canvasNote"></div>
    <div class="three-note mono">Blue sphere & pulse gauge appear in the Theatre tab when three.js loads.</div>`;
  el.appendChild(th);

  // live pills
  const checks = [
    { url: "/metrics/runtime_status.json", id: "pill-metrics" },
    { url: "/security/boot_guard_report.json", id: "pill-security" },
    { url: "/preflight/reports/latest.json", id: "pill-preflight" },
  ];
  for (const c of checks){
    try{
      const r = await hmxFetch(c.url, {cache:"no-store"});
      const ok = r.ok;
      const pill = document.getElementById(c.id);
      pill.classList.add(ok? 'ok':'err');
      pill.textContent = pill.textContent + " · " + (ok? "OK":"ERR");
    }catch(e){
      const pill = document.getElementById(c.id);
      pill.classList.add('warn');
      pill.textContent = pill.textContent + " · FALLBACK";
    }
  }

  // animated metrics
  try {
    const r = await hmxFetch("/metrics/runtime_status.json",{cache:"no-store"});
    const j = await r.json();
    const cpu = Math.max(0, Math.min(100, Math.round((j.cpu_pct||0)*100)/100));
    const mem = Math.max(0, Math.min(100, Math.round((j.mem_pct||0)*100)/100));
    const ld  = Math.max(0, Math.min(100, Math.round((j.load1||0)*100)/100*10)); // scaled

    animateBar("barCPU", "cpuPct", cpu);
    animateBar("barMEM", "memPct", mem);
    animateBar("barLD",  "ld1",   Math.round(j.load1*100)/100);
  } catch(e) {
    // fallback uses /data/runtime_latest.json via shim
  }

  // pods preview
  const podsHost = document.getElementById("podsPreview");
  await window.renderPodsGrid(podsHost, {columns: 4, limit: 8});

  // simple animation helper
  function animateBar(barId, labelId, target){
    const bar = document.getElementById(barId);
    const label = document.getElementById(labelId);
    let cur = 0;
    const tgt = Math.max(0, Math.min(100, Number(target)));
    function step(){
      cur += (tgt - cur)*0.12;
      if (Math.abs(tgt-cur) < 0.2) cur = tgt;
      label.textContent = (barId==="barLD" ? String(target) : (cur.toFixed(1)+"%"));
      bar.style.width = Math.max(0, Math.min(100, cur)) + "%";
      if (cur !== tgt) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
};
