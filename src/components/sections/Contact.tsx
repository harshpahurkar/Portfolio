import { Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { contactData } from "@/data/personal";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-[58%] h-px bg-gradient-to-r from-transparent via-accent-secondary/15 to-transparent pointer-events-none" />

      <div className="max-w-[760px] mx-auto px-6 text-center relative">
        <ScrollReveal>
          <p className="text-accent-tertiary text-sm mb-2 tracking-wide font-mono">What&apos;s Next?</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            <span className="text-foreground">{contactData.heading}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-muted leading-relaxed mb-10">
            {contactData.description}
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-4">
            <Button variant="primary" href={`mailto:${contactData.email}`}>
              <Mail size={16} />
              Say Hello
            </Button>
            <Button variant="secondary" href="/resume.pdf" download>
              <Download size={14} />
              Download Resume
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted">
            <a
              href={`mailto:${contactData.email}`}
              className="contact-chip"
            >
              <Mail size={15} />
              Email
            </a>
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-chip"
            >
              <LinkedinIcon size={15} />
              LinkedIn
            </a>
            <a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-chip"
            >
              <GithubIcon size={15} />
              GitHub
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
