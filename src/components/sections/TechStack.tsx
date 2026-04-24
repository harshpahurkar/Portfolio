import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { techStack } from "@/data/techStack";

const CATEGORY_COLORS: Record<string, { text: string; border: string; bg: string; shadow: string; label: string }> = {
  "Languages": { text: "hover:text-accent", border: "hover:border-accent/30", bg: "hover:bg-accent/[0.06]", shadow: "hover:shadow-[0_0_15px_rgba(255,45,85,0.1)]", label: "text-accent/90" },
  "Backend & APIs": { text: "hover:text-accent-secondary", border: "hover:border-accent-secondary/30", bg: "hover:bg-accent-secondary/[0.06]", shadow: "hover:shadow-[0_0_15px_rgba(0,229,255,0.1)]", label: "text-accent-secondary/90" },
  "Cloud & DevOps": { text: "hover:text-accent-warm", border: "hover:border-accent-warm/30", bg: "hover:bg-accent-warm/[0.06]", shadow: "hover:shadow-[0_0_15px_rgba(255,107,43,0.1)]", label: "text-accent-warm/90" },
  "Databases": { text: "hover:text-accent-tertiary", border: "hover:border-accent-tertiary/30", bg: "hover:bg-accent-tertiary/[0.06]", shadow: "hover:shadow-[0_0_15px_rgba(191,90,242,0.1)]", label: "text-accent-tertiary/90" },
  "Testing": { text: "hover:text-green-400", border: "hover:border-green-400/30", bg: "hover:bg-green-400/[0.06]", shadow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.1)]", label: "text-green-400/90" },
};

export default function TechStack() {
  return (
    <section id="stack" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-tl from-accent-secondary/[0.03] via-transparent to-accent-warm/[0.03] pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6 relative">
        <ScrollReveal variant="blur">
          <SectionHeading number="04" title="Tech Stack" className="mb-4" accentColor="text-accent-secondary" gradientFrom="from-accent-secondary/20" />
          <p className="text-muted text-sm mb-12 font-mono">
            The toolkit behind the backend, cloud, automation, and UI work.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((category, i) => {
            const colors = CATEGORY_COLORS[category.category] || CATEGORY_COLORS["Languages"];
            return (
            <ScrollReveal key={category.category} delay={i * 0.1}>
              <div className="bg-background-card/50 rounded-lg p-6 glow-border">
                <h3 className={`text-xs font-mono ${colors.label} mb-4 tracking-[0.15em] uppercase`}>
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((item) => (
                    <span
                      key={item.name}
                      className={`px-3.5 py-1.5 text-sm text-muted bg-background border border-white/[0.06] rounded-md ${colors.text} ${colors.border} ${colors.bg} ${colors.shadow} transition-all duration-200 cursor-default hover:scale-[1.08] hover:-translate-y-0.5 active:scale-95`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
