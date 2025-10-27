(function(){
  async function getData(u){try{const r=await fetch(u,{cache:"no-store"});return r.ok?await r.json():null}catch{return null}}
  const c=document.createElement('section');
  c.innerHTML=`<div class="metric-bars">
  <div class="metric-bar" id="cpu"><span></span></div>
  <div class="metric-bar" id="mem"><span></span></div>
  <div class="metric-bar" id="load"><span></span></div></div>`;
  document.body.prepend(c);
  async function update(){
    const d=await getData('/metrics/runtime_status.json');
    const set=(id,v)=>{const b=document.querySelector('#'+id+' span');if(b)b.style.width=v+'%';};
    set('cpu',d?.cpu_pct||0);
    set('mem',d?.mem_pct||0);
    set('load',Math.min(100,(d?.load1||0)*50));
    setTimeout(update,5000);
  }update();
})();
