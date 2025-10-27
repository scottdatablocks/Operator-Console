window.renderTheatreV8 = async function(el){
  const card = document.createElement('div');
  card.className = 'card span12';
  card.innerHTML = `<h3 class="mono">Theatre</h3>
    <div class="canvas-wrap"><canvas id="thCanvas" width="1200" height="260"></canvas></div>
    <div class="three-note mono">If a blue sphere and pulse gauge appear, Theatre Mode is operational.</div>`;
  el.appendChild(card);

  const ctx = card.querySelector('#thCanvas').getContext('2d');
  let t = 0;
  function draw(){
    t+=0.02;
    ctx.clearRect(0,0,1200,260);
    // sphere glow
    const x=160, y=130, r=48+Math.sin(t)*6;
    const g = ctx.createRadialGradient(x,y,8,x,y,r);
    g.addColorStop(0,'rgba(77,214,255,0.85)');
    g.addColorStop(1,'rgba(77,214,255,0.05)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();

    // pulse gauge
    const bx=380, by=130, w=740, h=14;
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.strokeRect(bx,by-h/2,w,h);
    const pct = (Math.sin(t)+1)/2; // 0..1
    ctx.fillStyle='rgba(43,217,139,.8)';
    ctx.fillRect(bx+1, by-h/2+1, (w-2)*pct, h-2);

    requestAnimationFrame(draw);
  }
  draw();
};
