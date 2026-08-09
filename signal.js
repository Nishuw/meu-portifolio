/* Signal system: curl-noise flow field background + mouse-driven form morph
   (placa → feixe → globo de conexão). Exposes window.SIGNAL */
(function () {
  const S = {};

  const VERT = `#version 300 es
  precision highp float;
  const vec2 P[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
  void main(){ gl_Position = vec4(P[gl_VertexID], 0., 1.); }`;

  const FRAG = `#version 300 es
  precision highp float;
  out vec4 fragColor;
  uniform vec2 uRes; uniform float uT; uniform float uI; uniform vec2 uM;
  uniform vec3 uInk; uniform vec3 uCopper; uniform vec3 uAmber;

  float hash(vec2 p){ p = fract(p*vec2(127.31, 311.7)); p += dot(p, p+41.3); return fract(p.x*p.y); }
  float vn(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f*f*(3.-2.*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float s = 0., a = .5;
    mat2 r = mat2(0.86,0.5,-0.5,0.86);
    for(int i=0;i<4;i++){ s += a*vn(p); p = r*p*2.03; a *= 0.5; }
    return s;
  }
  vec2 curl(vec2 p){
    float e = 0.045;
    float a = fbm(p + vec2(0., e)), b = fbm(p - vec2(0., e));
    float c = fbm(p + vec2(e, 0.)), d = fbm(p - vec2(e, 0.));
    vec2 g = vec2(a-b, -(c-d));
    return g / (length(g) + 1e-4);
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
    vec2 p = uv*1.18 + uM*0.035 + vec2(uT*0.004, 0.);
    float acc = 0., w = 1., tot = 0.;
    for(int i=0;i<14;i++){
      vec2 v = curl(p*0.82 + vec2(0., uT*0.010));
      p -= v*0.048;
      float s = vn(p*13.0 + vec2(uT*0.22, -uT*0.10));
      acc += w*pow(s, 3.0); tot += w; w *= 0.90;
    }
    acc /= tot;
    float trail = smoothstep(0.055, 0.46, acc);
    float hot = pow(trail, 3.2);

    vec3 col = uInk;
    col += uCopper * trail * 0.42 * uI;
    col += uAmber * hot * 0.55 * uI;

    float ty = 0.075*sin(uv.x*3.1 + uT*0.42) + 0.042*sin(uv.x*7.7 - uT*0.27);
    float d = abs(uv.y + 0.34 - ty);
    col += uAmber * exp(-d*210.0) * 0.42 * uI;
    col += uAmber * exp(-d*26.0) * 0.05 * uI;

    col *= 1.0 - 0.035*step(0.5, fract(gl_FragCoord.y*0.25));

    float vig = smoothstep(1.5, 0.12, length(uv*vec2(0.82, 1.0)));
    col *= 0.42 + 0.58*vig;
    col += (hash(gl_FragCoord.xy*0.61 + fract(uT)*83.0) - 0.5)*0.016;
    fragColor = vec4(col, 1.0);
  }`;

  function rgb(h, fb) {
    h = (h || fb).replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
  }

  S.initFlowField = function (canvas, opts) {
    opts = opts || {};
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const mk = (t, src) => {
      const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = mk(gl.VERTEX_SHADER, VERT), fs = mk(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(pr)); return null; }
    gl.useProgram(pr);
    const U = n => gl.getUniformLocation(pr, n);
    const uRes = U('uRes'), uT = U('uT'), uI = U('uI'), uM = U('uM'),
      uInk = U('uInk'), uCopper = U('uCopper'), uAmber = U('uAmber');

    const st = {
      alive: true, raf: 0, last: 0, mx: 0, my: 0, tx: 0, ty: 0,
      i: opts.intensity ?? 1,
      ink: rgb(opts.ink, '#0b1a20'), copper: rgb(opts.copper, '#c2713f'), amber: rgb(opts.amber, '#f0a63c')
    };
    const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      const w = Math.max(1, Math.floor((canvas.clientWidth || 1) * dpr()));
      const h = Math.max(1, Math.floor((canvas.clientHeight || 1) * dpr()));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function draw(t) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uI, st.i);
      gl.uniform2f(uM, st.tx, st.ty);
      gl.uniform3fv(uInk, st.ink); gl.uniform3fv(uCopper, st.copper); gl.uniform3fv(uAmber, st.amber);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const onMove = e => { st.mx = (e.clientX / window.innerWidth - .5) * 2; st.my = (e.clientY / window.innerHeight - .5) * 2; };
    const onResize = () => { resize(); draw(st.last); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    const t0 = performance.now();
    function frame(now) {
      if (!st.alive) return;
      resize();
      st.tx += (st.mx - st.tx) * 0.035; st.ty += (st.my - st.ty) * 0.035;
      st.last = (now - t0) / 1000;
      draw(st.last);
      st.raf = requestAnimationFrame(frame);
    }
    resize(); draw(0);
    st.raf = requestAnimationFrame(frame);

    return {
      set(o) {
        if (o.intensity != null) st.i = o.intensity;
        if (o.amber) st.amber = rgb(o.amber, '#f0a63c');
        if (o.copper) st.copper = rgb(o.copper, '#c2713f');
        if (o.ink) st.ink = rgb(o.ink, '#0b1a20');
        resize(); draw(st.last);
      },
      dispose() {
        st.alive = false; cancelAnimationFrame(st.raf);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', onResize);
      }
    };
  };

  function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  // 45° chamfered corners, PCB style
  function chamfer(pts, c) {
    if (pts.length < 3) return pts.slice();
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      const v0 = [p1[0] - p0[0], p1[1] - p0[1]];
      const v1 = [p2[0] - p1[0], p2[1] - p1[1]];
      const l0 = Math.hypot(v0[0], v0[1]), l1 = Math.hypot(v1[0], v1[1]);
      if (l0 < 1e-5 || l1 < 1e-5) { out.push(p1); continue; }
      const cc = Math.min(c, l0 * 0.45, l1 * 0.45);
      out.push([p1[0] - v0[0] / l0 * cc, p1[1] - v0[1] / l0 * cc, p1[2]]);
      out.push([p1[0] + v1[0] / l1 * cc, p1[1] + v1[1] / l1 * cc, p1[2]]);
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function resample(pts, n) {
    const seg = [], cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
      seg.push(d); cum.push(cum[i - 1] + d);
    }
    const total = cum[cum.length - 1] || 1;
    const out = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const target = (k / (n - 1)) * total;
      while (j < seg.length - 1 && cum[j + 1] < target) j++;
      const t = seg[j] > 1e-6 ? (target - cum[j]) / seg[j] : 0;
      const a = pts[j], b = pts[j + 1] || pts[j];
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
    return out;
  }

  function fib(i, n, R) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = i * 2.399963;
    return [Math.cos(th) * r * R, y * R, Math.sin(th) * r * R];
  }

  function buildForms(N, SEG) {
    const board = [], fil = [], globe = [];
    const PER_BUS = 8, g = 0.105, EDGE = 1.95;
    const BUSES = Math.ceil(N / PER_BUS);
    const R = 1.72;

    for (let i = 0; i < N; i++) {
      const r = rnd(1000 + i * 37);
      const a = i / N;

      // ---- 1. placa: bus routing, 45° corners, 3 layers ----
      const bus = Math.floor(i / PER_BUS);
      const k = i % PER_BUS - (PER_BUS - 1) / 2;
      const vertical = bus % 3 === 2;
      const z = ((bus % 3) - 1) * 0.15;
      const side = bus % 2 ? 1 : -1;
      const lane = -1.55 + ((bus + 0.5) / BUSES) * 3.1;
      const dest = 1.55 - (((bus * 5 + 2) % BUSES) + 0.5) / BUSES * 3.1;
      const mid = -0.85 + ((bus * 3) % BUSES) / BUSES * 1.7;
      const t1 = -1.20 + (bus % 4) * 0.16 + k * g;
      const t2 = 0.34 + ((bus + 2) % 4) * 0.18 + k * g;
      const e0 = lane + k * g, e1 = dest + k * g, mc = mid + k * g;
      const way = vertical ? [
        [e0, -EDGE * side, z], [e0, t1 * side, z], [mc, t1 * side, z],
        [mc, t2 * side, z], [e1, t2 * side, z], [e1, EDGE * side, z]
      ] : [
        [-EDGE * side, e0, z], [t1 * side, e0, z], [t1 * side, mc, z],
        [t2 * side, mc, z], [t2 * side, e1, z], [EDGE * side, e1, z]
      ];
      board.push(resample(chamfer(way, 0.13), SEG));

      // ---- 2. feixe: braided filament bundle ----
      const twist = 2.4 + r() * 1.6;
      const rad = 0.85 + r() * 1.10;
      const ph = r() * 6.28;
      const f = [];
      for (let s = 0; s < SEG; s++) {
        const t = s / (SEG - 1);
        const th = ph + a * 6.28 * 2.0 + t * 6.28 * twist * 0.35;
        const rr = rad * (0.75 + 0.35 * Math.sin(a * 8.3 + t * 3.1));
        const wob = 0.26 * Math.sin(a * 11.0 + t * 9.0) + 0.16 * Math.sin(t * 15.0 + ph);
        f.push([
          Math.cos(th) * (rr + wob),
          (t - 0.5) * 3.5 + 0.34 * Math.sin(a * 7.0 + t * 5.0),
          Math.sin(th) * (rr + wob) * 0.85
        ]);
      }
      fil.push(f);

      // ---- 3. globo: great-circle links between nodes on a sphere ----
      const n1 = fib(i, N, 1), n2 = fib((i * 17 + 5) % N, N, 1);
      const dot = Math.max(-1, Math.min(1, n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2]));
      const om = Math.acos(dot) || 1e-4;
      const gpts = [];
      for (let s = 0; s < SEG; s++) {
        const t = s / (SEG - 1);
        const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
        const lift = R * (1 + 0.13 * Math.sin(Math.PI * t) * (om / Math.PI));
        gpts.push([
          (n1[0] * s1 + n2[0] * s2) * lift,
          (n1[1] * s1 + n2[1] * s2) * lift,
          (n1[2] * s1 + n2[2] * s2) * lift
        ]);
      }
      globe.push(gpts);
    }
    return { forms: [board, fil, globe], R };
  }

  S.initMorph = async function (canvas, opts) {
    opts = opts || {};
    let THREE;
    try { THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js'); }
    catch (e) { console.warn('three.js unavailable', e); return null; }

    const N = 72, SEG = 40;
    const { forms } = buildForms(N, SEG);
    const FCOUNT = forms.length;
    const segCount = N * (SEG - 1) * 2;

    // flatten each form into segment-pair arrays
    const F = forms.map(form => {
      const arr = new Float32Array(segCount * 3);
      let k = 0;
      for (let i = 0; i < N; i++) {
        for (let s = 0; s < SEG - 1; s++) {
          for (const j of [s, s + 1]) {
            arr[k * 3] = form[i][j][0]; arr[k * 3 + 1] = form[i][j][1]; arr[k * 3 + 2] = form[i][j][2];
            k++;
          }
        }
      }
      return arr;
    });
    const lineId = new Float32Array(segCount);
    const along = new Float32Array(segCount);
    {
      let k = 0;
      for (let i = 0; i < N; i++) {
        for (let s = 0; s < SEG - 1; s++) {
          for (const j of [s, s + 1]) { lineId[k] = i / N; along[k] = j / (SEG - 1); k++; }
        }
      }
    }

    // node clouds (one per form): trace start / mid / sphere node
    const NF = forms.map((form, fi) => {
      const arr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const p = fi === 0 ? form[i][0] : fi === 1 ? form[i][Math.floor(SEG / 2)] : form[i][0];
        arr[i * 3] = p[0]; arr[i * 3 + 1] = p[1]; arr[i * 3 + 2] = p[2];
      }
      return arr;
    });
    const NODE_OP = [0.75, 0.18, 1.0];

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const pos = new Float32Array(F[0]);
    const col = new Float32Array(segCount * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    const group = new THREE.Group();
    group.add(lines); scene.add(group);

    const npos = new Float32Array(NF[0]);
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(npos, 3));
    const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
      color: new THREE.Color(opts.amber || '#f0a63c'), size: 0.075,
      transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    group.add(nodes);

    const FC = [
      new THREE.Color(opts.amber || '#f0a63c'),
      new THREE.Color(opts.copper || '#c2713f'),
      new THREE.Color(opts.phos || '#86c06a')
    ];

    const st = {
      alive: true, raf: 0, f: 0, target: 0, dirty: true,
      hover: false, glow: 0, drag: false, px: 0, py: 0,
      yaw: -0.22, pitch: -0.62, vyaw: 0, vpitch: 0, pulse: 0,
      speed: opts.speed ?? 1, onForm: opts.onForm || null, lastReport: -1
    };

    const tmp = new THREE.Color();
    function write() {
      const f = Math.max(0, Math.min(FCOUNT - 1 - 1e-4, st.f));
      const base = Math.floor(f), frac = f - base;
      const P0 = F[base], P1 = F[Math.min(base + 1, FCOUNT - 1)];
      const C0 = FC[base], C1 = FC[Math.min(base + 1, FCOUNT - 1)];
      const glow = st.glow;
      for (let v = 0; v < segCount; v++) {
        const a = lineId[v];
        let t = frac * 1.18 - a * 0.18;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        t = t * t * (3 - 2 * t);
        const i3 = v * 3;
        pos[i3] = P0[i3] + (P1[i3] - P0[i3]) * t;
        pos[i3 + 1] = P0[i3 + 1] + (P1[i3 + 1] - P0[i3 + 1]) * t;
        pos[i3 + 2] = P0[i3 + 2] + (P1[i3 + 2] - P0[i3 + 2]) * t;
        tmp.copy(C0).lerp(C1, t);
        let dim = (0.42 + 0.58 * (0.5 + 0.5 * Math.sin(Math.floor(a * 13.0) * 2.399)))
          * (0.5 + 0.5 * Math.abs(2 * t - 1));
        if (glow > 0.01) {
          const d = along[v] - ((st.pulse + a * 0.37) % 1);
          const dd = d - Math.round(d);
          dim *= 1 + glow * (0.55 + 2.6 * Math.exp(-(dd * dd) * 90));
        }
        col[i3] = tmp.r * dim; col[i3 + 1] = tmp.g * dim; col[i3 + 2] = tmp.b * dim;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;

      const NA = NF[base], NB = NF[Math.min(base + 1, FCOUNT - 1)];
      const ease = frac * frac * (3 - 2 * frac);
      for (let v = 0; v < N * 3; v++) npos[v] = NA[v] + (NB[v] - NA[v]) * ease;
      nodeGeo.attributes.position.needsUpdate = true;
      nodes.material.opacity = (NODE_OP[base] + (NODE_OP[Math.min(base + 1, FCOUNT - 1)] - NODE_OP[base]) * ease) * (1 + glow * 0.5);
      nodes.material.color.copy(C0).lerp(C1, ease);
      lines.material.opacity = 0.7 + glow * 0.25;

      if (st.onForm) {
        const nearest = Math.round(st.f);
        if (nearest !== st.lastReport) { st.lastReport = nearest; st.onForm(nearest, st.f); }
      }
    }
    write();

    function resize() {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // ---- pointer interaction: move across to scrub the form, drag to rotate ----
    const localX = e => {
      const r = canvas.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / Math.max(1, r.width)));
    };
    const onEnter = () => { st.hover = true; canvas.style.cursor = 'grab'; };
    const onLeave = () => {
      st.hover = false; st.drag = false;
      canvas.style.cursor = 'default';
      st.target = Math.round(st.f);            // settle on the nearest form
    };
    const onDown = e => {
      st.drag = true; st.px = e.clientX; st.py = e.clientY;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    };
    const onUp = e => {
      st.drag = false;
      canvas.style.cursor = st.hover ? 'grab' : 'default';
      canvas.releasePointerCapture && e.pointerId != null && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId) && canvas.releasePointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (st.drag) {
        const dx = e.clientX - st.px, dy = e.clientY - st.py;
        st.px = e.clientX; st.py = e.clientY;
        st.vyaw += dx * 0.0045; st.vpitch += dy * 0.0035;
      } else if (st.hover) {
        st.target = localX(e) * (FCOUNT - 1);   // scrub placa → feixe → globo
      }
    };
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointermove', onMove);
    canvas.style.touchAction = 'pan-y';

    const t0 = performance.now();
    let prevGlow = 0;
    function frame(now) {
      if (!st.alive) return;
      const t = (now - t0) / 1000;
      const d = st.target - st.f;
      if (Math.abs(d) > 0.0008) { st.f += d * 0.11; st.dirty = true; }
      const gTarget = st.hover ? 1 : 0;
      st.glow += (gTarget - st.glow) * 0.08;
      if (Math.abs(st.glow - prevGlow) > 0.002) { prevGlow = st.glow; st.dirty = true; }
      if (st.glow > 0.01) { st.pulse = (st.pulse + 0.006 * st.speed) % 1; st.dirty = true; }
      if (st.dirty) { write(); st.dirty = false; }

      st.yaw += st.vyaw; st.pitch += st.vpitch;
      st.vyaw *= 0.90; st.vpitch *= 0.90;
      st.pitch = Math.max(-1.35, Math.min(1.35, st.pitch));
      if (!st.drag) st.yaw += 0.0009 * st.speed;
      const fNorm = st.f / (FCOUNT - 1);
      group.rotation.y = st.yaw + fNorm * 0.9;
      group.rotation.x = st.pitch + fNorm * 0.55 + Math.sin(t * 0.18) * 0.03;
      group.rotation.z = fNorm * 0.08;
      renderer.render(scene, camera);
      st.raf = requestAnimationFrame(frame);
    }
    renderer.render(scene, camera);
    st.raf = requestAnimationFrame(frame);

    return {
      setForm(i) { st.target = Math.max(0, Math.min(FCOUNT - 1, i)); },
      form() { return Math.round(st.f); },
      set(o) {
        if (o.amber) { FC[0].set(o.amber); st.dirty = true; }
        if (o.copper) { FC[1].set(o.copper); st.dirty = true; }
        if (o.phos) { FC[2].set(o.phos); st.dirty = true; }
        if (o.speed != null) st.speed = o.speed;
      },
      dispose() {
        st.alive = false; cancelAnimationFrame(st.raf);
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointerenter', onEnter);
        canvas.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerup', onUp);
        canvas.removeEventListener('pointermove', onMove);
        renderer.dispose();
      }
    };
  };

  window.SIGNAL = S;
})();
