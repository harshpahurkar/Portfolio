"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
  variant?: "default" | "scale" | "slide" | "blur";
}

const offsets = {
  up: { y: 50 },
  down: { y: -50 },
  left: { x: 60 },
  right: { x: -60 },
};

const variants = {
  default: (dir: "up" | "down" | "left" | "right") => ({
    hidden: { opacity: 0, ...offsets[dir] },
    visible: { opacity: 1, x: 0, y: 0 },
  }),
  scale: () => ({
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  }),
  slide: (dir: "up" | "down" | "left" | "right") => ({
    hidden: { opacity: 0, ...Object.fromEntries(Object.entries(offsets[dir]).map(([k, v]) => [k, (v as number) * 2])) },
    visible: { opacity: 1, x: 0, y: 0 },
  }),
  blur: (dir: "up" | "down" | "left" | "right") => ({
    hidden: { opacity: 0, filter: "blur(8px)", ...offsets[dir] },
    visible: { opacity: 1, filter: "blur(0px)", x: 0, y: 0 },
  }),
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  variant = "default",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const v = variants[variant](direction);

  return (
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={isInView ? v.visible : v.hidden}
      transition={{
        duration: variant === "slide" ? 0.7 : 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
