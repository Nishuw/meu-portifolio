/* WebGL background field + three.js hero lattice. Exposes window.RNGL */
(function () {
  const RNGL = {};

  const VERT = `#version 300 es
  precision highp float;
  const vec2 P[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
  void main(){ gl_Position = vec4(P[gl_VertexID], 0., 1.); }`;

  const FRAG = `#version 300 es
  precision highp float;
  out vec4 fragColor;
  uniform vec2 uRes; uniform float uT; uniform vec3 uA; uniform vec3 uB; uniform float uI;
  uniform vec2 uM;

  float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+34.56); return fract(p.x*p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.-2.*f);
    float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float s = 0., a = .5;
    mat2 r = mat2(0.8,0.6,-0.6,0.8);
    for(int i=0;i<5;i++){ s += a*vnoise(p); p = r*p*2.02; a *= 0.5; }
    return s;
  }
  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
    vec2 q = uv*1.15 + uM*0.06;
    float t = uT*0.022;
    vec2 w = vec2(fbm(q + vec2(t, -t*0.7)), fbm(q + vec2(4.2 - t*0.6, 1.3 + t)));
    float f = fbm(q*1.35 + w*1.9 + vec2(0., t*1.6));
    float bands = smoothstep(0.36, 0.98, f);
    float veil = pow(smoothstep(0.46, 1.02, fbm(q*0.75 - w*1.2)), 3.0);

    vec3 col = vec3(0.016, 0.019, 0.027);
    col = mix(col, uA*0.6, pow(bands, 1.7)*uI);
    col += uB*0.30*uI*veil;

    // slow horizontal light sheet
    float sheet = exp(-pow((uv.y + 0.15 + 0.10*sin(uT*0.09 + uv.x*1.4))*3.4, 2.0));
    col += uA*0.10*uI*sheet;

    float vig = smoothstep(1.45, 0.15, length(uv*vec2(0.85, 1.0)));
    col *= 0.30 + 0.70*vig;
    col += (hash(gl_FragCoord.xy*0.7 + fract(uT)*97.0) - 0.5)*0.018;
    fragColor = vec4(col, 1.0);
  }`;

  function hexToRgb(h) {
    h = (h || '#5be1c2').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }

  RNGL.initBackground = function (canvas, opts) {
    opts = opts || {};
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    gl.useProgram(p);
    const U = n => gl.getUniformLocation(p, n);
    const uRes = U('uRes'), uT = U('uT'), uA = U('uA'), uB = U('uB'), uI = U('uI'), uM = U('uM');

    const state = { intensity: opts.intensity ?? 1, a: hexToRgb(opts.accent), b: hexToRgb(opts.accent2), mx: 0, my: 0, raf: 0, alive: true };
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr()));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr()));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    function draw(t) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform3fv(uA, state.a); gl.uniform3fv(uB, state.b);
      gl.uniform1f(uI, state.intensity);
      gl.uniform2f(uM, tx, ty);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const onMove = e => { state.mx = (e.clientX / window.innerWidth - 0.5) * 2; state.my = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', onMove, { passive: true });
    const onResize = () => { resize(); draw(state.last); };
    window.addEventListener('resize', onResize);

    let tx = 0, ty = 0;
    const t0 = performance.now();
    function frame(now) {
      if (!state.alive) return;
      resize();
      tx += (state.mx - tx) * 0.04; ty += (state.my - ty) * 0.04;
      state.last = (now - t0) / 1000;
      draw(state.last);
      state.raf = requestAnimationFrame(frame);
    }
    state.last = 0;
    resize();
    draw(0);
    state.raf = requestAnimationFrame(frame);
    return {
      set(o) { if (o.accent) state.a = hexToRgb(o.accent); if (o.accent2) state.b = hexToRgb(o.accent2); if (o.intensity != null) state.intensity = o.intensity; resize(); draw(state.last); },
      dispose() { state.alive = false; cancelAnimationFrame(state.raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); }
    };
  };

  RNGL.initHero = async function (canvas, opts) {
    opts = opts || {};
    let THREE;
    try { THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js'); }
    catch (e) { console.warn('three.js unavailable', e); return null; }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const accent = new THREE.Color(opts.accent || '#5be1c2');
    const accent2 = new THREE.Color(opts.accent2 || '#7c8cff');
    const group = new THREE.Group();
    scene.add(group);

    // outer lattice
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const outer = new THREE.LineSegments(
      new THREE.WireframeGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.30 })
    );
    group.add(outer);

    // nodes at lattice vertices
    const nodes = new THREE.Points(
      outerGeo,
      new THREE.PointsMaterial({ color: accent, size: 0.055, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    group.add(nodes);

    // inner shell
    const innerGeo = new THREE.IcosahedronGeometry(1.24, 1);
    const inner = new THREE.Mesh(innerGeo, new THREE.MeshBasicMaterial({
      color: accent2, transparent: true, opacity: 0.10, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    group.add(inner);
    const innerEdges = new THREE.LineSegments(
      new THREE.WireframeGeometry(innerGeo),
      new THREE.LineBasicMaterial({ color: accent2, transparent: true, opacity: 0.5 })
    );
    group.add(innerEdges);

    // core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    group.add(core);
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 24),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    group.add(halo);

    // orbit rings
    const rings = [];
    [[2.55, 0.012, 0x000000, 1.1, 0.35], [2.95, 0.008, 0x000000, -0.5, 0.9]].forEach(([r, tube, _c, tilt, spin], i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 6, 220),
        new THREE.MeshBasicMaterial({ color: i ? accent2 : accent, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      m.rotation.x = tilt; m.rotation.y = i * 0.7;
      m.userData.spin = spin;
      rings.push(m); group.add(m);
    });

    // travelling signal dots along rings
    const signals = [];
    for (let i = 0; i < 6; i++) {
      const d = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 12, 10),
        new THREE.MeshBasicMaterial({ color: i % 2 ? accent2 : accent, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      d.userData = { ring: rings[i % rings.length], r: i % 2 ? 2.95 : 2.55, off: (i / 6) * Math.PI * 2, sp: 0.5 + (i % 3) * 0.18 };
      signals.push(d); group.add(d);
    }

    const state = { alive: true, raf: 0, mx: 0, my: 0, tx: 0, ty: 0, speed: opts.speed ?? 1 };
    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      state.mx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2;
      state.my = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    function resize() {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    const t0 = performance.now();
    function frame(now) {
      if (!state.alive) return;
      const t = (now - t0) / 1000 * state.speed;
      state.tx += (state.mx - state.tx) * 0.05; state.ty += (state.my - state.ty) * 0.05;
      group.rotation.y = t * 0.16 + state.tx * 0.5;
      group.rotation.x = Math.sin(t * 0.11) * 0.16 + state.ty * 0.35;
      inner.rotation.y = innerEdges.rotation.y = -t * 0.42;
      inner.rotation.z = innerEdges.rotation.z = t * 0.2;
      nodes.rotation.copy(outer.rotation);
      const pulse = 0.9 + Math.sin(t * 1.7) * 0.12;
      core.scale.setScalar(pulse);
      halo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.14);
      rings.forEach(m => { m.rotation.z += 0.002 * m.userData.spin * state.speed; });
      signals.forEach(d => {
        const a = t * d.userData.sp + d.userData.off;
        const v = new THREE.Vector3(Math.cos(a) * d.userData.r, Math.sin(a) * d.userData.r, 0);
        d.userData.ring.localToWorld(v);
        group.worldToLocal(v);
        d.position.copy(v);
      });
      renderer.render(scene, camera);
      state.raf = requestAnimationFrame(frame);
    }
    state.raf = requestAnimationFrame(frame);

    return {
      set(o) {
        if (o.accent) { [outer.material, nodes.material, halo.material, rings[0].material].forEach(m => m.color.set(o.accent)); }
        if (o.accent2) { [inner.material, innerEdges.material, rings[1].material].forEach(m => m.color.set(o.accent2)); }
        if (o.speed != null) state.speed = o.speed;
      },
      dispose() {
        state.alive = false; cancelAnimationFrame(state.raf);
        window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', resize);
        renderer.dispose();
      }
    };
  };

  window.RNGL = RNGL;
})();
