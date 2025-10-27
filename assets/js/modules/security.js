window.HMX_SECURITY = async function(root){
  root.innerHTML = `
    <div class="card fade"><h3 class="section-title">Boot-Guard</h3><pre id="sec" class="mono">—</pre></div>
    <div class="card fade"><h3 class="section-title">Golden Rules</h3><div id="rules" class="list"></div></div>
  `;
  async function j(u){ try{ const r=await fetch(u,{cache:'no-cache'}); if(!r.ok) throw 0; return await r.json(); }catch{ return null; } }
  const sec = await j('/security/boot_guard_report.json'); 
  document.getElementById('sec').textContent = sec?JSON.stringify(sec,null,2):'—';
  try{
    const r = await fetch('/security/rules/rules_index.json',{cache:'no-cache'});
    const arr = r.ok? await r.json() : [];
    document.getElementById('rules').innerHTML = arr.length?arr.map(n=>`
      <div class="row"><div>${n}</div><div class="badge"><a href="/security/rules/${n}" target="_blank">open</a></div></div>
    `).join("") : `<div class="center-text">No rules yet.</div>`;
  }catch{ document.getElementById('rules').innerHTML = `<div class="center-text">No rules yet.</div>`; }
};
