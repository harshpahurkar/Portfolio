"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const spotlight = spotlightRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!spotlight || !dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      spotlight!.style.setProperty("--x", `${mouseX}px`);
      spotlight!.style.setProperty("--y", `${mouseY}px`);
      spotlight!.style.opacity = "1";
      dot!.style.left = `${mouseX}px`;
      dot!.style.top = `${mouseY}px`;
      dot!.style.opacity = "1";
      ring!.style.opacity = "1";
    }

    function onLeave() {
      spotlight!.style.opacity = "0";
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
    }

    // Smooth follow animation for ring
    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring!.style.left = `${ringX}px`;
      ring!.style.top = `${ringY}px`;
      requestAnimationFrame(animate);
    }

    // Detect interactive elements
    function onOverInteractive(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      setIsHovering(!!interactive);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousemove", onOverInteractive);
    document.addEventListener("mouseleave", onLeave);
    const frameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onOverInteractive);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameId);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      {/* Spotlight gradient */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300 lg:block hidden"
        style={{
          background:
            "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(255, 45, 85, 0.03), transparent 40%)",
        }}
      />
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-50 opacity-0 lg:block hidden"
        style={{
          width: isHovering ? 12 : 6,
          height: isHovering ? 12 : 6,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s, height 0.2s",
          mixBlendMode: "difference",
        }}
      />
      {/* Cursor ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-50 opacity-0 lg:block hidden"
        style={{
          width: isHovering ? 50 : 36,
          height: isHovering ? 50 : 36,
          borderRadius: "50%",
          border: `1.5px solid rgba(255, 255, 255, ${isHovering ? 0.5 : 0.2})`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s",
        }}
      />
    </>
  );
}
