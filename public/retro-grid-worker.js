// Particle constellation — runs entirely off the main thread via OffscreenCanvas.

const COLORS = [
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

const GLOW_STYLES = COLORS.map((c) => `rgba(${c},0.07)`);
const CORE_STYLES = COLORS.map((c) => `rgba(${c},0.75)`);
const CONN_STYLE = "rgba(255,45,85,0.08)";
const PROXIMITY_STYLE = "rgba(255,255,255,0.04)";

let canvas = null;
let ctx = null;
let dpr = 1;
let W = 0;
let H = 0;
let mouseX = -9999;
let mouseY = -9999;
let particles = [];
let visible = true;
let animId = 0;

function createParticles(w, h) {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const colorIdx = i < PARTICLE_COUNT * 0.1 ? 4 : Math.floor(Math.random() * 4);
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1.2,
      colorIdx,
    });
  }
}

function draw(timestamp) {
  if (!ctx || !visible) return;

  const breathe = Math.sin(timestamp * 0.0005) * 0.15 + 1;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  // Physics
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
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

  // Connections — single batched path
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (dx * dx + dy * dy < CONNECTION_DIST_SQ) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
  }
  ctx.strokeStyle = CONN_STYLE;
  ctx.stroke();

  // Mouse proximity glow
  ctx.beginPath();
  let hasProx = false;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const pdx = p.x - mouseX;
    const pdy = p.y - mouseY;
    const pdSq = pdx * pdx + pdy * pdy;
    if (pdSq < MOUSE_RADIUS_SQ) {
      const influence = 1 - Math.sqrt(pdSq) / MOUSE_RADIUS;
      const glowR = p.radius * 6 + influence * 20;
      ctx.moveTo(p.x + glowR, p.y);
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      hasProx = true;
    }
  }
  if (hasProx) {
    ctx.fillStyle = PROXIMITY_STYLE;
    ctx.fill();
  }

  // Particles by color — glow layer then core layer
  for (let c = 0; c < COLORS.length; c++) {
    ctx.beginPath();
    let has = false;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.colorIdx === c) {
        const r = p.radius * 5 * breathe;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        has = true;
      }
    }
    if (has) {
      ctx.fillStyle = GLOW_STYLES[c];
      ctx.fill();
    }

    ctx.beginPath();
    has = false;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.colorIdx === c) {
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        has = true;
      }
    }
    if (has) {
      ctx.fillStyle = CORE_STYLES[c];
      ctx.fill();
    }
  }

  animId = requestAnimationFrame(draw);
}

self.onmessage = function (e) {
  const msg = e.data;
  switch (msg.type) {
    case "init":
      canvas = msg.canvas;
      dpr = msg.dpr;
      W = msg.width;
      H = msg.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx = canvas.getContext("2d", { alpha: true });
      createParticles(W, H);
      animId = requestAnimationFrame(draw);
      break;
    case "resize":
      W = msg.width;
      H = msg.height;
      if (canvas) {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      }
      if (particles.length === 0) createParticles(W, H);
      break;
    case "mouse":
      mouseX = msg.x;
      mouseY = msg.y;
      break;
    case "mouseleave":
      mouseX = -9999;
      mouseY = -9999;
      break;
    case "visibility":
      visible = msg.visible;
      if (visible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
      }
      break;
  }
};
