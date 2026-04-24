"use client";

import { useRef, useMemo } from "react";
import { type MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ArchitectureData, DiagramNode, DiagramConnection } from "@/types";

function getNodeCenter(node: DiagramNode): { cx: number; cy: number } {
  return {
    cx: node.position.x + node.size.width / 2,
    cy: node.position.y + node.size.height / 2,
  };
}

function ConnectionLine({
  connection,
  nodes,
  progress,
}: {
  connection: DiagramConnection;
  nodes: DiagramNode[];
  progress: MotionValue<number>;
}) {
  const fromNode = nodes.find((n) => n.id === connection.from);
  const toNode = nodes.find((n) => n.id === connection.to);
  if (!fromNode || !toNode) return null;

  const from = getNodeCenter(fromNode);
  const to = getNodeCenter(toNode);

  const midY = (from.cy + to.cy) / 2;
  const d =
    Math.abs(from.cx - to.cx) < 10
      ? `M ${from.cx} ${from.cy + fromNode.size.height / 2} L ${to.cx} ${to.cy - toNode.size.height / 2}`
      : `M ${from.cx} ${from.cy + fromNode.size.height / 2} C ${from.cx} ${midY}, ${to.cx} ${midY}, ${to.cx} ${to.cy - toNode.size.height / 2}`;

  const labelX = (from.cx + to.cx) / 2;
  const labelY = (from.cy + fromNode.size.height / 2 + (to.cy - toNode.size.height / 2)) / 2;

  return (
    <motion.g style={{ opacity: progress }}>
      <motion.path
        d={d}
        stroke="#ff2d55"
        strokeWidth={1.5}
        fill="none"
        strokeOpacity={0.4}
        style={{ pathLength: progress }}
      />
      {connection.label && (
        <text
          x={labelX}
          y={labelY - 8}
          textAnchor="middle"
          className="fill-muted text-[10px] font-mono"
        >
          {connection.label}
        </text>
      )}
    </motion.g>
  );
}

function DiagramNodeEl({
  node,
  opacity,
  y,
}: {
  node: DiagramNode;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.g style={{ opacity, y }}>
      <rect
        x={node.position.x}
        y={node.position.y}
        width={node.size.width}
        height={node.size.height}
        rx={8}
        className="fill-background-card"
        stroke="#ff2d55"
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      <text
        x={node.position.x + node.size.width / 2}
        y={node.position.y + (node.sublabel ? node.size.height / 2 - 6 : node.size.height / 2)}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[12px] font-mono font-medium"
      >
        {node.label}
      </text>
      {node.sublabel && (
        <text
          x={node.position.x + node.size.width / 2}
          y={node.position.y + node.size.height / 2 + 10}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted text-[10px] font-mono"
        >
          {node.sublabel}
        </text>
      )}
    </motion.g>
  );
}

