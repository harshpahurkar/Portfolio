import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
  variant?: "default" | "scale" | "slide" | "blur";
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
  variant = "default",
}: ScrollRevealProps) {
  return (
    <div
      className={cn("reveal-lite", className)}
      data-direction={direction}
      data-variant={variant}
      style={{
        animationDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  );
}
