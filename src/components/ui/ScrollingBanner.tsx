const WORDS = [
  "Node.js", "Python", "AWS", "Docker", "PostgreSQL", "Redis",
  "TypeScript", "React", "Kubernetes", "Microservices", "REST APIs", "CI/CD",
];

export default function ScrollingBanner() {
  const line = WORDS.join("  ·  ");

  return (
    <div className="py-8 overflow-hidden select-none pointer-events-none relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="banner-track text-accent/[0.05] text-6xl md:text-8xl font-display font-black tracking-tight">
        {line}&nbsp;&nbsp;·&nbsp;&nbsp;{line}
      </div>
      <div className="banner-track banner-track-reverse text-accent-secondary/[0.04] text-6xl md:text-8xl font-display font-black tracking-tight mt-2">
        {line}&nbsp;&nbsp;·&nbsp;&nbsp;{line}
      </div>
    </div>
  );
}
