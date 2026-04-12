import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary";
  href?: string;
  download?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  href,
  download,
  className,
  children,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer relative overflow-hidden group/btn";
  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(255,45,85,0.3)] active:scale-[0.97]",
    secondary:
      "border border-accent/30 text-foreground hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(255,45,85,0.1)] hover:scale-[1.04] active:scale-[0.97]",
  };

  const inner = (
    <>
      {/* Shine sweep on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </>
  );

  const classes = cn(base, variants[variant], className);

  if (href?.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  if (href?.startsWith("mailto:") || href?.startsWith("http") || download) {
    return (
      <a
        href={href}
        className={classes}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        download={download || undefined}
      >
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {inner}
    </button>
  );
}
