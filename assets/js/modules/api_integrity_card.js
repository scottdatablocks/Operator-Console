window.HMX_APIIntegrity=(function(){
  async function load(){
    const c=document.createElement('div');
    c.id='api-integrity-card';
    c.innerHTML='<h4>API Integrity</h4><div class="status">Loading…</div>';
    document.body.appendChild(c);
    async function refresh(){
      try{
        const r=await fetch('/metrics/probe_results.json',{cache:'no-cache'});
        if(!r.ok) throw new Error(r.status);
        const j=await r.json();
        const s=j.results||{};
        const vals=Object.values(s);
        let color='ok';
        if(vals.some(v=>v.startsWith('fail'))) color='fail';
        else if(vals.some(v=>v.startsWith('warn'))) color='warn';
        c.querySelector('.status').innerHTML=
          `<span class="${color}">${color.toUpperCase()}</span> • ${new Date(j.timestamp).toLocaleTimeString()}`;
        c.style.background=color==='ok'?'#112a17cc':color==='warn'?'#332a00cc':'#2a1111cc';
      }catch(e){
        c.querySelector('.status').innerHTML='<span class="fail">ERROR</span>';
      }
    }
    refresh(); setInterval(refresh,30000);
  }
  if(document.readyState!=='loading') load(); else document.addEventListener('DOMContentLoaded',load);
})();
