"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { metrics } from "@/data/personal";
import ScrollReveal from "@/components/ui/ScrollReveal";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part and suffix (e.g., "4+" → 4, "+")
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(`${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function MetricsBar() {
  return (
    <ScrollReveal>
      <div className="relative border-y border-white/[0.06] py-10 md:py-14 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 relative">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
                <CountUp value={m.value} />
              </span>
              <span className="block text-[11px] md:text-xs text-muted/70 mt-2 tracking-[0.2em] uppercase">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
