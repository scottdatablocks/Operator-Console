window.HMX_RULES = async function(root){
  root.innerHTML = `
    <div class="card fade">
      <h3 class="section-title">Golden Rules (RCEP)</h3>
      <div id="lst" class="list"><div class="center-text">Loading…</div></div>
    </div>
  `;
  try{
    const r = await fetch('/security/rules/rules_index.json',{cache:'no-cache'});
    const arr = r.ok? await r.json() : [];
    document.getElementById('lst').innerHTML = arr.length?arr.map(n=>`
      <div class="row"><div>${n}</div><div class="badge"><a href="/security/rules/${n}" target="_blank">open</a></div></div>
    `).join("") : `<div class="center-text">No rules yet.</div>`;
  }catch{ document.getElementById('lst').innerHTML = `<div class="center-text">No rules yet.</div>`; }
};
