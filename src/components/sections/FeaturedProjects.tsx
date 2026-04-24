import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ProjectCard from "./ProjectCard";
import { getFeaturedProjects } from "@/data/projects";

export default function FeaturedProjects() {
  const projects = getFeaturedProjects();

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-card/30 to-background pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-tertiary/20 to-transparent pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6 relative">
        <ScrollReveal variant="blur">
          <SectionHeading number="02" title="Projects" accentColor="text-accent-tertiary" gradientFrom="from-accent-tertiary/20" />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 group/list">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.1}>
              <div className="transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100">
                <ProjectCard project={project} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
