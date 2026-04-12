import ScrollReveal from "@/components/ui/ScrollReveal";
import type { TestingInfo } from "@/types";

export default function TestingSection({ info }: { info: TestingInfo }) {
  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
          Testing
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {info.description}
        </p>
        {info.count && (
          <p className="text-accent font-mono text-sm mb-4">{info.count}</p>
        )}
        {info.strategy && info.strategy.length > 0 && (
          <ul className="space-y-2">
            {info.strategy.map((s, i) => (
              <li
                key={i}
                className="text-muted text-sm leading-relaxed flex items-start gap-2"
              >
                <span className="text-accent mt-1 shrink-0">▹</span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </section>
    </ScrollReveal>
  );
}
