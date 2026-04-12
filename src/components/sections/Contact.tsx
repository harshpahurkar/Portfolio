"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import MagneticButton from "@/components/ui/MagneticButton";
import { contactData } from "@/data/personal";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none" />
      {/* Parallax gradient orbs — stronger */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-accent/[0.07] rounded-full blur-[120px] pointer-events-none"
        style={{ y: orbY, scale: orbScale }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-accent-secondary/[0.06] rounded-full blur-[100px] pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 40]), scale: orbScale }}
      />

      <div className="max-w-[600px] mx-auto px-6 text-center relative">
        <ScrollReveal>
          <p className="text-accent-tertiary text-sm mb-2 tracking-wide">What&apos;s Next?</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            <span className="text-foreground">Get In Touch</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-muted leading-relaxed mb-10">
            {contactData.description}
          </p>

          <div className="mb-10">
            <MagneticButton>
              <Button variant="primary" href={`mailto:${contactData.email}`}>
                Say Hello →
              </Button>
            </MagneticButton>
          </div>

          <div className="flex flex-col items-center gap-4 text-sm text-muted mb-10">
            <a
              href={`mailto:${contactData.email}`}
              className="hover:text-accent transition-colors font-mono py-1"
            >
              {contactData.email}
            </a>
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors py-1"
            >
              linkedin.com/in/harshpahurkar
            </a>
            <a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors py-1"
            >
              github.com/harshpahurkar
            </a>
          </div>

          <MagneticButton>
            <Button variant="secondary" href="/resume.pdf" download>
              <Download size={14} />
              Download Resume
            </Button>
          </MagneticButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
