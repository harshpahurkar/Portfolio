"use client";

import { cn } from "@/lib/utils";
import TextScramble from "./TextScramble";

interface SectionHeadingProps {
  number: string;
  title: string;
  className?: string;
  accentColor?: string;
  gradientFrom?: string;
}

export default function SectionHeading({ number, title, className, accentColor = "text-accent", gradientFrom = "from-accent/20" }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12", className)}>
      <span className={cn("font-mono text-xs tracking-[0.2em] uppercase mb-3 block", accentColor)}>
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
        <TextScramble text={title} />
      </h2>
      <div className={cn("h-px bg-gradient-to-r to-transparent mt-4 max-w-xs", gradientFrom)} />
    </div>
  );
}
