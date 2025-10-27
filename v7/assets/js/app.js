(function(){
  const $ = (sel)=>document.querySelector(sel);
  const log = (msg)=> {
    const el = document.createElement('div');
    el.textContent = `[${new Date().toISOString()}] ${msg}`;
    const logBox = document.getElementById('event-log');
    if (logBox) logBox.prepend(el);
  };

  const setTicker = (txt)=> { const el = $('#mission-ticker'); if(el) el.textContent = txt; };

  // --- Fade-in sequence ---
  window.addEventListener('load',()=>{
    document.body.style.opacity='0';
    setTimeout(()=>{document.body.style.transition='opacity 1s';document.body.style.opacity='1';},100);
  });

  // --- Radar background effect ---
  const bg = document.createElement('div');
  bg.style.position='fixed';
  bg.style.top='0'; bg.style.left='0';
  bg.style.width='100%'; bg.style.height='100%';
  bg.style.zIndex='-1';
  bg.style.background='radial-gradient(circle at center, rgba(51,179,255,0.15) 0%, transparent 70%)';
  bg.style.animation='pulse 6s ease-in-out infinite';
  document.body.appendChild(bg);
  const style=document.createElement('style');
  style.textContent='@keyframes pulse{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:0.8;transform:scale(1.2);}}';
  document.head.appendChild(style);

  // --- View toggler ---
  document.querySelectorAll('[data-view]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      e.preventDefault();
      const v = a.getAttribute('data-view');
      ['dashboard','theatre','pods','preflight','security','rules'].forEach(id=>{
        const sec = $('#view-'+id);
        if (sec) sec.classList.toggle('hidden', id!==v);
      });
    });
  });

  async function jget(url){
    try{
      const r = await fetch(url,{cache:'no-store'});
      if(!r.ok) throw new Error(r.status);
      return await r.json();
    }catch(e){ log(`fetch error ${url}: ${e}`); return null; }
  }

  async function refreshRuntime(){
    const rt = await jget('/metrics/runtime_status.json');
    if(!rt){ setTicker('API degraded – replay mode'); return; }
    setTicker(`CPU ${rt.cpu_pct}% • MEM ${rt.mem_pct}% • Load ${rt.load1} • Uptime ${Math.floor(rt.uptime_sec/3600)}h`);
    $('#runtime-badge').textContent = `CPU ${rt.cpu_pct}% | MEM ${rt.mem_pct}% | L1 ${rt.load1}`;
    $('#uptime').textContent = rt.uptime_sec ? `${Math.floor(rt.uptime_sec/3600)}h` : '—';
    $('#load1').textContent = rt.load1 ?? '—';
    $('#status').textContent = rt.status ?? '—';
  }

  async function refreshPreflight(){
    const pf = await jget('/preflight/reports/latest.json');
    $('#preflight-badge').textContent = pf ? (pf.status || 'ok') : 'unknown';
  }

  async function refreshRules(){
    const idx = await jget('/security/rules/rules_index.json');
    const box = $('#rules-panel');
    if(!idx || !Array.isArray(idx) || idx.length===0){ box.textContent='No rules found.'; return; }
    box.innerHTML = idx.map(f=>`<a class="text-cyan-300 hover:text-cyan-200 block" href="/security/rules/${f}" target="_blank">${f}</a>`).join('');
  }

  let cpuChart, memChart;
  function gradient(ctx,color){
    const g = ctx.createLinearGradient(0,0,0,200);
    g.addColorStop(0,color);
    g.addColorStop(1,'rgba(0,0,0,0)');
    return g;
  }
  function initCharts(){
    const ctx1 = document.getElementById('cpuChart').getContext('2d');
    const ctx2 = document.getElementById('memChart').getContext('2d');
    const common = {
      type:'line',
      options:{
        animation:false,
        responsive:true,
        maintainAspectRatio:false,
        scales:{y:{suggestedMax:100,ticks:{color:'#94a3b8'}},x:{ticks:{color:'#64748b'}}},
        plugins:{legend:{labels:{color:'#cbd5e1'}}}
      }
    };
    cpuChart = new Chart(ctx1, {...common, data:{labels:[],datasets:[{label:'CPU %',data:[],borderColor:'#33b3ff',backgroundColor:gradient(ctx1,'rgba(51,179,255,0.3)'),fill:true,tension:.3}]}})
    memChart = new Chart(ctx2, {...common, data:{labels:[],datasets:[{label:'MEM %',data:[],borderColor:'#7df9ff',backgroundColor:gradient(ctx2,'rgba(125,249,255,0.25)'),fill:true,tension:.3}]}})
  }

  async function tick(){
    const rt = await jget('/metrics/runtime_status.json');
    const t = new Date().toLocaleTimeString();
    if(rt){
      const push = (chart,val)=>{
        chart.data.labels.push(t);
        chart.data.datasets[0].data.push(val);
        if(chart.data.labels.length>20){chart.data.labels.shift();chart.data.datasets[0].data.shift();}
        chart.update();
      };
      push(cpuChart,rt.cpu_pct); push(memChart,rt.mem_pct);
    }
  }

  function utcTicker(){
    const el = document.getElementById('utc');
    if(el) setInterval(()=> el.textContent = new Date().toUTCString(), 1000);
  }

  // Init
  $('#why-badge').textContent = 'observability-first';
  initCharts();
  refreshRuntime(); refreshPreflight(); refreshRules();
  utcTicker();
  setInterval(refreshRuntime, 5000);
  setInterval(tick, 5000);
  log('v6.1 visuals active');
})();
