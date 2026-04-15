"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent-tertiary to-accent-secondary z-[60] origin-left shadow-[0_0_10px_rgba(255,45,85,0.5),0_0_20px_rgba(255,45,85,0.2)]"
      style={{ scaleX }}
    />
  );
}
