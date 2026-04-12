"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { heroData } from "@/data/personal";
import Button from "@/components/ui/Button";
import MagneticButton from "@/components/ui/MagneticButton";
import LaserTraceReveal from "@/components/ui/LaserTraceReveal";
import RotatingWords from "@/components/ui/RotatingWords";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(reduced ? 4 : 0);
  const containerRef = useRef<HTMLElement>(null);

  // Mouse-reactive background glow
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  // Start the cinematic sequence
  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => setPhase(1), 600);
    return () => clearTimeout(timer);
  }, [reduced]);

  // Typewriter for greeting
  const { display: greetingText, done: greetingDone } = useTypewriter(
    heroData.greeting,
    phase >= 1,
    50
  );

  useEffect(() => {
    if (greetingDone && phase === 1) {
      const t = setTimeout(() => setPhase(2), 250);
      return () => clearTimeout(t);
    }
  }, [greetingDone, phase]);

  const handleNameDone = useCallback(() => {
    setTimeout(() => setPhase(3), 200);
  }, []);

  // Skip headline typewriter — go straight to phase 4 after name
  useEffect(() => {
    if (phase === 3) {
      const t = setTimeout(() => setPhase(4), 100);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
    >
      {/* Mouse-reactive ambient glow — hot pink */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(800px circle at calc(var(--mx) * 100%) calc(var(--my) * 100%), rgba(255, 45, 85, 0.06), transparent 50%)`,
        }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            // @ts-expect-error custom properties
            "--mx": springX,
            "--my": springY,
          }}
        />
      </motion.div>

      {/* Secondary cyan glow — opposite corner */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-accent-secondary/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-accent-tertiary/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 w-full relative z-[2]">
        {/* Status badge */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] text-accent text-xs font-mono tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                {heroData.status}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting */}
        <div className="h-8 mb-5">
          {phase >= 1 && (
            <p className="font-mono text-accent text-sm md:text-base tracking-wide">
              {reduced ? heroData.greeting : greetingText}
              {!reduced && phase === 1 && !greetingDone && (
                <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-baseline animate-[cursor-blink_0.8s_steps(1)_infinite]" />
              )}
            </p>
          )}
          {phase === 0 && (
            <span className="inline-block w-[2px] h-[1em] bg-accent animate-[cursor-blink_0.8s_steps(1)_infinite]" />
          )}
        </div>

        {/* Name — laser trace reveal with gradient */}
        <div className="min-h-[1.15em]">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[1.05] tracking-tight">
            {reduced ? (
              <span className="gradient-text neon-glow">{heroData.name}</span>
            ) : (
              <LaserTraceReveal
                text={heroData.name}
                trigger={phase >= 2}
                className="gradient-text neon-glow"
                onComplete={handleNameDone}
              />
            )}
          </h1>
        </div>

        {/* Headline with rotating verb */}
        <div className="min-h-[1.15em] mt-4">
          {(phase >= 3 || reduced) && (
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-muted leading-[1.1] tracking-tight">
              {reduced ? (
                heroData.headline
              ) : (
                <>
                  I{" "}
                  <RotatingWords
                    words={["build", "ship", "break", "scale", "debug"]}
                    interval={2500}
                    className="text-accent-secondary"
                  />{" "}
                  things that{" "}
                  <span className="text-foreground/80">actually work.</span>
                </>
              )}
            </h2>
          )}
        </div>

        {/* Description */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-xl text-muted mt-8 text-base md:text-lg leading-relaxed"
            >
              {heroData.description}
              <span className="text-accent-secondary font-medium">
                {heroData.descriptionHighlight}
              </span>
              {heroData.descriptionEnd}
            </motion.p>
          )}
        </AnimatePresence>

        {/* CTAs */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="flex flex-wrap gap-4 mt-12"
            >
              <MagneticButton>
                <Button variant="primary" href="#projects">
                  View My Work
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button variant="secondary" href="#contact">
                  Get In Touch
                </Button>
              </MagneticButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
