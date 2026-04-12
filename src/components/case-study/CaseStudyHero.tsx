import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import TechTag from "@/components/ui/TechTag";
import type { Project } from "@/types";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <header className="relative mb-20">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-accent font-mono text-sm hover:text-accent-hover transition-colors mb-10 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to All Projects
      </Link>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 tracking-tight">
        {project.title}
      </h1>

      <p className="text-lg text-muted mt-5 max-w-2xl leading-relaxed">
        {project.tagline}
      </p>

      <div className="flex flex-wrap gap-2 mt-8">
        {project.tags.map((tag) => (
          <TechTag key={tag} name={tag} />
        ))}
      </div>

      <div className="flex items-center gap-5 mt-8">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm"
          aria-label={`View ${project.title} on GitHub`}
        >
          <GithubIcon size={18} />
          Source Code
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm"
            aria-label={`View ${project.title} live demo`}
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        )}
      </div>

      {/* Subtle divider */}
      <div className="section-divider mt-12" />
    </header>
  );
}
