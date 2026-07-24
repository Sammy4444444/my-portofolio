import { Link } from "react-router-dom";
import { motion } from "motion/react";
import BlackHoleSimulation from "@/components/BlackHoleSimulation";
import { PageHead } from "@/lib/page-head";

export default function BlackHolePage() {
  return (
    <>
      <PageHead
        title="Black Hole Simulation — Lizumihe"
        description="An interactive 3D black hole simulation — accretion disk, event horizon and gravitational lensing rendered in real time with WebGL."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="relative w-full h-[100dvh] bg-[#050509] overflow-hidden"
      >
        <BlackHoleSimulation variant="full" />

        <Link
          to="/"
          className="fixed top-4 left-4 md:top-6 md:left-8 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[11px] font-mono-c tracking-[0.25em] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 active:scale-95"
        >
          <span aria-hidden>←</span>
          BACK TO PORTFOLIO
        </Link>
      </motion.div>
    </>
  );
}
