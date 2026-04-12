"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animated perspective grid — cyberpunk/TRON aesthetic.
 * Renders a receding grid that slowly scrolls, creating depth.
 */
export default function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    const GRID_LINES = 20;
    const SPEED = 0.3;

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // Horizontal lines with perspective
      const horizonY = h * 0.35;
      const bottomY = h;

      for (let i = 0; i <= GRID_LINES; i++) {
        const t = (i / GRID_LINES + offset * 0.002) % 1;
        // Exponential spacing for perspective
        const perspT = Math.pow(t, 2.5);
        const y = horizonY + (bottomY - horizonY) * perspT;
        const alpha = perspT * 0.18;

        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.strokeStyle = `rgba(255, 45, 85, ${alpha})`;
        ctx!.lineWidth = 0.5 + perspT * 0.8;
        ctx!.stroke();
      }

      // Vertical lines converging to vanishing point
      const vanishX = w * 0.5;
      const verticalLines = 16;

      for (let i = -verticalLines / 2; i <= verticalLines / 2; i++) {
        const spread = (i / (verticalLines / 2));
        const bottomX = vanishX + spread * w * 0.8;
        const topX = vanishX + spread * w * 0.05;
        const alpha = 0.1 * (1 - Math.abs(spread) * 0.5);

        ctx!.beginPath();
        ctx!.moveTo(topX, horizonY);
        ctx!.lineTo(bottomX, bottomY);
        ctx!.strokeStyle = `rgba(255, 45, 85, ${alpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // Horizon glow
      const gradient = ctx!.createLinearGradient(0, horizonY - 40, 0, horizonY + 40);
      gradient.addColorStop(0, "rgba(255, 45, 85, 0)");
      gradient.addColorStop(0.5, "rgba(255, 45, 85, 0.06)");
      gradient.addColorStop(1, "rgba(255, 45, 85, 0)");
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, horizonY - 40, w, 80);

      offset += SPEED;
      animationId = requestAnimationFrame(draw);
    }

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.8, WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 25%, black 70%, transparent 95%)", maskImage: "linear-gradient(to top, transparent 0%, black 25%, black 70%, transparent 95%)" }}
    />
  );
}
