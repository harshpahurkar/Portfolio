import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ResultsMetrics({ results }: { results: string[] }) {
  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-8">
          Results
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {results.map((result, i) => (
            <div
              key={i}
              className="bg-background-card/70 border border-white/[0.06] rounded-lg p-5 flex items-start gap-4 hover:border-accent/15 transition-colors duration-300"
            >
              <span className="text-accent font-mono text-lg font-bold shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-foreground/90 text-sm leading-relaxed">
                {result}
              </p>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
