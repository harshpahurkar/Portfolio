"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Download } from "lucide-react";
import { navItems } from "@/data/personal";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import MagneticButton from "@/components/ui/MagneticButton";
import { playSound } from "@/lib/audio";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(() => navItems.map((item) => item.href.replace("#", "")), []);
  const active = useActiveSection(sectionIds);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 80);
    // Hide nav when scrolling down past 150px, show when scrolling up
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background,border,box-shadow] duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-accent/[0.08] shadow-lg shadow-accent/[0.04]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-display text-foreground text-sm font-semibold tracking-wide hover:text-accent transition-colors">
            Harsh Pahurkar
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
                className={cn(
                  "relative text-sm transition-colors duration-200 py-1 group",
                  active === item.href.replace("#", "")
                    ? "text-accent"
                    : "text-muted hover:text-accent"
                )}
              >
                {item.label}
                {/* Active/hover underline indicator */}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300",
                    active === item.href.replace("#", "")
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  )}
                />
              </a>
            ))}
            <MagneticButton strength={0.2}>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-foreground border border-foreground/20 rounded-full hover:border-accent hover:text-accent transition-colors"
              >
                Resume <Download size={14} />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-muted hover:text-accent transition-colors p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
