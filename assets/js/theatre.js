window.HMX_Theatre = (function(){
  let raf;
  function start(canvasId='theatre-canvas'){
    const mount = document.getElementById(canvasId);
    if(!mount) return;
    // If THREE is present -> 3D, else 2D
    if(window.THREE){
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0d12);
      const w = mount.clientWidth, h = mount.clientHeight;
      const camera = new THREE.PerspectiveCamera(60, w/h, .1, 1000);
      camera.position.z = 4.2;
      const renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setSize(w,h); mount.innerHTML=''; mount.appendChild(renderer.domElement);
      const geo = new THREE.SphereGeometry(1.6,64,64);
      const mat = new THREE.MeshStandardMaterial({color:0x1749ff, roughness:.35, metalness:.1});
      const sphere = new THREE.Mesh(geo, mat); scene.add(sphere);
      const key = new THREE.PointLight(0x6fa8ff, 1.2); key.position.set(3,2,3); scene.add(key);
      const rim = new THREE.PointLight(0x1133ff, .8); rim.position.set(-3,-2,-4); scene.add(rim);
      function loop(){
        raf = requestAnimationFrame(loop);
        sphere.rotation.y += 0.003; sphere.rotation.x += 0.0015;
        renderer.render(scene,camera);
      }
      loop();
      window.addEventListener('resize', () => {
        const W = mount.clientWidth, H = mount.clientHeight;
        renderer.setSize(W,H); camera.aspect = W/H; camera.updateProjectionMatrix();
      });
    } else {
      // 2D fallback
      const c = document.createElement('canvas'); c.className='canvas2d';
      const ctx = c.getContext('2d'); mount.innerHTML=''; mount.appendChild(c);
      function size(){ c.width = mount.clientWidth; c.height = mount.clientHeight; }
      size(); window.addEventListener('resize', size);
      let t = 0;
      function draw(){
        raf = requestAnimationFrame(draw); t+=0.01;
        ctx.clearRect(0,0,c.width,c.height);
        const cx=c.width/2, cy=c.height/2; const r=Math.min(cx,cy)*0.75;
        const g=ctx.createRadialGradient(cx+r*.25*Math.cos(t), cy+r*.25*Math.sin(t), r*.1, cx, cy, r);
        g.addColorStop(0,'#4d83ff'); g.addColorStop(1,'#0e265a');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();
      }
      draw();
    }
  }
  function stop(){ if(raf) cancelAnimationFrame(raf); }
  return {start, stop};
})();
