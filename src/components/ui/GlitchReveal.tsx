"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GLITCH = "!<>-_\\/[]{}—=+*^?#01αβ▀▄█▓░▒╔╗╚╝";

interface GlitchRevealProps {
  text: string;
  trigger: boolean;
  className?: string;
  onComplete?: () => void;
}

export default function GlitchReveal({
  text,
  trigger,
  className = "",
  onComplete,
}: GlitchRevealProps) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  const [laserProgress, setLaserProgress] = useState(0); // 0 to 1
  const [showLaser, setShowLaser] = useState(false);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    if (!trigger || done) return;

    const len = text.length;
    setShowLaser(true);

    // Phase 1: Pure scramble for 500ms — all random chars cycling
    const scrambleId = setInterval(() => {
      let r = "";
      for (let i = 0; i < len; i++) {
        r +=
          text[i] === " "
            ? " "
            : GLITCH[Math.floor(Math.random() * GLITCH.length)];
      }
      setDisplay(r);
    }, 30);
    intervalsRef.current.push(scrambleId);

    // Phase 2: Laser sweep + reveal after 500ms
    const revealTimeout = setTimeout(() => {
      clearInterval(scrambleId);
      let revealed = 0;

      const revealId = setInterval(() => {
        revealed++;
        const progress = revealed / len;
        setLaserProgress(progress);

        let r = "";
        for (let i = 0; i < len; i++) {
          if (text[i] === " ") r += " ";
          else if (i < revealed) r += text[i];
          else r += GLITCH[Math.floor(Math.random() * GLITCH.length)];
        }
        setDisplay(r);

        if (revealed >= len) {
          clearInterval(revealId);
          setDisplay(text);
          setDone(true);
          setShowLaser(false);
          onCompleteRef.current?.();
        }
      }, 45);
      intervalsRef.current.push(revealId);
    }, 500);
    timeoutsRef.current.push(revealTimeout);

    return cleanup;
  }, [trigger, text, done, cleanup]);

  if (!trigger && !done) return null;

  return (
    <span className="relative inline-block">
      <span className={className}>
        {display}
        {!done && (
          <span className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 align-baseline animate-[cursor-blink_0.8s_steps(1)_infinite]" />
        )}
      </span>

      {/* Laser beam overlay */}
      <AnimatePresence>
        {showLaser && laserProgress > 0 && (
          <motion.span
            className="absolute top-0 h-full w-[3px] pointer-events-none z-10"
            style={{
              left: `${laserProgress * 100}%`,
              background: "linear-gradient(180deg, transparent, #ff2d55, #ff2d55, transparent)",
              boxShadow: "0 0 15px 5px rgba(255,45,85,0.5), 0 0 40px 10px rgba(255,45,85,0.2)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
        )}
      </AnimatePresence>

      {/* Flash pulse on complete */}
      <AnimatePresence>
        {done && (
          <motion.span
            className="absolute inset-0 pointer-events-none rounded"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,45,85,0.15) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}
