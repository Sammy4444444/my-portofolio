import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import * as THREE from "three";

/**
 * Interactive Black Hole simulation.
 * - Event horizon: black sphere
 * - Accretion disk: shader-based glowing ring
 * - Gravitational lensing: screen-space post shader that warps a starfield background
 * - Camera: orbit + zoom + subtle cursor parallax
 */
export default function BlackHoleSimulation({ variant = "section" }: { variant?: "section" | "full" } = {}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.01, 1000);
    camera.position.set(0, 1.2, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // --- Starfield (procedural in a big sphere shader) ---
    const starGeo = new THREE.SphereGeometry(60, 64, 64);
    const starMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        uTime: { value: 0 },
        uHolePos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vDir;
        uniform float uTime;

        float hash(vec3 p){
          p = fract(p * 0.3183099 + vec3(0.71,0.113,0.419));
          p *= 17.0;
          return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
        }
        float stars(vec3 d, float density, float sharpness){
          vec3 g = floor(d*density);
          float h = hash(g);
          float s = smoothstep(1.0-sharpness, 1.0, h);
          // twinkle
          s *= 0.6 + 0.4*sin(uTime*2.0 + h*40.0);
          return s;
        }
        void main(){
          vec3 d = normalize(vDir);
          float s1 = stars(d, 160.0, 0.006);
          float s2 = stars(d, 80.0, 0.003) * 0.6;
          // nebula tint
          float n = 0.5 + 0.5*sin(d.x*3.0 + d.y*2.0);
          vec3 neb = mix(vec3(0.04,0.02,0.09), vec3(0.09,0.03,0.15), n) * 0.35;
          neb += vec3(0.02,0.03,0.08);
          vec3 col = neb + vec3(s1+s2);
          // slight orange band toward galactic plane
          col += vec3(0.6,0.35,0.15) * pow(max(0.0, 1.0-abs(d.y)), 20.0) * 0.15;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const starSphere = new THREE.Mesh(starGeo, starMat);
    scene.add(starSphere);

    // --- Event horizon (matte black sphere with subtle rim) ---
    const horizonRadius = 1.0;
    const horizonGeo = new THREE.SphereGeometry(horizonRadius, 64, 64);
    const horizonMat = new THREE.ShaderMaterial({
      uniforms: { uCam: { value: new THREE.Vector3() } },
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vP;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position,1.0);
          vP = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vN;
        varying vec3 vP;
        uniform vec3 uCam;
        void main(){
          vec3 V = normalize(uCam - vP);
          float rim = 1.0 - max(dot(V, normalize(vN)), 0.0);
          rim = pow(rim, 3.0);
          vec3 col = vec3(0.0);
          // photon ring hint
          col += vec3(1.0, 0.65, 0.25) * rim * 0.35;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    scene.add(horizon);

    // --- Accretion disk ---
    const diskGeo = new THREE.RingGeometry(1.35, 4.2, 256, 8);
    const diskMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vP;
        void main(){
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position,1.0);
          vP = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vP;
        uniform float uTime;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
        float noise(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p);
          float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
        }
        void main(){
          float r = length(vP.xz);
          float inner = 1.35, outer = 4.2;
          float t = (r-inner)/(outer-inner);
          if (t<0.0 || t>1.0) discard;
          float ang = atan(vP.z, vP.x);
          // spiral turbulence
          float spin = uTime*1.2;
          float n = noise(vec2(ang*4.0 + spin + r*2.0, r*3.0 - spin*0.5));
          n = pow(n, 1.5);
          // temperature: hot near inside
          vec3 hot = vec3(1.0, 0.95, 0.75);
          vec3 mid = vec3(1.0, 0.55, 0.15);
          vec3 cold= vec3(0.35, 0.1, 0.4);
          vec3 col = mix(hot, mid, smoothstep(0.0,0.35,t));
          col = mix(col, cold, smoothstep(0.55,1.0,t));
          // relativistic beaming (bright on one side)
          float beam = 0.7 + 0.6 * cos(ang);
          col *= beam;
          // radial falloff
          float edge = smoothstep(0.0,0.08,t) * smoothstep(1.0,0.75,t);
          float a = edge * (0.35 + 0.9*n);
          gl_FragColor = vec4(col*a*2.2, a);
        }
      `,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 2;
    disk.rotation.z = 0.35;
    scene.add(disk);

    // Tilt whole system slightly
    const system = new THREE.Group();
    scene.add(system);

    // --- Lensing halo: additive sphere shader that fakes bent light around horizon ---
    const haloGeo = new THREE.SphereGeometry(1.15, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: { uCam: { value: new THREE.Vector3() }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vP;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position,1.0);
          vP = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vN; varying vec3 vP;
        uniform vec3 uCam; uniform float uTime;
        void main(){
          vec3 V = normalize(uCam - vP);
          float f = 1.0 - max(dot(V, normalize(vN)), 0.0);
          float ring = pow(f, 6.0);
          vec3 col = vec3(1.0,0.75,0.4)*ring*1.2 + vec3(0.35,0.55,1.0)*pow(f,12.0)*0.6;
          gl_FragColor = vec4(col, ring);
        }
      `,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    scene.add(halo);

    // --- Dust particles ---
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 4 + Math.random() * 15;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xaab8ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(pGeo, pMat);
    scene.add(dust);

    // --- Orbit controls (manual, lightweight) ---
    let yaw = 0.4;
    let pitch = 0.35;
    let targetYaw = yaw;
    let targetPitch = pitch;
    let distance = 7;
    let targetDistance = 7;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const el = renderer.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      el.style.cursor = "grab";
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      targetYaw -= dx * 0.005;
      targetPitch -= dy * 0.005;
      targetPitch = Math.max(-1.3, Math.min(1.3, targetPitch));
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistance *= 1 + e.deltaY * 0.0012;
      targetDistance = Math.max(2.5, Math.min(20, targetDistance));
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("wheel", onWheel, { passive: false });

    // Touch pinch
    let pinchStart = 0;
    let pinchDist = 0;
    const touchDist = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.hypot(dx, dy);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart = touchDist(e.touches);
        pinchDist = targetDistance;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const d = touchDist(e.touches);
        targetDistance = Math.max(2.5, Math.min(20, pinchDist * (pinchStart / d)));
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    mount.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Animation loop
    const clock = new THREE.Clock();
    let rafId = 0;
    let running = true;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) running = e.isIntersecting;
    });
    io.observe(mount);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!running) return;
      const t = clock.getElapsedTime();

      // interpolation
      yaw += (targetYaw - yaw) * 0.08;
      pitch += (targetPitch - pitch) * 0.08;
      distance += (targetDistance - distance) * 0.08;

      const parallaxYaw = yaw + mx * 0.15;
      const parallaxPitch = pitch + my * 0.12;

      const cx = Math.cos(parallaxPitch) * Math.sin(parallaxYaw) * distance;
      const cy = Math.sin(parallaxPitch) * distance;
      const cz = Math.cos(parallaxPitch) * Math.cos(parallaxYaw) * distance;
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);

      diskMat.uniforms.uTime.value = t;
      starMat.uniforms.uTime.value = t;
      horizonMat.uniforms.uCam.value.copy(camera.position);
      haloMat.uniforms.uCam.value.copy(camera.position);
      haloMat.uniforms.uTime.value = t;

      disk.rotation.z = t * 0.05 + 0.35;
      dust.rotation.y = t * 0.02;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      mount.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      renderer.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
    };
  }, []);

  const labels: { id: string; title: string; desc: string }[] = [
    { id: "EVENT HORIZON", title: "Event Horizon", desc: "The boundary beyond which escape from the black hole is impossible — not even light returns." },
    { id: "ACCRETION DISK", title: "Accretion Disk", desc: "A rotating disk of superheated matter spiraling around the black hole, glowing across the spectrum." },
    { id: "GRAVITATIONAL LENSING", title: "Gravitational Lensing", desc: "The bending of light caused by the extreme curvature of spacetime around massive objects." },
    { id: "SINGULARITY", title: "Singularity", desc: "The point at the center where density becomes infinite and known physics breaks down." },
  ];

  if (variant === "full") {
    return (
      <div className="relative w-full h-[100dvh] bg-[#050509] text-white overflow-hidden">
        <div ref={mountRef} className="absolute inset-0" />

        {/* HUD grid */}
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, transparent 40%, black 100%)",
        }}/>

        {/* Info top-left (hidden on very small) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden sm:block absolute top-20 left-4 md:top-24 md:left-8 max-w-[280px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
        >
          <div className="text-[10px] font-mono-c tracking-[0.3em] text-white/50">BLACK HOLE SIMULATION</div>
          <div className="mt-2 text-sm text-white/80 leading-relaxed">
            Explore the visual effects of extreme gravity and spacetime distortion.
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-c text-emerald-300/80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE · GPU RENDER
          </div>
        </motion.div>

        {/* Controls hint */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-8 text-[10px] font-mono-c tracking-widest text-white/50 space-y-1">
          <div>DRAG · ROTATE</div>
          <div>SCROLL · ZOOM</div>
          <div>PINCH · MOBILE ZOOM</div>
        </div>

        {/* Labels */}
        <div className="absolute top-20 right-4 md:top-24 md:right-8 flex flex-col gap-2 items-end max-w-[60vw]">
          {labels.map((l) => (
            <button
              key={l.id}
              onMouseEnter={() => setActiveLabel(l.id)}
              onMouseLeave={() => setActiveLabel(null)}
              onFocus={() => setActiveLabel(l.id)}
              onBlur={() => setActiveLabel(null)}
              onClick={() => setActiveLabel((v) => (v === l.id ? null : l.id))}
              className={`text-[9px] md:text-[10px] font-mono-c tracking-[0.25em] px-3 py-1.5 rounded-full border transition-all ${
                activeLabel === l.id
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white/90 hover:border-white/20"
              }`}
            >
              {l.id}
            </button>
          ))}
        </div>

        {/* Description panel */}
        <motion.div
          key={activeLabel ?? "default"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-8 max-w-[320px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
        >
          {activeLabel ? (
            (() => {
              const l = labels.find((x) => x.id === activeLabel)!;
              return (
                <>
                  <div className="text-[10px] font-mono-c tracking-[0.3em] text-[#3B82F6]">{l.id}</div>
                  <div className="mt-1 text-sm text-white/85 font-display">{l.title}</div>
                  <div className="mt-2 text-xs text-white/60 leading-relaxed">{l.desc}</div>
                </>
              );
            })()
          ) : (
            <>
              <div className="text-[10px] font-mono-c tracking-[0.3em] text-white/50">OBSERVATION</div>
              <div className="mt-1 text-sm text-white/85 font-display">Schwarzschild-type</div>
              <div className="mt-2 text-xs text-white/60 leading-relaxed">
                A non-rotating black hole with a hot accretion disk and photon ring.
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <section id="blackhole" className="relative w-full bg-[#050509] text-white overflow-hidden">

      {/* subtle gradient / grain to blend with the dark section */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.08), transparent 60%)",
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24">
        {/* header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="text-xs font-mono-c tracking-[0.3em] opacity-60">/ 005 — SIMULATION</div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mt-3">
              Black Hole<br />
              <span className="text-gradient-accent">Simulation.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
              An interactive exploration of black holes, gravitational lensing, and spacetime visualization.
            </p>
          </div>
          <div className="text-xs font-mono-c tracking-widest text-white/50">
            React • Three.js • WebGL • GPU Accelerated Rendering
          </div>
        </div>

        {/* canvas + panels */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black" style={{ aspectRatio: "16 / 9" }}>
          <div ref={mountRef} className="absolute inset-0" />

          {/* Scanline / HUD grid */}
          <div className="pointer-events-none absolute inset-0 opacity-30" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, transparent 40%, black 100%)",
          }}/>

          {/* Floating info card top-left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute top-4 left-4 md:top-6 md:left-6 max-w-[280px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
          >
            <div className="text-[10px] font-mono-c tracking-[0.3em] text-white/50">BLACK HOLE SIMULATION</div>
            <div className="mt-2 text-sm text-white/80 leading-relaxed">
              Explore the visual effects of extreme gravity and spacetime distortion.
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-c text-emerald-300/80">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE · GPU RENDER
            </div>
          </motion.div>

          {/* Controls hint bottom-left */}
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-[10px] font-mono-c tracking-widest text-white/40 space-y-1">
            <div>DRAG · ROTATE</div>
            <div>SCROLL · ZOOM</div>
            <div>PINCH · MOBILE ZOOM</div>
          </div>

          {/* Labels right side */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-2 items-end">
            {labels.map((l) => (
              <button
                key={l.id}
                onMouseEnter={() => setActiveLabel(l.id)}
                onMouseLeave={() => setActiveLabel(null)}
                onFocus={() => setActiveLabel(l.id)}
                onBlur={() => setActiveLabel(null)}
                className={`text-[10px] font-mono-c tracking-[0.25em] px-3 py-1.5 rounded-full border transition-all ${
                  activeLabel === l.id
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80 hover:border-white/20"
                }`}
              >
                {l.id}
              </button>
            ))}
          </div>

          {/* Description panel bottom-right */}
          <motion.div
            key={activeLabel ?? "default"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 max-w-[320px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4"
          >
            {activeLabel ? (
              (() => {
                const l = labels.find((x) => x.id === activeLabel)!;
                return (
                  <>
                    <div className="text-[10px] font-mono-c tracking-[0.3em] text-[#3B82F6]">{l.id}</div>
                    <div className="mt-1 text-sm text-white/85 font-display">{l.title}</div>
                    <div className="mt-2 text-xs text-white/60 leading-relaxed">{l.desc}</div>
                  </>
                );
              })()
            ) : (
              <>
                <div className="text-[10px] font-mono-c tracking-[0.3em] text-white/50">OBSERVATION</div>
                <div className="mt-1 text-sm text-white/85 font-display">Schwarzschild-type</div>
                <div className="mt-2 text-xs text-white/60 leading-relaxed">
                  A non-rotating black hole with a hot accretion disk and photon ring. Hover a label to learn more.
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Bottom glossary strip */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {labels.map((l) => (
            <div key={l.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-colors">
              <div className="text-[10px] font-mono-c tracking-[0.3em] text-[#3B82F6]">{l.id}</div>
              <div className="mt-2 font-display text-lg">{l.title}</div>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
