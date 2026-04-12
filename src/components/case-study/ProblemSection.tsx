import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ProblemSection({ text }: { text: string }) {
  return (
    <ScrollReveal>
      <section className="mb-20">
        <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-5">
          The Problem
        </h2>
        <p className="text-foreground/90 text-lg leading-[1.8] max-w-3xl">
          {text}
        </p>
      </section>
    </ScrollReveal>
  );
}
