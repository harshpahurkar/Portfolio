"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { playSound } from "@/lib/audio";

const QUIPS = [
  "You know the Konami Code? We're friends now.",
  "Achievement Unlocked: Found the secret room.",
  "A fellow gamer. S-tier taste confirmed.",
  "You did it. Jill would be proud.",
  "This is the part where I offer you a green herb.",
];

export default function KonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const [quip, setQuip] = useState("");

  const handleKonami = useCallback(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("konami") === "true") return;
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    setTriggered(true);
    playSound("success");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("konami", "true");
    }
    setTimeout(() => setTriggered(false), 4000);
  }, []);

  useKonamiCode(handleKonami);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Screen flash */}
          <motion.div
            className="absolute inset-0 bg-accent/20"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
          {/* Message */}
          <motion.div
            className="text-center px-6"
            initial={{ scale: 0.5, opacity: 0, rotateX: 45 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          >
            <motion.span
              className="text-6xl block"
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              🎮
            </motion.span>
            <p className="text-2xl font-bold text-accent mt-4 font-mono neon-glow">
              {quip}
            </p>
            <p className="text-muted text-sm mt-3 font-mono">
              — A Resident Evil fan salutes you.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
