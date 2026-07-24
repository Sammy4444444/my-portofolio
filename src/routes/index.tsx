import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { PageHead } from "@/lib/page-head";
import anime1 from "@/assets/anime1.jpg";
import anime2 from "@/assets/anime2.jpg";
import anime3 from "@/assets/anime3.jpg";
import lesson1 from "@/assets/lesson1.jpg";
import lesson2 from "@/assets/lesson2.jpg";
import lesson3 from "@/assets/lesson3.jpg";
import lesson4 from "@/assets/lesson4.jpg";
import lesson5 from "@/assets/lesson5.jpg";
import lesson6 from "@/assets/lesson6.jpg";
import lesson7 from "@/assets/lesson7.jpg";
import lesson8 from "@/assets/lesson8.jpg";
import lesson9 from "@/assets/lesson9.jpg";

export default function IndexPage() {
  return (
    <>
      <PageHead
        title="Lizumihe — Graphics Programmer & Game Developer"
        description="Portfolio of Lizumihe — graphics programmer and game developer crafting rendering engines, shaders and interactive worlds."
      />
      <Portfolio />
    </>
  );
}


/* ---------- helpers ---------- */

function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [x, y]);
  return { x: sx, y: sy };
}

function RevealWord({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.15em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function MagneticButton({
  children,
  variant = "primary",
  href = "#",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={(e: React.MouseEvent<HTMLAnchorElement>) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className={
        variant === "primary"
          ? "group inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-4 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-black hover:shadow-[0_10px_30px_-10px_rgba(17,17,17,0.5)] hover:-translate-y-[1px] active:translate-y-0"
          : "group inline-flex items-center gap-2 rounded-full border border-[#ECECEC] bg-white px-7 py-4 text-sm font-medium text-[#111111] transition-all duration-300 ease-out hover:border-[#111111] hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] hover:-translate-y-[1px]"
      }
    >
      {children}
    </motion.a>
  );
}

/* ---------- sections ---------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const links = ["Work", "About", "Skills", "Blackhole", "Contact"];
  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 mix-blend-difference text-white"
      >
        <a href="#" className="font-display text-2xl tracking-tight">
          Lizumihe<span className="text-[#3B82F6]">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="opacity-70 hover:opacity-100 transition-opacity">
              {l}
            </a>
          ))}
        </div>
        <div className="hidden md:block text-xs font-mono-c opacity-70">2026.7.24</div>

        {/* mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative grid place-items-center h-9 w-9 rounded-full border border-white/30 bg-white/5 backdrop-blur-md"
        >
          <span className={`absolute h-px w-4 bg-current transition-transform ${open ? "rotate-45" : "-translate-y-1"}`} />
          <span className={`absolute h-px w-4 bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-px w-4 bg-current transition-transform ${open ? "-rotate-45" : "translate-y-1"}`} />
        </button>
      </motion.nav>

      {/* mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="absolute top-20 left-4 right-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4 text-lg font-display text-white">
                {links.map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {l}
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono-c tracking-widest text-white/60">
                2026.7.24
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const { x, y } = useMouse();
  const charX = useTransform(x, (v: number) => v * -40);
  const charY = useTransform(y, (v: number) => v * -30);
  const blobX = useTransform(x, (v: number) => v * 60);
  const blobY = useTransform(y, (v: number) => v * 40);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white pt-32 pb-20">
      {/* grid backdrop */}
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ECECEC 1px, transparent 1px), linear-gradient(to bottom, #ECECEC 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      {/* floating blobs */}
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="absolute top-[20%] right-[15%] h-[420px] w-[420px] rounded-full opacity-60 blur-3xl pointer-events-none"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#3B82F6] via-[#8b5cf6] to-[#ec4899] opacity-40" />
      </motion.div>
      <motion.div
        style={{ x: useTransform(x, (v: number) => v * -40), y: useTransform(y, (v: number) => v * -20) }}
        className="absolute bottom-[10%] left-[5%] h-[300px] w-[300px] rounded-full bg-yellow-200 opacity-40 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        {/* top meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 text-xs font-mono-c uppercase tracking-widest text-[#777777]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3B82F6] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3B82F6]" />
            </span>
            Available for select projects — Q1 2026
          </div>
          <div className="text-xs font-mono-c text-[#777777]">TOKYO ↔ REMOTE · 35.6°N</div>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 items-end">
          {/* headline */}
          <div className="col-span-12 lg:col-span-8 relative z-10">
            <h1 className="font-display text-[18vw] lg:text-[13rem] leading-[0.85] tracking-[-0.04em] text-[#111111]">
              <div>
                <RevealWord delay={0.2}>Graphics</RevealWord>
              </div>
              <div className="pl-[8vw] lg:pl-40">
                <RevealWord delay={0.35}>Engineer</RevealWord>

              </div>
              <div className="mt-2 flex items-baseline gap-4 text-[7vw] lg:text-[4.8rem] font-display font-medium tracking-[-0.03em] text-[#111111]">
                <RevealWord delay={0.55}>&amp; game</RevealWord>
                <RevealWord delay={0.7}>developer</RevealWord>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-12 max-w-md text-[15px] leading-relaxed text-[#777777]"
            >
              I build rendering pipelines, real-time shaders and playable worlds — where
              mathematics meets art. Currently crafting a Vulkan-based engine for stylized
              anime rendering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <MagneticButton href="#work">
                See selected work
                <span aria-hidden>↗</span>
              </MagneticButton>
              <MagneticButton variant="ghost" href="#contact">
                Get in touch
              </MagneticButton>
            </motion.div>
          </div>

          {/* character */}
          <motion.div
            style={{ x: charX, y: charY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-12 lg:col-span-4 relative -mt-16 lg:-mt-64 pointer-events-none"
          >
            <div className="relative aspect-square w-full max-w-[520px] mx-auto">
              <div
                className="absolute inset-6 rounded-full"
                style={{
                  background: "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.25), transparent 60%)",
                }}
              />
              <img
                src={anime1}
                alt=""
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.15)]"
                style={{ mixBlendMode: "multiply" }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-dashed border-[#111111]/30 flex items-center justify-center"
              >
                <span className="text-[10px] font-mono-c tracking-widest">◆ RENDER · SHIP · REPEAT ·</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ticker / marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 border-y border-[#ECECEC] py-4 overflow-hidden"
        >
          <div className="flex whitespace-nowrap gap-12 text-xs font-mono-c uppercase tracking-widest text-[#111111]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 shrink-0"
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-12">
                  <span>Vulkan</span><span>◆</span>
                  <span>WebGPU</span><span>◆</span>
                  <span>HLSL / GLSL</span><span>◆</span>
                  <span>Unreal Engine 5</span><span>◆</span>
                  <span>Unity DOTS</span><span>◆</span>
                  <span>Rust · wgpu</span><span>◆</span>
                  <span>Path Tracing</span><span>◆</span>
                  <span>Toon Shading</span><span>◆</span>
                  <span>C++ 23</span><span>◆</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono-c uppercase tracking-widest text-[#777777]"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="h-8 w-px bg-[#111111]"
        />
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative bg-[#F8F8F8] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-2">
            <div className="text-xs font-mono-c uppercase tracking-widest text-[#777777]">
              (01) About
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 relative">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-5xl md:text-7xl leading-[1] tracking-tight text-[#111111]"
            >
              I write code that <em className="text-[#3B82F6]">draws light</em> — pixel by pixel, frame by frame.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-10 space-y-5 max-w-lg text-[15px] leading-relaxed text-[#111111]/80"
            >
              <p>
                Seven years crafting real-time graphics for indie studios, VFX pipelines and
                one BAFTA-nominated title. I obsess over silhouettes, sub-pixel jitter and the
                exact moment a specular highlight feels alive.
              </p>
              <p className="text-[#777777]">
                Off-screen, I sketch anime, brew single-origin coffee, and lose weekends to
                open-source shader gardens.
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-4">
              {[
                { k: "07", v: "Years shipping" },
                { k: "23", v: "Games credited" },
                { k: "4.2M", v: "Players reached" },
              ].map((s, i) => (
                <motion.div
                  key={s.k}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.8 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="font-display text-4xl text-[#111111]">{s.k}</div>
                  <div className="mt-1 text-xs text-[#777777]">{s.v}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* character breaks out */}
          <div className="col-span-12 md:col-span-4 relative min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="absolute -top-24 -right-12 md:-right-24 w-[110%] pointer-events-none"
            >
              <div className="relative">
                <div className="absolute inset-8 rounded-[3rem] bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-100 blur-2xl opacity-70" />
                <img
                  src={anime3}
                  alt=""
                  className="relative w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
                  style={{ mixBlendMode: "multiply" }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="absolute top-8 -left-8 glass-card rounded-2xl px-4 py-3 text-xs font-mono-c"
                >
                  <div className="text-[#777777]">// currently</div>
                  <div className="text-[#111111]">writing a toon-BRDF</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const KAWAII_STROKE = "#3B82F6";
const kawaiiCommon = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: KAWAII_STROKE,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Sleepy cat — closed eyes
const IconSleepyCat = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <path d="M8 12 L10 7 L13 11" />
    <path d="M24 12 L22 7 L19 11" />
    <ellipse cx="16" cy="17" rx="9" ry="8" />
    <path d="M12 17c.8.8 1.6.8 2.4 0" />
    <path d="M17.6 17c.8.8 1.6.8 2.4 0" />
    <path d="M15 20.5c.6.5 1.4.5 2 0" />
  </svg>
);

// Tiny cat — small smile
const IconTinyCat = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <path d="M9 11 L11 7 L13.5 10.5" />
    <path d="M23 11 L21 7 L18.5 10.5" />
    <ellipse cx="16" cy="17" rx="8.5" ry="7.5" />
    <circle cx="13" cy="16.5" r="0.9" fill={KAWAII_STROKE} stroke="none" />
    <circle cx="19" cy="16.5" r="0.9" fill={KAWAII_STROKE} stroke="none" />
    <path d="M14.5 20c.6.6 1.9.6 2.5 0" />
  </svg>
);

// Bunny mascot
const IconBunny = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <ellipse cx="12" cy="8" rx="1.8" ry="4" />
    <ellipse cx="20" cy="8" rx="1.8" ry="4" />
    <circle cx="16" cy="18" r="7" />
    <circle cx="13.5" cy="17.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <circle cx="18.5" cy="17.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <path d="M15.2 20.5c.5.4 1.1.4 1.6 0" />
  </svg>
);

// Sitting cat silhouette
const IconSittingCat = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <path d="M10 14 L11.5 9 L14 12.5" />
    <path d="M22 14 L20.5 9 L18 12.5" />
    <path d="M9 22c0-4 3-7 7-7s7 3 7 7z" />
    <path d="M23 22c1.5-.5 2.5.5 2 2" />
    <circle cx="13.5" cy="18.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <circle cx="18.5" cy="18.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <path d="M15.2 21c.5.4 1.1.4 1.6 0" />
  </svg>
);

// Cat with tiny brush
const IconCatBrush = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <path d="M9 11 L11 7 L13.5 10.5" />
    <path d="M23 11 L21 7 L18.5 10.5" />
    <ellipse cx="15" cy="17" rx="8" ry="7" />
    <circle cx="12.5" cy="16.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <circle cx="17.5" cy="16.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <path d="M14 19.5c.5.5 1.2.5 1.7 0" />
    <path d="M23 21 L27 25" />
    <rect x="25.5" y="24" width="2.5" height="2" transform="rotate(45 26.75 25)" />
  </svg>
);

// Cat with plus sign
const IconCatMath = () => (
  <svg {...kawaiiCommon} aria-hidden>
    <path d="M8 11 L10 7 L12.5 10.5" />
    <path d="M22 11 L20 7 L17.5 10.5" />
    <ellipse cx="15" cy="17" rx="8" ry="7" />
    <circle cx="12.5" cy="16.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <circle cx="17.5" cy="16.5" r="0.8" fill={KAWAII_STROKE} stroke="none" />
    <path d="M14 19.5c.5.5 1.2.5 1.7 0" />
    <path d="M25 21 L25 26 M22.5 23.5 L27.5 23.5" />
  </svg>
);

function Skills() {
  const skills = [
    { title: "Rendering", items: ["Vulkan", "WebGPU", "OpenGL 4.6", "Metal"], Icon: IconSleepyCat },
    { title: "Shaders", items: ["HLSL", "GLSL", "WGSL", "MSL"], Icon: IconTinyCat },
    { title: "Engines", items: ["Unreal 5", "Unity", "Bevy", "Custom C++"], Icon: IconBunny },
    { title: "Systems", items: ["C++ 23", "Rust", "SIMD", "Multithreading"], Icon: IconSittingCat },
    { title: "Tools", items: ["RenderDoc", "PIX", "Nsight", "Blender"], Icon: IconCatBrush },
    { title: "Math", items: ["Linear algebra", "Numerical", "Signal", "Geometry"], Icon: IconCatMath },
  ];
  return (
    <section id="skills" className="relative bg-white py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="text-xs font-mono-c uppercase tracking-widest text-[#777777] mb-6">
              (02) Craft
            </div>
            <h2 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight text-[#111111] max-w-3xl">
              Tools of the <em className="text-[#777777]">trade</em>.
            </h2>
          </div>
          <div className="hidden md:block text-xs font-mono-c text-[#777777] max-w-[200px] text-right">
            A stack refined across seven years and countless frame budgets.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl border border-[#ECECEC] bg-white p-8 transition-shadow hover:soft-shadow"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="text-[#3B82F6]"><s.Icon /></div>
                <div className="text-xs font-mono-c text-[#777777]">0{i + 1}</div>
              </div>
              <div className="font-display text-3xl text-[#111111] mb-4">{s.title}</div>
              <div className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-[#ECECEC] px-3 py-1 text-xs text-[#111111]/70 group-hover:border-[#111111]/40 transition-colors"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectShell({
  index,
  title,
  meta,
  description,
  tags,
  children,
  reverse,
}: {
  index: string;
  title: string;
  meta: string;
  description: string;
  tags: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className={`grid grid-cols-12 gap-6 items-center ${reverse ? "" : ""}`}
    >
      <div className={`col-span-12 lg:col-span-5 ${reverse ? "lg:order-2" : ""}`}>
        <div className="text-xs font-mono-c text-[#777777] mb-4">{index} · {meta}</div>
        <h3 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#111111] mb-6">{title}</h3>
        <p className="text-[15px] leading-relaxed text-[#777777] max-w-md mb-6">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs font-mono-c text-[#111111]/70 border border-[#ECECEC] rounded-full px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className={`col-span-12 lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>{children}</div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="work" className="relative bg-[#F8F8F8] py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-24">
          <div className="text-xs font-mono-c uppercase tracking-widest text-[#777777] mb-6">
            (03) Selected work
          </div>
          <h2 className="font-display text-6xl md:text-8xl leading-[0.95] tracking-tight text-[#111111]">
            Things that <em className="italic text-[#3B82F6]">ship</em>,<br />
            things that <em className="italic text-[#777777]">render</em>.
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
          {/* Project 01 — image right, character floats */}
          <ProjectShell
            index="01"
            meta="Rendering engine · 2025"
            title="Aether — a stylised anime PBR pipeline."
            description="A custom Vulkan renderer built to reproduce the feel of hand-inked animation at 240 FPS. Custom BRDFs, gradient-based lighting and per-material outline pass."
            tags={["Vulkan", "C++23", "HLSL", "PBR"]}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#e9f0ff] via-white to-[#fef3ff] border border-[#ECECEC]">
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.3), transparent 40%)"
              }} />
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-[#111111]/10" />
                ))}
              </div>
              <motion.img
                src={anime2}
                alt=""
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="absolute right-4 bottom-0 h-[85%] object-contain drop-shadow-2xl"
                style={{ mixBlendMode: "multiply" }}
              />
              <div className="absolute top-6 left-6 glass-card rounded-2xl px-4 py-3 text-xs font-mono-c">
                <div className="text-[#777777]">frame_time</div>
                <div className="text-[#111111] text-lg font-display">4.16<span className="text-[10px] text-[#777777]">ms</span></div>
              </div>
              <div className="absolute bottom-6 left-6 glass-card rounded-2xl px-4 py-3 text-xs font-mono-c">
                <div className="text-[#777777]">// aether.fx</div>
                <div className="text-[#3B82F6]">float3 toon = smoothstep(...)</div>
              </div>
            </div>
          </ProjectShell>

          {/* Project 02 — full width */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-mono-c text-[#777777] mb-4">02 · Playlist · Spotify</div>
                <h3 className="font-display text-5xl md:text-7xl leading-[0.95] text-[#111111] max-w-3xl">
                  On repeat — my Spotify playlist.
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-[#777777] max-w-sm">
                The tracks I loop while shipping shaders and late-night builds. Hit play
                and vibe along.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-[#111111] border border-[#ECECEC]">
              <iframe
                title="Spotify playlist"
                src="https://open.spotify.com/embed/playlist/6T9fJiPZyA3ultOAjhEjIa?utm_source=generator&theme=0"
                width="100%"
                height="480"
                frameBorder={0}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-[480px] md:h-[520px] block"
              />
            </div>
          </motion.div>

          {/* Project 03 — image left */}
          <ProjectShell
            index="03"
            meta="Open source · 2023"
            title="ShaderGarden — teach shaders in the browser."
            description="A WebGPU playground with 40+ interactive lessons on rendering math. 12k stars, used by three universities as course material."
            tags={["WebGPU", "TypeScript", "WGSL", "Education"]}
            reverse
          >
            <div className="relative aspect-[5/4] rounded-3xl overflow-hidden border border-[#ECECEC] bg-white p-6">
              <div className="absolute inset-6 rounded-2xl overflow-hidden">
                <div className="h-full w-full grid grid-cols-3 grid-rows-3 gap-2">
                  {[lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9].map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-xl relative overflow-hidden bg-[#f4f4f4]"
                    >
                      <img
                        src={img}
                        alt={`lesson ${i + 1}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-1 left-2 text-[9px] font-mono-c text-white/90 drop-shadow">
                        lesson_{String(i + 1).padStart(2, "0")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute top-8 right-8 glass-card rounded-full px-3 py-1 text-[10px] font-mono-c flex items-center gap-2">
                <span className="text-[#3B82F6]">★</span> 12,347
              </div>
            </div>
          </ProjectShell>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const { x, y } = useMouse();
  const cx = useTransform(x, (v: number) => v * -30);
  const cy = useTransform(y, (v: number) => v * -20);

  return (
    <section id="contact" className="relative bg-white py-32 md:py-48 overflow-hidden">
      {/* huge gradient blob */}
      <motion.div
        style={{ x: cx, y: cy }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full blur-3xl opacity-40 pointer-events-none"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#3B82F6] via-purple-300 to-pink-200" />
      </motion.div>

      {/* cursor-following yellow light */}
      <motion.div
        style={{
          x: useTransform(x, (v: number) => v * 900),
          y: useTransform(y, (v: number) => v * 600),
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.55)_0%,rgba(251,191,36,0.25)_45%,transparent_70%)] blur-2xl opacity-0 md:opacity-100 pointer-events-none transition-opacity duration-500"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-xs font-mono-c uppercase tracking-widest text-[#777777] mb-8">
          (04) Say hi
        </div>

        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-8 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-[16vw] lg:text-[13rem] leading-[0.85] tracking-[-0.04em] text-[#111111]"
            >
              Let's <em className="italic text-[#3B82F6]">build</em><br />
              something <em className="italic">weird</em>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText("lizumihe@studio.gg");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#111111] px-8 py-5 text-white overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_-15px_rgba(17,17,17,0.6)]"
              >
                <span className="font-display text-2xl">lizumihe@studio.gg</span>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="c"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs font-mono-c text-[#3B82F6]"
                    >
                      ✓ COPIED
                    </motion.span>
                  ) : (
                    <motion.span
                      key="i"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-mono-c opacity-60"
                    >
                      TAP TO COPY
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            <div className="mt-12 flex flex-wrap gap-8 text-sm">
              {[
                { l: "GitHub", h: "https://github.com/Sammy4444444/Sammy4444444/blob/main/README.md" },
                { l: "Twitter", h: "https://twitter.com" },
                { l: "ArtStation", h: "#" },
                { l: "Read.cv", h: "#" },
              ].map((l) => (
                <a
                  key={l.l}
                  href={l.h}
                  className="relative inline-block text-[#111111] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:bg-[#111111] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500"
                >
                  {l.l} ↗
                </a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-12 lg:col-span-4 relative pointer-events-none"
          >
            <div className="relative">
              <div className="absolute inset-6 rounded-full bg-yellow-100 blur-3xl opacity-70" />
              <img
                src={anime1}
                alt=""
                className="relative w-full max-w-[460px] mx-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.15)] -scale-x-100"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-[#F8F8F8] border-t border-[#ECECEC]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-c text-[#777777]">
        <div>© 2026 LIZUMIHE · MADE WITH SHADERS &amp; CAFFEINE</div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse" />
          <span>SYSTEMS NOMINAL · 60 FPS</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- scroll progress ---------- */

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      style={{ scaleX: w, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#3B82F6] z-[60]"
    />
  );
}

/* ---------- music widget ---------- */

function MusicPlayer() {
  const DURATION = 214; // seconds
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(72);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= DURATION ? 0 : p + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pct = (progress / DURATION) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      className="fixed bottom-5 left-5 z-[55] hidden md:block"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="glass-card rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]"
        style={{ width: expanded ? 320 : 260 }}
      >
        <div className="flex items-center gap-3 p-3">
          {/* artwork */}
          <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6] via-[#8b5cf6] to-[#ec4899]" />
            <motion.div
              animate={{ rotate: playing ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-white/40 flex items-center justify-center"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white/90" />
            </motion.div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono-c uppercase tracking-widest text-[#3B82F6]">
              <span className="relative flex h-1.5 w-1.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] ${playing ? "animate-ping opacity-60" : "opacity-0"}`} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              </span>
              {playing ? "Listening to Basics In Behaviour" : "Paused"}
            </div>
            <div className="mt-0.5 truncate text-[13px] font-semibold text-[#111111]">
              Basics In Behaviour
            </div>
            <div className="truncate text-[11px] text-[#777777]">The Living Tombstone</div>
          </div>

          {/* controls */}
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous"
              className="grid h-8 w-8 place-items-center rounded-full text-[#111111]/70 transition-all duration-200 hover:bg-black/5 hover:text-[#111111]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l10-6v12z" /></svg>
            </button>
            <button
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((p) => !p)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#111111] text-white transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button
              aria-label="Next"
              className="grid h-8 w-8 place-items-center rounded-full text-[#111111]/70 transition-all duration-200 hover:bg-black/5 hover:text-[#111111]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM4.5 6l10 6-10 6z" /></svg>
            </button>
          </div>
        </div>

        {/* progress */}
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - r.left) / r.width;
              setProgress(Math.max(0, Math.min(DURATION, ratio * DURATION)));
            }}
            className="group relative block h-1 w-full rounded-full bg-black/10 overflow-visible"
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-[#111111]"
              style={{ width: `${pct}%` }}
              transition={{ ease: "linear", duration: 0.4 }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#111111] shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${pct}% - 5px)` }}
            />
          </button>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono-c text-[#777777] tabular-nums">
            <span>{fmt(progress)}</span>
            <span>-{fmt(DURATION - progress)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- black hole entry ---------- */

function BlackHoleEntry() {
  return (
    <section id="blackhole" className="relative bg-white text-[#050509] overflow-hidden py-32 md:py-48">
      {/* subtle ambient tint against the white background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(236,72,153,0.06), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="text-xs font-mono-c uppercase tracking-widest text-black/50 mb-8">
          (05) Simulation
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black aspect-square md:aspect-[4/3] lg:aspect-square">
              {/* starfield */}
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1px 1px at 40% 70%, #fff, transparent), radial-gradient(1.5px 1.5px at 80% 60%, #fff, transparent), radial-gradient(1px 1px at 60% 85%, #fff, transparent), radial-gradient(1px 1px at 15% 80%, #fff, transparent), radial-gradient(1px 1px at 90% 40%, #fff, transparent)",
                  backgroundSize: "400px 400px",
                }}
              />
              {/* accretion disk */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 grid place-items-center"
              >
                <div
                  className="h-[80%] w-[80%] rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(255,180,80,0.9), rgba(255,90,120,0.6), rgba(140,80,255,0.4), rgba(80,160,255,0.6), rgba(255,180,80,0.9))",
                    filter: "blur(18px)",
                    transform: "perspective(600px) rotateX(70deg)",
                  }}
                />
              </motion.div>
              {/* photon ring */}
              <div className="absolute inset-0 grid place-items-center">
                <div
                  className="h-[42%] w-[42%] rounded-full"
                  style={{
                    boxShadow:
                      "0 0 40px 6px rgba(255,180,80,0.55), inset 0 0 20px rgba(255,180,80,0.35)",
                  }}
                />
              </div>
              {/* event horizon */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-[36%] w-[36%] rounded-full bg-black shadow-[0_0_60px_10px_rgba(0,0,0,0.9)]" />
              </div>

              {/* corner labels */}
              <div className="absolute top-4 left-4 text-[10px] font-mono-c tracking-[0.3em] text-white/60">
                SCHWARZSCHILD · TYPE-I
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] font-mono-c text-emerald-300/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GPU RENDER · LIVE
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono-c tracking-widest text-white/50">
                / 005
              </div>
            </div>

            {/* Explore button */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <Link
                to="/black-hole"
                className="group inline-flex items-center gap-3 rounded-full bg-[#050509] px-7 py-4 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#3B82F6] hover:text-white hover:-translate-y-[1px] hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.6)]"
              >
                CLICK TO SEE THE SIMULATION
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Black Hole
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8b5cf6] to-[#ec4899]">
                Simulation.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-black/70">
              An interactive, real-time exploration of the most extreme objects in the
              universe. Watch matter spiral into a glowing accretion disk, cross the
              event horizon, and observe how gravity itself bends the fabric of
              spacetime — light warped into a perfect photon ring.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Three.js", "WebGL", "React", "GPU Accelerated"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/15 bg-black/[0.04] px-3 py-1 text-xs font-mono-c tracking-widest text-black/80"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
              {[
                { k: "Event Horizon", v: "point of no return" },
                { k: "Accretion Disk", v: "superheated matter" },
                { k: "Lensing", v: "light bent by gravity" },
                { k: "Singularity", v: "infinite density" },
              ].map((f) => (
                <div
                  key={f.k}
                  className="rounded-xl border border-black/10 bg-black/[0.03] p-4"
                >
                  <div className="text-[10px] font-mono-c tracking-[0.25em] text-[#3B82F6]">
                    {f.k.toUpperCase()}
                  </div>
                  <div className="mt-1 text-xs text-black/60">{f.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- root ---------- */


function Portfolio() {
  return (
    <div className="bg-white text-[#111111] antialiased selection:bg-[#3B82F6] selection:text-white">
      <ScrollBar />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <BlackHoleEntry />
      <Contact />
      <Footer />
      <MusicPlayer />
    </div>
  );
}
