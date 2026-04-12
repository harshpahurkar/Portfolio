"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDS = [
  "Node.js", "·", "Python", "·", "AWS", "·", "Docker", "·",
  "PostgreSQL", "·", "Redis", "·", "TypeScript", "·", "React", "·",
  "Kafka", "·", "Kubernetes", "·", "GraphQL", "·", "MongoDB", "·",
  "Microservices", "·", "REST APIs", "·", "CI/CD", "·", "Terraform", "·",
];

export default function ScrollingBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  if (reduced) return null;

  const line = WORDS.join("  ");

  return (
    <div
      ref={ref}
      className="py-8 overflow-hidden select-none pointer-events-none relative"
    >
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        style={{ x: x1 }}
        className="whitespace-nowrap text-accent/[0.05] text-6xl md:text-8xl font-display font-black tracking-tight"
      >
        {line}&nbsp;&nbsp;{line}&nbsp;&nbsp;{line}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className="whitespace-nowrap text-accent-secondary/[0.04] text-6xl md:text-8xl font-display font-black tracking-tight mt-2"
      >
        {line}&nbsp;&nbsp;{line}&nbsp;&nbsp;{line}
      </motion.div>
    </div>
  );
}
