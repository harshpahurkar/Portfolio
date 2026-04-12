"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { experiences } from "@/data/experience";

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="py-24 md:py-32 relative">
      {/* Cyberpunk gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-tl from-accent-warm/[0.04] via-transparent to-accent-tertiary/[0.03] pointer-events-none" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] bg-accent-warm/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6">
        <ScrollReveal variant="slide">
          <SectionHeading number="03" title="Experience" accentColor="text-accent-warm" gradientFrom="from-accent-warm/20" />
        </ScrollReveal>

        <div className="relative" ref={timelineRef}>
          {/* Scroll-linked timeline progress */}
          <div className="absolute left-1.5 md:left-4 top-0 bottom-0 w-px bg-white/[0.05]" />
          <motion.div
            className="absolute left-1.5 md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent-warm via-accent-warm/60 to-accent-warm/20 origin-top"
            style={{ scaleY }}
          />

          <div className="space-y-14 group/list">
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.company} delay={i * 0.15}>
                <div className="relative pl-8 md:pl-14 transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100">
                  {/* Timeline dot with glow */}
                  <div className="absolute left-1.5 md:left-4 top-1.5 -translate-x-1/2">
                    <div className="w-3 h-3 rounded-full bg-accent-warm border-2 border-background shadow-[0_0_10px_rgba(255,107,43,0.4)]" />
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
                      {exp.role}{" "}
                      <span className="text-accent-warm">
                        @ {exp.company}
                      </span>
                    </h3>
                    {exp.department && (
                      <p className="text-sm text-muted/60 mt-0.5">{exp.department}</p>
                    )}
                    <p className="text-sm font-mono text-muted/70 mt-1 tracking-wide">
                      {exp.duration} · {exp.location}
                      {exp.type && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] text-accent-warm/70 bg-accent-warm/[0.06] border border-accent-warm/10 rounded-full uppercase tracking-wider">
                          {exp.type}
                        </span>
                      )}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3 text-muted text-sm leading-relaxed">
                          <span className="text-accent-warm mt-1.5 flex-shrink-0">▸</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: bullet.replace(
                                /(\d+%|\d+\+?)/g,
                                '<span class="text-foreground font-semibold font-mono">$1</span>'
                              ),
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
