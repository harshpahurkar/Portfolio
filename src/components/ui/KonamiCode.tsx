"use client";

import { useCallback, useEffect, useState } from "react";
import { useKonamiCode } from "@/hooks/useKonamiCode";

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
    if (sessionStorage.getItem("konami") === "true") return;
    setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
    setTriggered(true);
    sessionStorage.setItem("konami", "true");
  }, []);

  useKonamiCode(handleKonami);

  useEffect(() => {
    if (!triggered) return;
    const timer = window.setTimeout(() => setTriggered(false), 3600);
    return () => window.clearTimeout(timer);
  }, [triggered]);

  if (!triggered) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none konami-pop">
      <div className="absolute inset-0 bg-accent/20 animate-[flash-fade_0.6s_ease_forwards]" />
      <div className="text-center px-6">
        <span className="text-5xl block">HP</span>
        <p className="text-2xl font-bold text-accent mt-4 font-mono neon-glow">
          {quip}
        </p>
        <p className="text-muted text-sm mt-3 font-mono">
          Resident Evil fan mode: confirmed.
        </p>
      </div>
    </div>
  );
}
