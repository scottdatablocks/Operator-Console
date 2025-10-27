(function(){
  const INDEX_URL = '/security/rules/rules_index.json';
  const SELECTORS = ['#app', 'main', '#view', '#content'];
  function pickRoot(){for(const s of SELECTORS){const e=document.querySelector(s);if(e)return e;}
    const d=document.createElement('div');d.id='app';document.body.appendChild(d);return d;}
  async function fetchJSON(u){try{const r=await fetch(u);return await r.json();}catch(e){return []}}
  async function fetchText(u){try{const r=await fetch(u);return await r.text();}catch(e){return ''}}
  function mdToHtml(m){return m.replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}
  async function render(){
    const root=pickRoot();root.innerHTML='<section class="rules-wrap"><div class="rules-head"><h1>Golden Rules</h1><span class="meta">loading…</span></div><div id="rules-grid" class="rules-grid"></div></section>';
    const meta=root.querySelector('.meta'),grid=root.querySelector('#rules-grid');
    const idx=await fetchJSON(INDEX_URL);
    if(!idx.length){meta.textContent='0 rules';grid.innerHTML='<div class="rules-empty">No Golden Rules yet.</div>';return;}
    meta.textContent=idx.length+' rule'+(idx.length>1?'s':'');
    const html=await Promise.all(idx.map(async f=>{const t=await fetchText('/security/rules/'+f);return '<article class="rule-card"><div class="rule-body">'+mdToHtml(t)+'</div></article>'}));
    grid.innerHTML=html.join('');
  }
  if(location.hash==='#/rules')render();
  window.addEventListener('hashchange',()=>{if(location.hash==='#/rules')render()});
})();
