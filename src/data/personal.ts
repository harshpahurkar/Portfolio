import type { NavItem, Metric } from "@/types";

export const siteMetadata = {
  name: "Harsh Pahurkar",
  title: "Harsh Pahurkar | Backend & Full-Stack Engineer",
  description:
    "Backend & Full-Stack Engineer specializing in microservices, REST APIs, and cloud-native systems. Previously at the Government of Ontario. Based in Toronto.",
  url: "https://harshpahurkar.dev",
  keywords: [
    "Harsh Pahurkar",
    "Backend Engineer",
    "Full-Stack Developer",
    "Toronto",
    "Node.js",
    "Python",
    "AWS",
    "Microservices",
    "REST API",
    "Government of Ontario",
    "Software Engineer",
  ],
};

export const heroData = {
  greeting: "Hey, I'm",
  name: "Harsh Pahurkar.",
  headline: "I build things that actually work.",
  description:
    "Backend & Full-Stack Engineer focused on microservices, REST APIs, automation, and cloud-native systems. Previously at the ",
  descriptionHighlight: "Government of Ontario",
  descriptionEnd: ".",
  status: "Available for opportunities",
};

export const aboutData = {
  paragraphs: [
    "I'm a backend-focused engineer based in Toronto. Over the past 3+ years I've worked on billing platforms, cloud microservices, automation frameworks, and API infrastructure at the Government of Ontario and Affimintus Technologies.",
    "At Affimintus I built production REST APIs and full-stack systems with Java, Spring Boot, React, PostgreSQL, and MongoDB. At the Government of Ontario I built automation frameworks, API testing systems, and CI/CD pipelines. The through-line is software that other people depend on.",
    "I graduated from Seneca Polytechnic with a 3.6 GPA Honours in Computer Programming & Analysis. I also teach coding to kids at Code Ninjas — it's a good way to stay sharp on fundamentals.",
    "Outside of work I'm usually speedrunning Resident Evil 4 or diving into whatever new tech caught my attention that week.",
  ],
  currently:
    "Currently looking for backend SWE roles in Toronto.",
  whatIBring:
    "Production backend thinking: API design, cloud infrastructure, testing discipline, and CI/CD automation.",
};

export const metrics: Metric[] = [
  { value: "3+", label: "Years Experience" },
  { value: "200+", label: "Endpoints Validated" },
  { value: "95%", label: "Code Coverage" },
  { value: "50K+", label: "Lines Refactored" },
];

export const navItems: NavItem[] = [
  { number: "01", label: "About", href: "#about" },
  { number: "02", label: "Projects", href: "#projects" },
  { number: "03", label: "Experience", href: "#experience" },
  { number: "04", label: "Contact", href: "#contact" },
];

export const contactData = {
  heading: "Get In Touch",
  description:
    "I'm currently open to new opportunities. If you have a role that might be a good fit, or just want to connect, feel free to reach out.",
  email: "harshpahurkar33@gmail.com",
  linkedin: "https://linkedin.com/in/harshpahurkar",
  github: "https://github.com/harshpahurkar",
  resumePath: "/resume.pdf",
};

export const footerData = {
  builtWith: "Built with Next.js, Tailwind CSS & Framer Motion. Deployed on Vercel.",
  openSource: {
    text: "View source on GitHub",
    href: "https://github.com/harshpahurkar/Portfolio",
  },
};
