"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Menu, Download } from "lucide-react";
import { navItems } from "@/data/personal";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const MobileMenu = dynamic(() => import("./MobileMenu"));

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionIds = useMemo(() => navItems.map((item) => item.href.replace("#", "")), []);
  const active = useActiveSection(sectionIds);

  const scrolledRef = useRef(false);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let previous = window.scrollY;
    let ticking = false;

    function update() {
      const latest = window.scrollY;
      const nowScrolled = latest > 80;
      const nowHidden = latest > 180 && latest > previous;

      if (nowScrolled !== scrolledRef.current) {
        scrolledRef.current = nowScrolled;
        setScrolled(nowScrolled);
      }
      if (nowHidden !== hiddenRef.current) {
        hiddenRef.current = nowHidden;
        setHidden(nowHidden);
      }
      previous = latest;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[transform,background,border,box-shadow] duration-300",
          hidden ? "-translate-y-full" : "translate-y-0",
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
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm text-foreground border border-foreground/20 rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              Resume <Download size={14} />
            </a>
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
      </header>

      {menuOpen && <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
