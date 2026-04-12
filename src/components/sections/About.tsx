import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Parallax from "@/components/ui/Parallax";
import { aboutData } from "@/data/personal";

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      {/* Cyberpunk gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/[0.05] via-transparent to-accent-tertiary/[0.03] pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6 relative">
        <ScrollReveal variant="blur">
          <SectionHeading number="01" title="About Me" accentColor="text-accent-secondary" gradientFrom="from-accent-secondary/20" />
        </ScrollReveal>

        <div className="grid md:grid-cols-[3fr_2fr] gap-14 items-start">
          <ScrollReveal>
            <div className="space-y-5 text-muted leading-[1.8] text-[15px]">
              {aboutData.paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /(Government of Ontario|Affimintus Technologies|Seneca Polytechnic|Code Ninjas|3\.9 GPA|Resident Evil)/g,
                    '<span class="text-foreground">$1</span>'
                  ),
                }} />
              ))}
              <p className="text-accent-secondary/90 font-medium mt-6">{aboutData.whatIBring}</p>
              <p className="text-sm text-muted/60 mt-2 font-mono">{aboutData.currently}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Parallax speed={-0.15}>
            <div className="relative mx-auto md:mx-0 w-[280px] md:w-full max-w-[350px] overflow-hidden md:overflow-visible">
              <div className="relative group">
                {/* Glow effect behind image */}
                <div className="absolute -inset-2 bg-accent-secondary/[0.08] rounded-lg blur-xl group-hover:bg-accent-secondary/[0.15] transition-all duration-500" />
                <Image
                  src="/photo.jpg"
                  alt="Harsh Pahurkar"
                  width={400}
                  height={400}
                  priority
                  className="relative rounded-lg object-cover w-full aspect-square grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-lg border-2 border-accent-secondary/30 translate-x-5 translate-y-5 -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
              </div>
            </div>
            </Parallax>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
