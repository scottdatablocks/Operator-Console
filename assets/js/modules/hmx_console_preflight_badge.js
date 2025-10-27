(async function(){
  const el = document.querySelector('#preflight-badge');
  if(!el) return;
  const url = '/preflight/reports/latest.json';
  try{
    const r = await fetch(url, {cache:'no-cache'}); const j = await r.json();
    const res = (j.result||'UNKNOWN').toUpperCase();
    const color = res === 'OK' ? 'ok' : (res === 'WARN' ? 'warn' : 'bad');
    el.innerHTML = `<div class="pill"><span class="dot ${color}"></span>
      <strong>Preflight:</strong>&nbsp;<span class="value">${res.toLowerCase()}</span>
    </div>`;
  }catch(e){
    el.innerHTML = `<div class="pill"><span class="dot bad"></span><strong>Preflight:</strong>&nbsp;<span class="value">unknown</span></div>`;
  }
})();
