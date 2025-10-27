(async function(){
  const el = document.querySelector('#why-badge');
  if(!el) return;
  const url = '/security/boot_guard_report.json';
  try{
    const r = await fetch(url, {cache:'no-cache'}); const j = await r.json();
    const status = (j.status||'unknown').toLowerCase();
    const color = status === 'ok' ? 'ok' : (status === 'warn' ? 'warn' : 'bad');
    el.innerHTML = `<div class="pill"><span class="dot ${color}"></span>
      <strong>WHY:</strong>&nbsp;<span class="value">${status}</span>
      <span class="kv">• depth:</span>&nbsp;≥7/7
      <span class="kv">• boot-guard:</span>&nbsp;${status}
      <span class="kv">•</span>&nbsp;<span class="kv">UTC ${(new Date()).toISOString()}</span>
    </div>`;
  }catch(e){
    el.innerHTML = `<div class="pill"><span class="dot warn"></span><strong>WHY:</strong>&nbsp;<span class="value">unknown</span></div>`;
  }
})();
