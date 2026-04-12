import ScrollReveal from "@/components/ui/ScrollReveal";
import type { FeatureGroup } from "@/types";

export default function KeyFeatures({ groups }: { groups: FeatureGroup[] }) {
  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-foreground font-semibold mb-3">
                {group.heading}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-muted text-sm leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-accent mt-1 shrink-0">▹</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
