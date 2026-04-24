import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { contactData } from "@/data/personal";

export default function SocialRail() {
  return (
    <>
      {/* Left rail — social icons */}
      <div className="hidden lg:flex fixed left-6 xl:left-10 bottom-0 flex-col items-center gap-6 z-40">
        <a
          href={contactData.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted hover:text-accent hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,45,85,0.4)] transition-all duration-200"
        >
          <GithubIcon size={20} />
        </a>
        <a
          href={contactData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted hover:text-accent hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,45,85,0.4)] transition-all duration-200"
        >
          <LinkedinIcon size={20} />
        </a>
        <a
          href={`mailto:${contactData.email}`}
          aria-label="Email"
          className="text-muted hover:text-accent hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(255,45,85,0.4)] transition-all duration-200"
        >
          <Mail size={20} />
        </a>
        <div className="w-px h-24 bg-gradient-to-b from-accent/30 to-muted/20" />
      </div>

      {/* Right rail — email */}
      <div className="hidden lg:flex fixed right-6 xl:right-10 bottom-0 flex-col items-center gap-6 z-40">
        <a
          href={`mailto:${contactData.email}`}
          className="writing-vertical-rl tracking-widest text-xs text-muted hover:text-accent transition-colors duration-200"
        >
          {contactData.email}
        </a>
        <div className="w-px h-24 bg-gradient-to-b from-accent/30 to-muted/20" />
      </div>
    </>
  );
}
