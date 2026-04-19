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
      spotlight!.style.transform = `translate3d(${mouseX - 600}px, ${mouseY - 600}px, 0)`;
      spotlight!.style.opacity = "1";
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
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
        ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        animating = false;
        return;
      }
      ringX += dx * 0.12;
      ringY += dy * 0.12;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
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
      {/* Spotlight gradient — small GPU-composited div, no full-viewport repaint */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed z-30 opacity-0 transition-opacity duration-300 lg:block hidden"
        style={{
          top: 0,
          left: 0,
          width: 1200,
          height: 1200,
          background:
            "radial-gradient(600px circle at center, rgba(255, 45, 85, 0.03), transparent 40%)",
          willChange: "transform",
        }}
      />
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 lg:block hidden"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          transition: "width 0.2s, height 0.2s",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />
      {/* Cursor ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-50 opacity-0 lg:block hidden"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.2)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
