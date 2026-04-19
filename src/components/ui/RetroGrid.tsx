"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Interactive particle constellation background.
 * Multi-colored nodes drift, connect with lines when near each other,
 * and react to the mouse cursor. Uses all 4 accent colors.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  rgb: string;
  baseAlpha: number;
  glowStyle: string;
  coreStyle: string;
}

const COLORS = [
  { hex: "#ff2d55", rgb: "255,45,85" },    // hot pink
  { hex: "#00e5ff", rgb: "0,229,255" },     // cyan
  { hex: "#bf5af2", rgb: "191,90,242" },    // violet
  { hex: "#ff6b2b", rgb: "255,107,43" },    // orange
  { hex: "#ffffff", rgb: "255,255,255" },    // white (sparse)
];

const PARTICLE_COUNT = 55;
const CONNECTION_DIST = 140;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const MOUSE_RADIUS = 200;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MOUSE_PUSH = 0.8;

export default function RetroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const visibleRef = useRef(true);
  const frameCountRef = useRef(0);

  const createParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorIdx = i < PARTICLE_COUNT * 0.12
        ? 4
        : Math.floor(Math.random() * 4);
      const color = COLORS[colorIdx];
      const baseAlpha = 0.4 + Math.random() * 0.4;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: color.hex,
        rgb: color.rgb,
        baseAlpha,
        glowStyle: `rgba(${color.rgb}, ${baseAlpha * 0.08})`,
        coreStyle: `rgba(${color.rgb}, ${baseAlpha})`,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(w, h);
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    function onVisibilityChange() {
      visibleRef.current = document.visibilityState === "visible";
      if (visibleRef.current) {
        frameCountRef.current = 0;
        animRef.current = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (particlesRef.current.length === 0) {
      particlesRef.current = createParticles(window.innerWidth, window.innerHeight);
    }

    function draw() {
      if (!ctx || !canvas || !visibleRef.current) return;

      // Throttle to ~30fps by skipping every other frame
      frameCountRef.current++;
      if (frameCountRef.current % 2 !== 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Update particles
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_PUSH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      // Draw connections — use simple color instead of gradient per line
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST_SQ) {
            const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DIST) * 0.15;
            ctx.strokeStyle = `rgba(${a.rgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles — batch by avoiding save/restore per particle
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.glowStyle;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.coreStyle;
        ctx.fill();
      }

      // Mouse proximity glow
      if (mouse.x > 0 && mouse.y > 0) {
        const glowRadius = 250;
        const grad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        grad.addColorStop(0, "rgba(255, 45, 85, 0.04)");
        grad.addColorStop(0.3, "rgba(191, 90, 242, 0.02)");
        grad.addColorStop(0.6, "rgba(0, 229, 255, 0.01)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - glowRadius, mouse.y - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}
