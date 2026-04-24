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
      { name: "Go" },
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
      { name: "React" },
      { name: "Stripe API" },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "GitHub Actions" },
      { name: "Azure DevOps" },
      { name: "Jenkins" },
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
      { name: "TestNG" },
      { name: "RestAssured" },
    ],
  },
];
