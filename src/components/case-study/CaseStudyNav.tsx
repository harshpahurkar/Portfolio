import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/types";

export default function CaseStudyNav({
  prev,
  next,
}: {
  prev?: Project;
  next?: Project;
}) {
  return (
    <nav className="border-t border-white/[0.06] pt-14 mt-20">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-accent font-mono text-sm hover:text-accent-hover transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to All Projects
      </Link>

      <div className="flex justify-between items-stretch gap-4">
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex-1 bg-background-card/50 border border-white/[0.06] rounded-lg p-5 hover:border-accent/20 hover:bg-background-card/80 transition-all duration-300"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted font-mono uppercase tracking-wider">
              <ArrowLeft size={12} /> Previous
            </span>
            <p className="text-foreground font-semibold mt-2 group-hover:text-accent transition-colors">
              {prev.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex-1 bg-background-card/50 border border-white/[0.06] rounded-lg p-5 text-right hover:border-accent/20 hover:bg-background-card/80 transition-all duration-300"
          >
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted font-mono uppercase tracking-wider">
              Next <ArrowRight size={12} />
            </span>
            <p className="text-foreground font-semibold mt-2 group-hover:text-accent transition-colors">
              {next.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
