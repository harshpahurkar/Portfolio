"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { isAudioEnabled, toggleAudio, playSound } from "@/lib/audio";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(() => isAudioEnabled());

  function handleToggle() {
    const next = toggleAudio();
    setEnabled(next);
    if (next) playSound("click");
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-20 right-6 z-50 p-3 rounded-full bg-background-card/80 backdrop-blur-sm border border-accent/15 text-muted hover:text-accent hover:border-accent/40 hover:shadow-[0_0_15px_rgba(255,45,85,0.15)] transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={enabled ? "Mute sounds" : "Enable sounds"}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </motion.button>
  );
}
