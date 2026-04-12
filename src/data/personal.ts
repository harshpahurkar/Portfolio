import type { NavItem, Metric } from "@/types";

export const siteMetadata = {
  name: "Harsh Pahurkar",
  title: "Harsh Pahurkar — Backend & Full-Stack Engineer",
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
    "Backend & Full-Stack Engineer who turns caffeine into microservices, REST APIs, and cloud-native systems that handle real-world chaos. Previously broke things (on purpose) at the ",
  descriptionHighlight: "Government of Ontario",
  descriptionEnd: ". Ask me about the time I automated myself out of a job.",
  status: "Available for opportunities",
};

export const aboutData = {
  paragraphs: [
    "I'm a backend-focused engineer based in Toronto. I've spent the last 4+ years building the systems that products depend on — billing platforms, cloud microservices, API infrastructure. I designed automation pipelines for the Government of Ontario and shipped production backend services at Affimintus Technologies. I have strong opinions, loosely held. Okay, some are tightly held.",
    "Before Canada, I spent 2.5 years as a Software Developer at Affimintus Technologies in India, working on production REST APIs with Java and Spring Boot. That's where I learned what real-world backend engineering looks like — not tutorials, but actual systems impacting thousands of users.",
    "I graduated from Seneca Polytechnic with a 3.9 GPA Honours in Computer Programming & Analysis. I also teach coding to kids at Code Ninjas — because if you can explain microservices to a 10-year-old, you actually understand them.",
    "When I'm not writing API endpoints, I'm probably speedrunning Resident Evil or explaining why your favorite framework is mid.",
  ],
  currently:
    "Currently seeking backend SWE roles in Toronto. Yes, I will debate your architecture choices. No, I won't apologize.",
  whatIBring:
    "I bring production backend thinking — API design, cloud infrastructure, testing discipline, and CI/CD automation. Also unsolicited code reviews.",
};

export const metrics: Metric[] = [
  { value: "4+", label: "Years Experience" },
  { value: "75%", label: "Testing Reduction" },
  { value: "39", label: "Currencies Processed" },
  { value: "200+", label: "Endpoints Validated" },
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
    "Whether you have a job opportunity, a hot take about microservices, or just want to debate tabs vs spaces — my inbox is open and has better uptime than most production APIs.",
  email: "harshpahurkar33@gmail.com",
  linkedin: "https://linkedin.com/in/harshpahurkar",
  github: "https://github.com/harshpahurkar",
  resumePath: "/resume.pdf",
};

export const footerData = {
  builtWith: "Built with Next.js, Tailwind CSS & Framer Motion. Deployed on Vercel. Fueled by spite and energy drinks.",
  openSource: {
    text: "View source — I dare you.",
    href: "https://github.com/harshpahurkar/Portfolio",
  },
};
