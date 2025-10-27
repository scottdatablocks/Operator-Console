window.HMX_PODS = async function(root){
  root.innerHTML = `
    <div class="card fade">
      <h3 class="section-title">Provider Pods</h3>
      <div id="pods" class="list"><div class="center-text">Fetching …</div></div>
      <div class="mono" style="opacity:.7;margin-top:8px">Namespace: akash-services</div>
    </div>
  `;
  try{
    // Expect a local exporter (can be swapped to kubectl proxy or harmonix bridge)
    const r = await fetch('/metrics/pods_provider.json',{cache:'no-cache'});
    const j = r.ok ? await r.json() : {items:[]};
    const html = (j.items||[]).map(p=>`
      <div class="row">
        <div>${p.metadata?.name||'pod'}</div>
        <div class="badge">${p.status?.phase||'—'} · ${p.status?.containerStatuses?.[0]?.ready?'ready':'not ready'}</div>
      </div>
    `).join("") || `<div class="center-text">No pods reported yet.</div>`;
    document.getElementById('pods').innerHTML = html;
  }catch{ document.getElementById('pods').innerHTML = `<div class="center-text">Failed to fetch pods.</div>`; }
};
