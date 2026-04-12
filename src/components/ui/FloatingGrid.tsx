"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function FloatingGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse = { x: -1000, y: -1000 };
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const spacing = 40;
    const dotRadius = 1;
    const interactRadius = 120;

    function draw(time: number) {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      for (let x = spacing; x < w; x += spacing) {
        for (let y = spacing; y < h; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / interactRadius);

          // Subtle floating motion
          const floatX = Math.sin((time * 0.001) + x * 0.01) * 2;
          const floatY = Math.cos((time * 0.001) + y * 0.01) * 2;

          // Push away from mouse
          const pushX = influence * -dx * 0.15;
          const pushY = influence * -dy * 0.15;

          const finalX = x + floatX + pushX;
          const finalY = y + floatY + pushY;

          const alpha = 0.08 + influence * 0.25;
          const radius = dotRadius + influence * 2;

          ctx!.beginPath();
          ctx!.arc(finalX, finalY, radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 45, 85, ${alpha})`;
          ctx!.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
