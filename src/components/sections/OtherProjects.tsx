import { Folder, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import TechTag from "@/components/ui/TechTag";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TiltCard from "@/components/ui/TiltCard";
import { getOtherProjects } from "@/data/projects";

export default function OtherProjects() {
  const projects = getOtherProjects();

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-24 md:pb-32">
      <ScrollReveal>
        <h3 className="text-center text-muted text-lg font-mono mb-12">
          Other Noteworthy Projects
        </h3>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 group/list">
        {projects.map((project, i) => (
          <ScrollReveal key={project.slug} delay={i * 0.1}>
            <div className="transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100 h-full">
            <TiltCard tiltAmount={5} className="h-full">
            <div className="bg-background-card/50 rounded-md overflow-hidden glow-border hover:bg-background-card/80 transition-all duration-300 h-full flex flex-col group">
              {/* Accent top border — warm gradient */}
              <div className="h-[2px] w-full bg-gradient-to-r from-accent-warm/40 via-accent/20 to-transparent" />
              <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5">
                <Folder size={36} className="text-accent/70 group-hover:text-accent transition-colors" />
                <div className="flex items-center gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub — ${project.title}`}
                    className="text-muted hover:text-accent transition-colors p-1"
                  >
                    <GithubIcon size={18} />
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo — ${project.title}`}
                      className="text-muted hover:text-accent transition-colors p-1"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                {project.title}
              </h4>
              <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
                {project.tagline}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <TechTag key={tag} name={tag} />
                ))}
              </div>
              </div>
            </div>
            </TiltCard>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="text-center mt-10">
          <a
            href="https://github.com/harshpahurkar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-accent font-mono transition-colors"
          >
            View all projects on GitHub →
          </a>
        </div>
      </ScrollReveal>
    </div>
  );
}
