import { metrics } from "@/data/personal";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MetricsBar() {
  return (
    <ScrollReveal>
      <div className="relative border-y border-white/[0.06] py-10 md:py-14 overflow-hidden bg-background/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-secondary/20 to-transparent" />
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 relative">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <span className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
                {m.value}
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
