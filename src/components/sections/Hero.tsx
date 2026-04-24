import { ArrowRight, Cloud, Code2, Cpu, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { heroData } from "@/data/personal";
import Button from "@/components/ui/Button";

const heroWords = ["ship APIs", "tune systems", "automate tests", "build clouds"];

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[92vh] flex items-center pt-20 pb-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,45,85,0.08),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(0,229,255,0.07),transparent_28%),linear-gradient(180deg,transparent,rgba(10,10,15,0.78))] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 w-full relative z-[2]">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] gap-12 lg:gap-16 items-center">
          <div>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] text-accent text-xs font-mono tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                {heroData.status}
              </span>
            </div>

            <p className="font-mono text-accent-secondary text-sm md:text-base tracking-wide mb-5">
              {heroData.greeting}
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[1.02] tracking-tight">
              <span className="gradient-text neon-glow">{heroData.name}</span>
            </h1>

            <h2 className="mt-5 max-w-3xl text-3xl sm:text-4xl md:text-5xl font-display font-bold text-muted leading-[1.1] tracking-tight">
              Backend-focused engineer. I{" "}
              <span className="hero-word-rotator text-accent-secondary">
                {heroWords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </span>
              <span className="text-foreground/85"> that hold up.</span>
            </h2>

            <p className="max-w-xl text-muted mt-8 text-base md:text-lg leading-relaxed">
              {heroData.description}
              <span className="text-accent-secondary font-medium">
                {heroData.descriptionHighlight}
              </span>
              {heroData.descriptionEnd} I like clean APIs, practical automation, and systems that feel calm even when the workload does not.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Button variant="primary" href="#projects">
                View My Work
                <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" href="#contact">
                Get In Touch
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="hero-orbit" aria-hidden="true">
              <span className="hero-orbit-dot hero-orbit-dot-a" />
              <span className="hero-orbit-dot hero-orbit-dot-b" />
              <span className="hero-orbit-dot hero-orbit-dot-c" />
              <div className="hero-core">
                <Cpu size={34} />
                <span>HP</span>
              </div>
            </div>

            <div className="grid gap-4 mt-8 lg:mt-0">
              <div className="brand-panel brand-panel-primary">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-accent-secondary tracking-[0.18em] uppercase">
                    signal
                  </span>
                  <Terminal size={18} className="text-accent-secondary" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <p><span className="text-accent">$</span> deploy backend-service</p>
                  <p className="text-muted">tests: 200+ endpoints validated</p>
                  <p className="text-muted">pipeline: 2 weeks to 3 days</p>
                  <p className="text-accent-secondary">status: production-minded</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Code2, label: "APIs" },
                  { icon: Cloud, label: "Cloud" },
                  { icon: ShieldCheck, label: "QA" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="mini-signal">
                    <Icon size={18} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="brand-panel flex items-center gap-4">
                <Sparkles size={18} className="text-accent-warm flex-shrink-0" />
                <p className="text-sm text-muted leading-relaxed">
                  Toronto-based, Seneca-trained, gaming-brained builder with a bias for measurable improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
