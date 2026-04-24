import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { contactData, footerData } from "@/data/personal";

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 text-center">
      {/* Gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Mobile social icons (hidden on desktop where rails are visible) */}
      <div className="flex justify-center gap-6 mb-10 lg:hidden">
        {[
          { href: contactData.github, label: "GitHub", icon: <GithubIcon size={20} /> },
          { href: contactData.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={20} /> },
          { href: `mailto:${contactData.email}`, label: "Email", icon: <Mail size={20} /> },
        ].map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label !== "Email" ? "_blank" : undefined}
            rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            className="text-muted hover:text-accent transition-colors p-2"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {link.icon}
          </a>
        ))}
      </div>

      <p className="text-muted/60 text-sm">Designed &amp; Built by Harsh Pahurkar</p>
      <p className="text-muted/40 text-xs mt-2">{footerData.builtWith}</p>
      <a
        href={footerData.openSource.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted/40 text-xs hover:text-accent transition-colors"
      >
        {footerData.openSource.text}
      </a>
      <p className="text-muted/40 text-xs mt-8 font-mono tracking-wide">
        &copy; {new Date().getFullYear()} Harsh Pahurkar
      </p>
    </footer>
  );
}
