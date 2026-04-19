"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * Interactive particle constellation background.
 * Uses OffscreenCanvas + Web Worker on supported browsers (Chrome, Edge, Firefox)
 * to run all physics and rendering off the main thread.
 * Falls back to main-thread canvas on Safari.
 */

// ── Shared constants (used by fallback path) ──

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIdx: number;
}

const COLORS_RGB = [
  "255,45,85",   // hot pink
  "0,229,255",   // cyan
  "191,90,242",  // violet
  "255,107,43",  // orange
  "255,255,255", // white
];

const PARTICLE_COUNT = 65;
const CONNECTION_DIST = 150;
const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
const MOUSE_RADIUS = 200;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MOUSE_PUSH = 0.8;

const GLOW_STYLES = COLORS_RGB.map((c) => `rgba(${c},0.07)`);
const CORE_STYLES = COLORS_RGB.map((c) => `rgba(${c},0.75)`);
const CONN_STYLE = "rgba(255,45,85,0.08)";
const PROXIMITY_STYLE = "rgba(255,255,255,0.04)";

function makeParticles(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1.2,
      colorIdx: i < PARTICLE_COUNT * 0.1 ? 4 : Math.floor(Math.random() * 4),
    });
  }
  return particles;
}

export default function RetroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // ── Worker path (Chrome / Edge / Firefox) ──
  const initWorker = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const offscreen = (canvas as unknown as { transferControlToOffscreen(): OffscreenCanvas }).transferControlToOffscreen();
    const worker = new Worker("/retro-grid-worker.js");
    workerRef.current = worker;

    worker.postMessage(
      { type: "init", canvas: offscreen, dpr, width: window.innerWidth, height: window.innerHeight },
      [offscreen],
    );

    const onResize = () => worker.postMessage({ type: "resize", width: window.innerWidth, height: window.innerHeight });
    const onMouse = (e: MouseEvent) => worker.postMessage({ type: "mouse", x: e.clientX, y: e.clientY });
    const onLeave = () => worker.postMessage({ type: "mouseleave" });
    const onVis = () => worker.postMessage({ type: "visibility", visible: document.visibilityState === "visible" });

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      worker.terminate();
      workerRef.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // ── Main-thread fallback (Safari) ──
  const initFallback = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let animId = 0;
    let visible = true;

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (particles.length === 0) particles = makeParticles(w, h);
    }

    resize();
    if (particles.length === 0) particles = makeParticles(window.innerWidth, window.innerHeight);

    function draw(timestamp: number) {
      if (!visible) return;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      const breathe = Math.sin(timestamp * 0.0005) * 0.15 + 1;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_PUSH;
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

      ctx!.lineWidth = 0.5;
      ctx!.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx * dx + dy * dy < CONNECTION_DIST_SQ) {
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
          }
        }
      }
      ctx!.strokeStyle = CONN_STYLE;
      ctx!.stroke();

      ctx!.beginPath();
      let hasProx = false;
      for (const p of particles) {
        const pdx = p.x - mouse.x;
        const pdy = p.y - mouse.y;
        const pdSq = pdx * pdx + pdy * pdy;
        if (pdSq < MOUSE_RADIUS_SQ) {
          const influence = 1 - Math.sqrt(pdSq) / MOUSE_RADIUS;
          const glowR = p.radius * 6 + influence * 20;
          ctx!.moveTo(p.x + glowR, p.y);
          ctx!.arc(p.x, p.y, glowR, 0, Math.PI * 2);
          hasProx = true;
        }
      }
      if (hasProx) { ctx!.fillStyle = PROXIMITY_STYLE; ctx!.fill(); }

      for (let c = 0; c < COLORS_RGB.length; c++) {
        ctx!.beginPath();
        let has = false;
        for (const p of particles) {
          if (p.colorIdx === c) {
            const r = p.radius * 5 * breathe;
            ctx!.moveTo(p.x + r, p.y);
            ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
            has = true;
          }
        }
        if (has) { ctx!.fillStyle = GLOW_STYLES[c]; ctx!.fill(); }
        ctx!.beginPath();
        has = false;
        for (const p of particles) {
          if (p.colorIdx === c) {
            ctx!.moveTo(p.x + p.radius, p.y);
            ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            has = true;
          }
        }
        if (has) { ctx!.fillStyle = CORE_STYLES[c]; ctx!.fill(); }
      }

      animId = requestAnimationFrame(draw);
    }

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible) animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const supportsOffscreen = "transferControlToOffscreen" in canvas;
    return supportsOffscreen ? initWorker(canvas) : initFallback(canvas);
  }, [initWorker, initFallback]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
