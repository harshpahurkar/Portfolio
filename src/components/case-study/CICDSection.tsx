import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CICDSection({ text }: { text: string }) {
  const steps = text.split("→").map((s) => s.trim());

  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
          CI/CD Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="bg-background-card border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground/90 font-mono hover:border-accent/20 hover:bg-background-card/80 transition-all duration-200">
                {step}
              </span>
              {i < steps.length - 1 && (
                <span className="text-accent/60 text-sm font-mono">→</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
