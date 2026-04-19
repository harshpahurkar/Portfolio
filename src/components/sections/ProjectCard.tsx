"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import TechTag from "@/components/ui/TechTag";
import TiltCard from "@/components/ui/TiltCard";
import { playSound } from "@/lib/audio";
import type { Project } from "@/types";

const CARD_VISUALS: Record<string, { gradient: string; monogram: string; label: string; hoverAccent: string; ctaColor: string }> = {
  "global-billing-service": {
    gradient: "linear-gradient(135deg, #ff2d55 0%, #bf5af2 50%, #00e5ff 100%)",
    monogram: "GB",
    label: "Billing Service",
    hoverAccent: "group-hover:text-accent",
    ctaColor: "text-accent",
  },
  fragments: {
    gradient: "linear-gradient(135deg, #00e5ff 0%, #bf5af2 50%, #ff2d55 100%)",
    monogram: "FR",
    label: "Microservice",
    hoverAccent: "group-hover:text-accent-secondary",
    ctaColor: "text-accent-secondary",
  },
  "redis-search-engine": {
    gradient: "linear-gradient(135deg, #ff6b2b 0%, #ff2d55 50%, #bf5af2 100%)",
    monogram: "RS",
    label: "Search Engine",
    hoverAccent: "group-hover:text-accent-warm",
    ctaColor: "text-accent-warm",
  },
  housify: {
    gradient: "linear-gradient(135deg, #bf5af2 0%, #ff2d55 50%, #ff6b2b 100%)",
    monogram: "HY",
    label: "Hackathon",
    hoverAccent: "group-hover:text-accent-tertiary",
    ctaColor: "text-accent-tertiary",
  },
};

export default function ProjectCard({ project }: { project: Project }) {
  const visual = CARD_VISUALS[project.slug];

  return (
    <Link href={`/projects/${project.slug}`} onClick={() => playSound("click")}>
      <TiltCard className="relative h-full">
        <article
          onMouseEnter={() => playSound("hover")}
          className="h-full rounded-lg overflow-hidden border border-white/[0.06] hover:border-white/[0.15] hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-[5px] transition-all duration-200 cursor-pointer flex flex-col group"
        >
        {/* Visual header zone */}
        {visual && (
          <div
            className="relative h-36 md:h-40 shrink-0 overflow-hidden"
            style={{ background: project.image ? undefined : visual.gradient }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <>
                {/* Monogram watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/[0.08] text-[80px] md:text-[100px] font-black leading-none select-none tracking-[-0.05em] group-hover:tracking-[0.02em] transition-all duration-700">
                    {visual.monogram}
                  </span>
                </div>
              </>
            )}
            {/* Label badge */}
            <div className="absolute bottom-3 left-4">
              <span className="text-[10px] font-mono text-white/60 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {visual.label}
              </span>
            </div>
            {/* Order number */}
            <div className="absolute top-3 right-4">
              <span className="text-white/25 font-mono text-sm font-bold">
                {project.order.toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-7 flex flex-col flex-1 bg-background-card/50 group-hover:bg-background-card/80 transition-colors duration-300">
          {/* Title */}
          <h3 className={`text-xl font-bold text-foreground mb-2 ${visual?.hoverAccent || "group-hover:text-accent"} transition-colors duration-200`}>
            {project.title}
          </h3>

          {/* Tagline */}
          <p className="text-muted text-sm leading-relaxed mb-3">
            {project.tagline}
          </p>

          {/* Hook metric */}
          <p className="text-foreground/50 text-xs font-mono mb-5">
            {project.hookMetric}
          </p>

          <div className="mt-auto">
            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <TechTag key={tag} name={tag} />
              ))}
            </div>

            {/* CTA */}
            <span className={`inline-flex items-center gap-1.5 text-sm ${visual?.ctaColor || "text-accent"} font-mono group-hover:gap-2.5 transition-all duration-200`}>
              Read Case Study
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </span>
          </div>
        </div>
      </article>
      </TiltCard>
    </Link>
  );
}
