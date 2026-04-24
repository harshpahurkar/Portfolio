"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type QualityProfile = {
  particles: number;
  maxLinks: number;
  linkDistance: number;
  dpr: number;
  fps: number;
  opacity: number;
  spread: [number, number, number];
};

type ParticleState = {
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  speed: number;
  drift: number;
};

const PALETTE = [
  new THREE.Color("#ff2d55"),
  new THREE.Color("#00e5ff"),
  new THREE.Color("#bf5af2"),
  new THREE.Color("#ff6b2b"),
  new THREE.Color("#ffffff"),
];

function getQualityProfile(): QualityProfile {
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || saveData) {
    return { particles: 70, maxLinks: 120, linkDistance: 5.2, dpr: 1, fps: 30, opacity: 0.45, spread: [24, 15, 18] };
  }

  if (width >= 1280 && cores >= 6) {
    return { particles: 280, maxLinks: 720, linkDistance: 4.7, dpr: Math.min(window.devicePixelRatio || 1, 2), fps: 60, opacity: 0.96, spread: [34, 20, 26] };
  }

  if (width >= 768) {
    return { particles: 180, maxLinks: 420, linkDistance: 4.4, dpr: Math.min(window.devicePixelRatio || 1, 1.6), fps: 50, opacity: 0.86, spread: [30, 18, 23] };
  }

  return { particles: 95, maxLinks: 180, linkDistance: 4.1, dpr: 1, fps: 34, opacity: 0.62, spread: [23, 15, 18] };
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.22, "rgba(255,255,255,0.72)");
  gradient.addColorStop(0.48, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createField(profile: QualityProfile) {
  const [spreadX, spreadY, spreadZ] = profile.spread;
  const positions = new Float32Array(profile.particles * 3);
  const colors = new Float32Array(profile.particles * 3);
  const sizes = new Float32Array(profile.particles);
  const states: ParticleState[] = [];

  for (let i = 0; i < profile.particles; i++) {
    const x = THREE.MathUtils.randFloatSpread(spreadX);
    const y = THREE.MathUtils.randFloatSpread(spreadY);
    const z = THREE.MathUtils.randFloatSpread(spreadZ) - 5;
    const color = i % 11 === 0 ? PALETTE[4] : PALETTE[Math.floor(Math.random() * 4)];

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    sizes[i] = THREE.MathUtils.randFloat(12, 34);
    states.push({
      baseX: x,
      baseY: y,
      baseZ: z,
      phase: Math.random() * Math.PI * 2,
      speed: THREE.MathUtils.randFloat(0.18, 0.72),
      drift: THREE.MathUtils.randFloat(0.08, 0.34),
    });
  }

  const edges: Array<[number, number]> = [];
  for (let i = 0; i < profile.particles; i++) {
    const close: Array<{ index: number; dist: number }> = [];
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];

    for (let j = i + 1; j < profile.particles; j++) {
      const dx = ax - positions[j * 3];
      const dy = ay - positions[j * 3 + 1];
      const dz = az - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < profile.linkDistance) close.push({ index: j, dist });
    }

    close
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
      .forEach(({ index }) => {
        if (edges.length < profile.maxLinks) edges.push([i, index]);
      });
  }

  return { positions, colors, sizes, states, edges };
}

