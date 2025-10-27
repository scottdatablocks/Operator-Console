(async function tick(){
  const el = document.querySelector('#runtime-badge');
  if(!el) return;
  try{
    const r = await fetch('/metrics/runtime_status.json', {cache:'no-cache'});
    const j = await r.json();
    const upMin = Math.floor((j.uptime_sec||0)/60);
    const cpu = Math.round((j.cpu_pct||0)*100)/100;
    const mem = Math.round((j.mem_pct||0)*100)/100;
    const l1  = Math.round((j.load1||0)*100)/100;
    const color = cpu >= 70 ? 'bad' : (cpu >= 40 ? 'warn' : 'ok');
    el.innerHTML = `<div class="pill"><span class="dot ${color}"></span>
      CPU <span class="value">${cpu}%</span> · MEM <span class="value">${mem}%</span> · L1 <span class="value">${l1}</span> · UP <span class="value">${upMin}m</span>
    </div>`;
  }catch(e){
    el.innerHTML = `<div class="pill"><span class="dot warn"></span> runtime: <span class="value">unknown</span>`;
  }
  setTimeout(tick, 10000);
})();
