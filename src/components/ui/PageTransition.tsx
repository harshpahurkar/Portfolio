"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function PageTransition() {
  const [loading, setLoading] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Short delay then reveal
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Animated logo / initials */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* SVG animated hexagon with initials */}
              <svg
                width="80"
                height="90"
                viewBox="0 0 80 90"
                className="overflow-visible"
              >
                <motion.polygon
                  points="40,2 76,22 76,68 40,88 4,68 4,22"
                  fill="none"
                  stroke="#ff2d55"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
                <motion.text
                  x="40"
                  y="52"
                  textAnchor="middle"
                  fill="#ff2d55"
                  fontSize="28"
                  fontFamily="monospace"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  HP
                </motion.text>
              </svg>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-[2px] bg-accent rounded-full shadow-[0_0_10px_rgba(255,45,85,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
