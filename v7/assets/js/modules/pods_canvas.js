(function(){
  const c=document.createElement('canvas');c.width=800;c.height=260;c.className='pods-canvas';
  const wrap=document.createElement('section');wrap.className='pods-card';wrap.innerHTML='<div>Pods</div>';wrap.appendChild(c);
  document.body.appendChild(wrap);
  const ctx=c.getContext('2d');const COLS=16,ROWS=6,G=42,r=10;
  const color=s=>s==='ok'?'#29cc7a':s==='warn'?'#ffc857':'#ff6b6b';
  function hex(x,y,col){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;const px=x+r*Math.cos(a),py=y+r*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fillStyle=col;ctx.fill();}
  async function drawPods(){
    try{const r=await fetch('/metrics/pods_provider.json',{cache:"no-store"});const j=await r.json();draw(j.pods);}catch{draw(Array.from({length:COLS*ROWS},(_,i)=>({status:i%11?'ok':(i%5?'warn':'err')})));}setTimeout(drawPods,6000);}
  function draw(pods){ctx.clearRect(0,0,800,260);let k=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const X=20+x*G+(y%2?G/2:0),Y=20+y*G*.78;hex(X,Y,color(pods[k++]?.status||'ok'));}}
  drawPods();
})();
