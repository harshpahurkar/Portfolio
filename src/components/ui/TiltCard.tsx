"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className,
  tiltAmount = 12,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * tiltAmount * 2;
    const rotateX = (0.5 - y) * tiltAmount * 2;
    setTransform({ rotateX, rotateY });
    setGlarePos({ x: x * 100, y: y * 100 });
  }

  function handleEnter() {
    setHovering(true);
  }

  function handleLeave() {
    setHovering(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
      {/* Glare overlay */}
      {glare && hovering && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 55%)`,
            opacity: hovering ? 1 : 0,
          }}
        />
      )}
    </motion.div>
  );
}
