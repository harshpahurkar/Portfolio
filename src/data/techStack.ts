import type { TechCategory } from "@/types";

export const techStack: TechCategory[] = [
  {
    category: "Languages",
    items: [
      { name: "Python" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Java" },
      { name: "C++" },
      { name: "SQL" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "FastAPI" },
      { name: "Spring Boot" },
      { name: "Stripe API" },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS" },
      { name: "Docker" },
      { name: "GitHub Actions" },
      { name: "CI/CD" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL" },
      { name: "Redis" },
      { name: "MongoDB" },
      { name: "DynamoDB" },
    ],
  },
  {
    category: "Testing",
    items: [
      { name: "Jest" },
      { name: "pytest" },
      { name: "Supertest" },
      { name: "Selenium" },
    ],
  },
];
