"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function SpotlightCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const spotlight = spotlightRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!spotlight || !dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animating = false;
    let isHovering = false;

    function updateHoverState(hovering: boolean) {
      if (hovering === isHovering) return;
      isHovering = hovering;
      const dotSize = hovering ? "12px" : "6px";
      const ringSize = hovering ? "50px" : "36px";
      dot!.style.width = dotSize;
      dot!.style.height = dotSize;
      ring!.style.width = ringSize;
      ring!.style.height = ringSize;
      ring!.style.borderColor = hovering
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(255, 255, 255, 0.2)";
    }

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

      // Detect interactive elements inline
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");
      updateHoverState(!!interactive);

      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    }

    function onLeave() {
      spotlight!.style.opacity = "0";
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
      animating = false;
    }

    function animate() {
      if (!animating) return;
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      // Stop animating when close enough
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        ringX = mouseX;
        ringY = mouseY;
        ring!.style.left = `${ringX}px`;
        ring!.style.top = `${ringY}px`;
        animating = false;
        return;
      }
      ringX += dx * 0.12;
      ringY += dy * 0.12;
      ring!.style.left = `${ringX}px`;
      ring!.style.top = `${ringY}px`;
      requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      animating = false;
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
          width: 6,
          height: 6,
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
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.2)",
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s",
        }}
      />
    </>
  );
}
