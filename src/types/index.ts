// ─── Projects ───────────────────────────────────────────

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  hookMetric: string;
  tags: string[];
  github: string;
  live?: string;
  featured: boolean;
  order: number;
  gradient?: string;
  image?: string;
  caseStudy?: CaseStudy;
}

export interface CaseStudy {
  problem: string;
  architecture: ArchitectureData;
  deepDive: TechDecision[];
  codeSpotlight: CodeSnippet;
  features: FeatureGroup[];
  testing: TestingInfo;
  cicd?: string;
  results: string[];
}

// ─── Architecture Diagram ──────────────────────────────

export interface ArchitectureData {
  nodes: DiagramNode[];
  connections: DiagramConnection[];
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  layer: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  layer: number;
}

// ─── Case Study Sub-types ──────────────────────────────

export interface TechDecision {
  question: string;
  answer: string;
}

export interface CodeSnippet {
  code: string;
  language: string;
  filename?: string;
  annotation: string;
}

export interface FeatureGroup {
  heading: string;
  items: string[];
}

export interface TestingInfo {
  description: string;
  count?: string;
  strategy?: string[];
}

// ─── Experience ────────────────────────────────────────

export interface Experience {
  company: string;
  department?: string;
  role: string;
  type: string;
  duration: string;
  location: string;
  bullets: string[];
}

// ─── Tech Stack ────────────────────────────────────────

export interface TechCategory {
  category: string;
  items: TechItem[];
}

export interface TechItem {
  name: string;
}

// ─── Navigation ────────────────────────────────────────

export interface NavItem {
  number: string;
  label: string;
  href: string;
}

// ─── Metrics ───────────────────────────────────────────

export interface Metric {
  value: string;
  label: string;
}