export default function RetroGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let profile = getQualityProfile();
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId = 0;
    let lastFrame = 0;
    let visible = document.visibilityState === "visible";
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: width >= 768,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(profile.dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "fixed inset-0 pointer-events-none z-0";
    renderer.domElement.style.opacity = `${profile.opacity}`;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.033);

    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 90);
    camera.position.set(0, 0, 18);

    const texture = createParticleTexture();
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.14,
      map: texture ?? undefined,
      transparent: true,
      opacity: 0.92,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    let field = createField(profile);
    const pointGeometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(field.positions, 3);
    pointGeometry.setAttribute("position", positionAttribute);
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(field.colors, 3));
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false;

    const linePositions = new Float32Array(Math.max(1, field.edges.length * 2 * 3));
    const lineColors = new Float32Array(Math.max(1, field.edges.length * 2 * 3));
    const lineGeometry = new THREE.BufferGeometry();
    const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
    lineGeometry.setAttribute("position", linePositionAttribute);
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(lineGeometry, lineMaterial);
    links.frustumCulled = false;

    const group = new THREE.Group();
    group.add(links, points);
    scene.add(group);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.07,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const hotMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2d55,
      transparent: true,
      opacity: 0.055,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(4.8, 0.12, 120, 10, 2, 3), ringMaterial);
    torus.position.set(9, 1.4, -12);
    torus.rotation.set(0.8, -0.4, 0.2);
    const poly = new THREE.Mesh(new THREE.IcosahedronGeometry(4.2, 1), hotMaterial);
    poly.position.set(-10, -2.5, -15);
    poly.rotation.set(0.5, 0.2, -0.2);
    scene.add(torus, poly);

    function rebuild() {
      profile = getQualityProfile();
      field = createField(profile);

      pointGeometry.setAttribute("position", new THREE.BufferAttribute(field.positions, 3));
      pointGeometry.setAttribute("color", new THREE.BufferAttribute(field.colors, 3));

      const nextLinePositions = new Float32Array(Math.max(1, field.edges.length * 2 * 3));
      const nextLineColors = new Float32Array(Math.max(1, field.edges.length * 2 * 3));
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(nextLinePositions, 3));
      lineGeometry.setAttribute("color", new THREE.BufferAttribute(nextLineColors, 3));

      renderer.setPixelRatio(profile.dpr);
      renderer.domElement.style.opacity = `${profile.opacity}`;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      rebuild();
    }

    function updateLines() {
      const currentPositions = pointGeometry.getAttribute("position").array as Float32Array;
      const currentColors = pointGeometry.getAttribute("color").array as Float32Array;
      const linePos = lineGeometry.getAttribute("position").array as Float32Array;
      const lineCol = lineGeometry.getAttribute("color").array as Float32Array;

      let cursor = 0;
      let colorCursor = 0;
      for (const [a, b] of field.edges) {
        const ax = currentPositions[a * 3];
        const ay = currentPositions[a * 3 + 1];
        const az = currentPositions[a * 3 + 2];
        const bx = currentPositions[b * 3];
        const by = currentPositions[b * 3 + 1];
        const bz = currentPositions[b * 3 + 2];

        linePos[cursor++] = ax;
        linePos[cursor++] = ay;
        linePos[cursor++] = az;
        linePos[cursor++] = bx;
        linePos[cursor++] = by;
        linePos[cursor++] = bz;

        for (let n = 0; n < 2; n++) {
          lineCol[colorCursor++] = (currentColors[a * 3] + currentColors[b * 3]) * 0.42;
          lineCol[colorCursor++] = (currentColors[a * 3 + 1] + currentColors[b * 3 + 1]) * 0.42;
          lineCol[colorCursor++] = (currentColors[a * 3 + 2] + currentColors[b * 3 + 2]) * 0.42;
        }
      }

      lineGeometry.getAttribute("position").needsUpdate = true;
      lineGeometry.getAttribute("color").needsUpdate = true;
    }

    function animate(timestamp: number) {
      animationId = requestAnimationFrame(animate);
      if (!visible) return;

      const frameMs = 1000 / profile.fps;
      if (timestamp - lastFrame < frameMs) return;
      lastFrame = timestamp;

      const time = timestamp * 0.001;
      const positions = pointGeometry.getAttribute("position").array as Float32Array;
      for (let i = 0; i < field.states.length; i++) {
        const state = field.states[i];
        const sway = Math.sin(time * state.speed + state.phase);
        const lift = Math.cos(time * state.speed * 0.72 + state.phase);
        positions[i * 3] = state.baseX + sway * state.drift + targetMouseX * 0.7 * (state.baseZ / -24);
        positions[i * 3 + 1] = state.baseY + lift * state.drift + targetMouseY * 0.45 * (state.baseZ / -24);
        positions[i * 3 + 2] = state.baseZ + Math.sin(time * 0.24 + state.phase) * 0.36;
      }
      pointGeometry.getAttribute("position").needsUpdate = true;
      updateLines();

      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;
      group.rotation.x = -0.08 + mouseY * 0.12;
      group.rotation.y = time * 0.025 + mouseX * 0.16;
      group.rotation.z = Math.sin(time * 0.12) * 0.025;
      camera.position.x = mouseX * 1.25;
      camera.position.y = -mouseY * 0.85;
      camera.lookAt(0, 0, -5);

      torus.rotation.x += 0.0017;
      torus.rotation.y += 0.0021;
      poly.rotation.x -= 0.0012;
      poly.rotation.y += 0.0018;

      renderer.render(scene, camera);
    }

    function onPointerMove(event: PointerEvent) {
      targetMouseX = (event.clientX / width - 0.5) * 2;
      targetMouseY = (event.clientY / height - 0.5) * 2;
    }

    function onVisibility() {
      visible = document.visibilityState === "visible";
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    updateLines();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      pointGeometry.dispose();
      lineGeometry.dispose();
      torus.geometry.dispose();
      poly.geometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
      ringMaterial.dispose();
      hotMaterial.dispose();
      texture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" />;
}