function StaticDiagram({ data }: { data: ArchitectureData }) {
  const { viewBox } = useDiagramBounds(data);

  return (
    <svg viewBox={viewBox} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {data.connections.map((conn, i) => {
        const fromNode = data.nodes.find((n) => n.id === conn.from);
        const toNode = data.nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return null;

        const from = getNodeCenter(fromNode);
        const to = getNodeCenter(toNode);
        const midY = (from.cy + to.cy) / 2;
        const d =
          Math.abs(from.cx - to.cx) < 10
            ? `M ${from.cx} ${from.cy + fromNode.size.height / 2} L ${to.cx} ${to.cy - toNode.size.height / 2}`
            : `M ${from.cx} ${from.cy + fromNode.size.height / 2} C ${from.cx} ${midY}, ${to.cx} ${midY}, ${to.cx} ${to.cy - toNode.size.height / 2}`;

        const labelX = (from.cx + to.cx) / 2;
        const labelY = (from.cy + fromNode.size.height / 2 + (to.cy - toNode.size.height / 2)) / 2;

        return (
          <g key={i}>
            <path d={d} stroke="#ff2d55" strokeWidth={1.5} fill="none" strokeOpacity={0.4} />
            {conn.label && (
              <text x={labelX} y={labelY - 8} textAnchor="middle" className="fill-muted text-[10px] font-mono">
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
      {data.nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.position.x}
            y={node.position.y}
            width={node.size.width}
            height={node.size.height}
            rx={8}
            className="fill-background-card"
            stroke="#ff2d55"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          <text
            x={node.position.x + node.size.width / 2}
            y={node.position.y + (node.sublabel ? node.size.height / 2 - 6 : node.size.height / 2)}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-[12px] font-mono font-medium"
          >
            {node.label}
          </text>
          {node.sublabel && (
            <text
              x={node.position.x + node.size.width / 2}
              y={node.position.y + node.size.height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted text-[10px] font-mono"
            >
              {node.sublabel}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function useDiagramBounds(data: ArchitectureData) {
  return useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of data.nodes) {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + node.size.width);
      maxY = Math.max(maxY, node.position.y + node.size.height);
    }
    const pad = 30;
    return {
      viewBox: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`,
      width: maxX - minX + pad * 2,
      height: maxY - minY + pad * 2,
    };
  }, [data]);
}

export default function ArchitectureDiagram({ data }: { data: ArchitectureData }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Compute unique layers sorted
  const layers = useMemo(() => {
    const s = new Set<number>();
    data.nodes.forEach((n) => s.add(n.layer));
    data.connections.forEach((c) => s.add(c.layer));
    return Array.from(s).sort((a, b) => a - b);
  }, [data]);

  // Create animation transforms for each layer
  const layerRange = 0.5 / Math.max(layers.length, 1);
  const layerTransforms = Object.fromEntries(
    layers.map((layer, i) => {
      const start = 0.1 + i * layerRange;
      const end = start + layerRange;
      return [layer, { start, end }];
    })
  );

  // UseTransform calls for each layer (up to 6 layers)
  const l1Opacity = useTransform(scrollYProgress, [layerTransforms[layers[0]]?.start ?? 0.1, layerTransforms[layers[0]]?.end ?? 0.25], [0, 1]);
  const l1Y = useTransform(scrollYProgress, [layerTransforms[layers[0]]?.start ?? 0.1, layerTransforms[layers[0]]?.end ?? 0.25], [20, 0]);

  const l2Opacity = useTransform(scrollYProgress, [layerTransforms[layers[1]]?.start ?? 0.2, layerTransforms[layers[1]]?.end ?? 0.35], [0, 1]);
  const l2Y = useTransform(scrollYProgress, [layerTransforms[layers[1]]?.start ?? 0.2, layerTransforms[layers[1]]?.end ?? 0.35], [20, 0]);

  const l3Opacity = useTransform(scrollYProgress, [layerTransforms[layers[2]]?.start ?? 0.3, layerTransforms[layers[2]]?.end ?? 0.45], [0, 1]);
  const l3Y = useTransform(scrollYProgress, [layerTransforms[layers[2]]?.start ?? 0.3, layerTransforms[layers[2]]?.end ?? 0.45], [20, 0]);

  const l4Opacity = useTransform(scrollYProgress, [layerTransforms[layers[3]]?.start ?? 0.4, layerTransforms[layers[3]]?.end ?? 0.55], [0, 1]);
  const l4Y = useTransform(scrollYProgress, [layerTransforms[layers[3]]?.start ?? 0.4, layerTransforms[layers[3]]?.end ?? 0.55], [20, 0]);

  const l5Opacity = useTransform(scrollYProgress, [layerTransforms[layers[4]]?.start ?? 0.5, layerTransforms[layers[4]]?.end ?? 0.65], [0, 1]);
  const l5Y = useTransform(scrollYProgress, [layerTransforms[layers[4]]?.start ?? 0.5, layerTransforms[layers[4]]?.end ?? 0.65], [20, 0]);

  const l6Opacity = useTransform(scrollYProgress, [layerTransforms[layers[5]]?.start ?? 0.55, layerTransforms[layers[5]]?.end ?? 0.7], [0, 1]);
  const l6Y = useTransform(scrollYProgress, [layerTransforms[layers[5]]?.start ?? 0.55, layerTransforms[layers[5]]?.end ?? 0.7], [20, 0]);

  const allOpacities = [l1Opacity, l2Opacity, l3Opacity, l4Opacity, l5Opacity, l6Opacity];
  const allYs = [l1Y, l2Y, l3Y, l4Y, l5Y, l6Y];
  const opacityMap: Record<number, MotionValue<number>> = {};
  const yMap: Record<number, MotionValue<number>> = {};
  layers.forEach((layer, i) => {
    opacityMap[layer] = allOpacities[Math.min(i, 5)];
    yMap[layer] = allYs[Math.min(i, 5)];
  });

  const { viewBox } = useDiagramBounds(data);

  if (reducedMotion) {
    return (
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
          Architecture
        </h2>
        <div className="bg-background-card/50 border border-white/[0.06] rounded-lg p-6 overflow-x-auto">
          <StaticDiagram data={data} />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="mb-20">
      <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
        Architecture
      </h2>
      <div className="bg-background-card/50 border border-white/[0.06] rounded-lg p-6 overflow-x-auto">
        <svg viewBox={viewBox} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Connections first (behind nodes) */}
          {data.connections.map((conn, i) => (
            <ConnectionLine
              key={i}
              connection={conn}
              nodes={data.nodes}
              progress={opacityMap[conn.layer] ?? l1Opacity}
            />
          ))}
          {/* Nodes */}
          {data.nodes.map((node) => (
            <DiagramNodeEl
              key={node.id}
              node={node}
              opacity={opacityMap[node.layer] ?? l1Opacity}
              y={yMap[node.layer] ?? l1Y}
            />
          ))}
        </svg>
      </div>
    </section>
  );
}
