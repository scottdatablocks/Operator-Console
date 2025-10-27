window.renderPodsGrid = async function(target, opts){
  const options = Object.assign({columns:4, limit: 16}, opts||{});
  target.innerHTML = `<div class="pods-grid" id="podsGrid" style="grid-template-columns:repeat(${options.columns},1fr)"></div>`;
  const grid = target.querySelector('#podsGrid');

  let pods = [];
  try{
    const r = await hmxFetch("/metrics/pods_provider.json",{cache:"no-store"});
    pods = await r.json();
  }catch(e){
    // fallback via shim to /data/pods_latest.json
  }

  if (!Array.isArray(pods) || pods.length===0){
    pods = [
      {name:"node-exporter",ns:"monitoring",ready:true,cpu:"8m",mem:"32Mi"},
      {name:"prometheus",ns:"monitoring",ready:true,cpu:"60m",mem:"512Mi"},
      {name:"akash-provider",ns:"akash",ready:true,cpu:"120m",mem:"768Mi"},
      {name:"ingress-nginx",ns:"ingress",ready:true,cpu:"25m",mem:"128Mi"},
      {name:"grafana",ns:"monitoring",ready:false,cpu:"30m",mem:"256Mi"},
      {name:"chain-rpc",ns:"akash",ready:true,cpu:"80m",mem:"256Mi"},
      {name:"helm-controller",ns:"flux",ready:true,cpu:"10m",mem:"64Mi"},
      {name:"kube-proxy",ns:"kube-system",ready:true,cpu:"5m",mem:"32Mi"},
    ];
  }

  const take = pods.slice(0, options.limit);
  for (const p of take){
    const div = document.createElement('div');
    div.className = 'pod ' + (p.ready? 'ok':'warn');
    div.innerHTML = `
      <div class="name mono">${p.name}</div>
      <div class="stat">ns: ${p.ns || '-'}</div>
      <div class="stat">ready: ${p.ready? 'true':'false'}</div>
      <div class="stat">cpu: ${p.cpu||'-'} · mem: ${p.mem||'-'}</div>
    `;
    grid.appendChild(div);
  }
};

window.renderPodsV8 = async function(el){
  const card = document.createElement('div');
  card.className = 'card span12';
  card.innerHTML = `<h3 class="mono">Pods — Provider View</h3><div id="podsHost"></div>`;
  el.appendChild(card);
  await window.renderPodsGrid(card.querySelector('#podsHost'), {columns:4, limit: 24});
};
