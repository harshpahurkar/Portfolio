"use client";

import { useRef, useEffect, useState } from "react";

interface LaserTraceRevealProps {
  text: string;
  trigger: boolean;
  className?: string;
  onComplete?: () => void;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const SPARK_COLORS = [
  "255,45,85",
  "255,255,255",
  "191,90,242",
  "0,229,255",
  "255,107,43",
];

export default function LaserTraceReveal({
  text,
  trigger,
  className = "",
  onComplete,
}: LaserTraceRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!trigger || done) return;

    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!textEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;

    // Wait one frame for text to render and measure
    const initId = requestAnimationFrame(() => {
      const dpr = window.devicePixelRatio || 1;
      const rect = textEl.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      if (W === 0 || H === 0) return;

      canvas.width = Math.ceil(W * dpr);
      canvas.height = Math.ceil(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      // --- Render text offscreen for contour analysis ---
      const cs = getComputedStyle(textEl);
      const fontSize = parseFloat(cs.fontSize);
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const oCtx = off.getContext("2d")!;
      oCtx.scale(dpr, dpr);
      oCtx.font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
      oCtx.textBaseline = "top";
      oCtx.fillStyle = "#fff";

      const displayText = text.toUpperCase();
      const letterSpace = parseFloat(cs.letterSpacing) || 0;

      let xPos = 0;
      for (const ch of displayText) {
        oCtx.fillText(ch, xPos, 0);
        xPos += oCtx.measureText(ch).width + letterSpace;
      }

      // --- Analyze pixel data for contour ---
      const imgData = oCtx.getImageData(0, 0, off.width, off.height);
      const cols = Math.ceil(W);
      const rows = Math.ceil(H);
      const topEdge: number[] = new Array(cols).fill(H / 2);
      const bottomEdge: number[] = new Array(cols).fill(H / 2);
      const hasText: boolean[] = new Array(cols).fill(false);

      for (let x = 0; x < cols; x++) {
        let foundTop = false;
        for (let y = 0; y < rows; y++) {
          const devX = Math.min(Math.floor(x * dpr), off.width - 1);
          const devY = Math.min(Math.floor(y * dpr), off.height - 1);
          const idx = (devY * off.width + devX) * 4;
          if (imgData.data[idx + 3] > 20) {
            if (!foundTop) {
              topEdge[x] = y;
              foundTop = true;
              hasText[x] = true;
            }
            bottomEdge[x] = y;
          }
        }
      }

      // Find text horizontal bounds
      let textStart = 0;
      let textEnd = cols - 1;
      for (let i = 0; i < cols; i++) {
        if (hasText[i]) {
          textStart = i;
          break;
        }
      }
      for (let i = cols - 1; i >= 0; i--) {
        if (hasText[i]) {
          textEnd = i;
          break;
        }
      }

      // --- Animation state ---
      const sparks: Spark[] = [];
      const totalCols = textEnd - textStart;
      const BASE_SPEED = totalCols / 60; // faster ~1s at 60fps
      let laserX = textStart;
      let smoothTopY = topEdge[textStart];
      let smoothBotY = bottomEdge[textStart];
      let flashAlpha = 0;
      let shockR = 0;
      let shockAlpha = 0;
      let complete = false;
      let frame = 0;

      // Start with text clipped (hidden)
      textEl.style.clipPath = "inset(0 100% 0 0)";

      function emitSparks(sx: number, sy: number, count: number) {
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
          const spd = 2 + Math.random() * 8;
          sparks.push({
            x: sx,
            y: sy,
            vx: Math.cos(angle) * spd + 2,
            vy: Math.sin(angle) * spd,
            life: 1,
            maxLife: 0.2 + Math.random() * 0.5,
            size: 1 + Math.random() * 3.5,
            color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          });
        }
      }

      function drawHead(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        intensity = 1,
      ) {
        c.save();
        c.globalCompositeOperation = "lighter";
        // Outer halo — BIG and bright
        const r1 = 45;
        const g1 = c.createRadialGradient(x, y, 0, x, y, r1);
        g1.addColorStop(0, `rgba(255,255,255,${0.8 * intensity})`);
        g1.addColorStop(0.1, `rgba(255,45,85,${0.6 * intensity})`);
        g1.addColorStop(0.4, `rgba(255,45,85,${0.15 * intensity})`);
        g1.addColorStop(1, "rgba(255,45,85,0)");
        c.fillStyle = g1;
        c.beginPath();
        c.arc(x, y, r1, 0, Math.PI * 2);
        c.fill();
        // Hot core
        const r2 = 14;
        const g2 = c.createRadialGradient(x, y, 0, x, y, r2);
        g2.addColorStop(0, `rgba(255,255,255,${1.0 * intensity})`);
        g2.addColorStop(0.3, `rgba(255,45,85,${0.8 * intensity})`);
        g2.addColorStop(1, "rgba(255,45,85,0)");
        c.fillStyle = g2;
        c.beginPath();
        c.arc(x, y, r2, 0, Math.PI * 2);
        c.fill();
        // White center dot
        c.beginPath();
        c.arc(x, y, 4, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,255,${intensity})`;
        c.fill();
        c.restore();
      }

      function render() {
        if (!ctx || !textEl) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        frame++;

        if (!complete) {
          // Adaptive speed: slower on text, faster in gaps
          const onText = hasText[Math.floor(laserX)];
          const spd = onText ? BASE_SPEED * 0.9 : BASE_SPEED * 1.6;
          laserX += spd;
          if (laserX >= textEnd) {
            laserX = textEnd;
            complete = true;
            flashAlpha = 0.5;
            shockR = 1;
            shockAlpha = 0.5;
          }

          // Update clip-path on text element
          const pct = Math.min(
            ((laserX - textStart) / totalCols) * 100,
            100,
          );
          textEl.style.clipPath = `inset(0 ${Math.max(0, 100 - pct)}% 0 0)`;
        } else if (textEl.style.clipPath !== "none") {
          textEl.style.clipPath = "none";
        }

        const cx = Math.floor(Math.min(laserX, textEnd));

        if (!complete) {
          const onText = hasText[cx];
          const targetTopY = onText ? topEdge[cx] : smoothTopY;
          const targetBotY = onText ? bottomEdge[cx] : smoothBotY;
          smoothTopY += (targetTopY - smoothTopY) * 0.25;
          smoothBotY += (targetBotY - smoothBotY) * 0.25;

          // --- Burn glow at the cutting edge ---
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const burnW = 80;
          const burnGrad = ctx.createLinearGradient(cx - burnW, 0, cx + 2, 0);
          burnGrad.addColorStop(0, "rgba(255,255,255,0)");
          burnGrad.addColorStop(0.4, "rgba(255,255,255,0.06)");
          burnGrad.addColorStop(0.7, "rgba(255,45,85,0.18)");
          burnGrad.addColorStop(1, "rgba(255,255,255,0.4)");
          ctx.fillStyle = burnGrad;
          ctx.fillRect(cx - burnW, 0, burnW + 2, H);
          ctx.restore();

          // --- Vertical scan beam ---
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const beamGrad = ctx.createLinearGradient(0, 0, 0, H);
          beamGrad.addColorStop(0, "rgba(255,45,85,0)");
          beamGrad.addColorStop(0.15, "rgba(255,45,85,0.08)");
          beamGrad.addColorStop(0.5, "rgba(255,45,85,0.18)");
          beamGrad.addColorStop(0.85, "rgba(255,45,85,0.08)");
          beamGrad.addColorStop(1, "rgba(255,45,85,0)");
          ctx.fillStyle = beamGrad;
          ctx.fillRect(cx - 1, 0, 3, H);
          ctx.restore();

          if (onText) {
            // --- Two laser heads tracing top + bottom contour ---
            drawHead(ctx, cx, smoothTopY);
            drawHead(ctx, cx, smoothBotY);

            // Connecting beam between the two heads
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const connGrad = ctx.createLinearGradient(
              0,
              smoothTopY,
              0,
              smoothBotY,
            );
            connGrad.addColorStop(0, "rgba(255,45,85,0.3)");
            connGrad.addColorStop(0.5, "rgba(255,45,85,0.06)");
            connGrad.addColorStop(1, "rgba(255,45,85,0.3)");
            ctx.strokeStyle = connGrad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, smoothTopY);
            ctx.lineTo(cx, smoothBotY);
            ctx.stroke();
            ctx.restore();

            // Horizontal laser trail (comet tail from top head)
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const trailLen = 45;
            const tGrad = ctx.createLinearGradient(
              cx - trailLen,
              smoothTopY,
              cx,
              smoothTopY,
            );
            tGrad.addColorStop(0, "rgba(255,45,85,0)");
            tGrad.addColorStop(1, "rgba(255,45,85,0.2)");
            ctx.strokeStyle = tGrad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - trailLen, smoothTopY);
            ctx.lineTo(cx, smoothTopY);
            ctx.stroke();
            ctx.restore();

            // Emit sparks from both heads — lots of them
            if (frame % 1 === 0) {
              emitSparks(cx, smoothTopY, 3 + Math.floor(Math.random() * 4));
            }
            if (frame % 2 === 0) {
              emitSparks(cx, smoothBotY, 2 + Math.floor(Math.random() * 3));
            }
          } else {
            // Dimmed single head through gaps
            drawHead(ctx, cx, smoothTopY, 0.4);
          }
        }

        // --- Render sparks ---
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.1;
          s.vx *= 0.98;
          s.life -= (1 / 60) / s.maxLife;

          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          const a = Math.max(0, s.life);
          const r = s.size * a;
          // Outer glow
          ctx.beginPath();
          ctx.arc(s.x, s.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${a * 0.2})`;
          ctx.fill();
          // Core
          ctx.beginPath();
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${a * 0.9})`;
          ctx.fill();
        }
        ctx.restore();

        // --- Flash on complete ---
        if (flashAlpha > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = `rgba(255,45,85,${flashAlpha})`;
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
          flashAlpha *= 0.88;
          if (flashAlpha < 0.003) flashAlpha = 0;
        }

        // --- Shockwave ring ---
        if (shockAlpha > 0) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,45,85,${shockAlpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
          shockR += 5;
          shockAlpha *= 0.92;
          if (shockAlpha < 0.003) shockAlpha = 0;
        }

        // Check if fully done
        if (
          complete &&
          flashAlpha <= 0 &&
          shockAlpha <= 0 &&
          sparks.length === 0
        ) {
          textEl.style.clipPath = "none";
          setDone(true);
          onCompleteRef.current?.();
          return;
        }

        animId = requestAnimationFrame(render);
      }

      animId = requestAnimationFrame(render);
    });

    return () => {
      cancelAnimationFrame(initId);
      cancelAnimationFrame(animId);
      if (textRef.current) textRef.current.style.clipPath = "";
    };
  }, [trigger, done, text]);

  if (!trigger && !done) return null;

  return (
    <span ref={containerRef} className="relative inline-block">
      <span
        ref={textRef}
        className={className}
        style={done ? undefined : { clipPath: "inset(0 100% 0 0)" }}
      >
        {text}
      </span>
      {!done && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
      )}
    </span>
  );
}
