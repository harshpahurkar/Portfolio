"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Synthwave retro sun with horizontal slices, animated starfield,
 * and mountain silhouettes. The backdrop of the entire hero section.
 */
export default function SynthwaveSun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Stars
    interface Star { x: number; y: number; r: number; speed: number; phase: number }
    let stars: Star[] = [];

    function initStars(w: number, h: number) {
      stars = [];
      const count = Math.floor((w * h) / 3000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.6,
          r: Math.random() * 1.5 + 0.3,
          speed: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
      initStars(canvas!.offsetWidth, canvas!.offsetHeight);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      const horizonY = h * 0.58;
      const sunCenterX = w * 0.5;
      const sunCenterY = horizonY;
      const sunRadius = Math.min(w, h) * 0.22;

      // ── Stars ──
      for (const star of stars) {
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * star.speed + star.phase));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.6})`;
        ctx!.fill();
      }

      // ── Sun (upper half only — it sits on the horizon) ──
      ctx!.save();
      ctx!.beginPath();
      ctx!.rect(0, 0, w, horizonY);
      ctx!.clip();

      // Sun gradient: warm magenta/orange/yellow
      const sunGrad = ctx!.createRadialGradient(
        sunCenterX, sunCenterY, 0,
        sunCenterX, sunCenterY, sunRadius
      );
      sunGrad.addColorStop(0, "rgba(255, 210, 80, 0.9)");
      sunGrad.addColorStop(0.4, "rgba(255, 100, 60, 0.8)");
      sunGrad.addColorStop(0.7, "rgba(255, 45, 117, 0.6)");
      sunGrad.addColorStop(1, "rgba(168, 85, 247, 0)");

      ctx!.beginPath();
      ctx!.arc(sunCenterX, sunCenterY, sunRadius, 0, Math.PI * 2);
      ctx!.fillStyle = sunGrad;
      ctx!.fill();

      // ── Horizontal scan slices through the sun (retro style) ──
      const sliceCount = 12;
      const sliceGap = sunRadius / (sliceCount + 1);
      for (let i = 1; i <= sliceCount; i++) {
        const y = sunCenterY - sunRadius + i * sliceGap * 2;
        if (y > sunCenterY) continue; // only above horizon
        // Thicken lines towards the bottom (perspective)
        const thickness = 1 + (i / sliceCount) * 4;
        ctx!.fillStyle = "rgba(10, 10, 15, 0.7)";
        ctx!.fillRect(sunCenterX - sunRadius, y, sunRadius * 2, thickness);
      }

      ctx!.restore();

      // ── Sun glow halo ──
      const haloGrad = ctx!.createRadialGradient(
        sunCenterX, sunCenterY, sunRadius * 0.5,
        sunCenterX, sunCenterY, sunRadius * 2
      );
      haloGrad.addColorStop(0, "rgba(255, 45, 117, 0.06)");
      haloGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.03)");
      haloGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx!.fillStyle = haloGrad;
      ctx!.fillRect(0, 0, w, h);

      // ── Horizon glow line ──
      const horizonGlow = ctx!.createLinearGradient(0, horizonY - 2, 0, horizonY + 15);
      horizonGlow.addColorStop(0, "rgba(0, 240, 255, 0.25)");
      horizonGlow.addColorStop(0.5, "rgba(0, 240, 255, 0.08)");
      horizonGlow.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx!.fillStyle = horizonGlow;
      ctx!.fillRect(0, horizonY - 2, w, 17);

      // ── Mountain silhouettes ──
      drawMountains(ctx!, w, h, horizonY);

      time += 0.015;
      animationId = requestAnimationFrame(draw);
    }

    function drawMountains(c: CanvasRenderingContext2D, w: number, h: number, horizon: number) {
      // Far mountains (subtle)
      c.beginPath();
      c.moveTo(0, horizon);
      const peaks1 = [
        [0.05, -60], [0.15, -110], [0.25, -70], [0.35, -130], [0.45, -90],
        [0.55, -105], [0.65, -65], [0.75, -120], [0.85, -80], [0.95, -100], [1, -50],
      ];
      for (const [px, py] of peaks1) {
        c.lineTo(w * px, horizon + py * 0.7);
      }
      c.lineTo(w, horizon);
      c.closePath();
      c.fillStyle = "rgba(15, 15, 25, 0.6)";
      c.fill();

      // Near mountains (darker)
      c.beginPath();
      c.moveTo(0, horizon);
      const peaks2 = [
        [0.0, -20], [0.1, -70], [0.2, -40], [0.3, -95], [0.4, -50],
        [0.5, -80], [0.6, -30], [0.7, -85], [0.8, -45], [0.9, -65], [1.0, -25],
      ];
      for (const [px, py] of peaks2) {
        c.lineTo(w * px, horizon + py * 0.5);
      }
      c.lineTo(w, horizon);
      c.closePath();
      c.fillStyle = "rgba(10, 10, 15, 0.8)";
      c.fill();
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
      className="absolute inset-0 w-full h-full pointer-events-none z-[0]"
      style={{
        opacity: 0.85,
        maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
      }}
    />
  );
}
