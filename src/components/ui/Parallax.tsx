"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function Parallax({
  children,
  speed = -0.2,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
