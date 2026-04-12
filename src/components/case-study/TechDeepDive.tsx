import ScrollReveal from "@/components/ui/ScrollReveal";
import type { TechDecision } from "@/types";

export default function TechDeepDive({
  decisions,
}: {
  decisions: TechDecision[];
}) {
  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-8">
          Technical Decisions
        </h2>
        <div className="space-y-10">
          {decisions.map((d, i) => (
            <div key={i} className="border-l-2 border-accent/20 pl-6 hover:border-accent/40 transition-colors duration-300">
              <h3 className="text-foreground font-semibold text-lg mb-3">
                {d.question}
              </h3>
              <p className="text-muted leading-relaxed">{d.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
