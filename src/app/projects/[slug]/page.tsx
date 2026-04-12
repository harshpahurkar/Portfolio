import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getNextProject, getPrevProject, getFeaturedProjects } from "@/data/projects";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import ProblemSection from "@/components/case-study/ProblemSection";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import TechDeepDive from "@/components/case-study/TechDeepDive";
import CodeSpotlight from "@/components/case-study/CodeSpotlight";
import KeyFeatures from "@/components/case-study/KeyFeatures";
import TestingSection from "@/components/case-study/TestingSection";
import CICDSection from "@/components/case-study/CICDSection";
import ResultsMetrics from "@/components/case-study/ResultsMetrics";
import CaseStudyNav from "@/components/case-study/CaseStudyNav";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getFeaturedProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project?.caseStudy) {
    notFound();
  }

  const { caseStudy } = project;
  const nextProject = getNextProject(project.slug);
  const prevProject = getPrevProject(project.slug);

  return (
    <article className="max-w-[1100px] mx-auto px-6 pt-28 pb-24 relative">
      <CaseStudyHero project={project} />
      <ProblemSection text={caseStudy.problem} />
      <ArchitectureDiagram data={caseStudy.architecture} />
      <TechDeepDive decisions={caseStudy.deepDive} />
      <CodeSpotlight snippet={caseStudy.codeSpotlight} />
      <KeyFeatures groups={caseStudy.features} />
      <TestingSection info={caseStudy.testing} />
      {caseStudy.cicd && <CICDSection text={caseStudy.cicd} />}
      <ResultsMetrics results={caseStudy.results} />
      <CaseStudyNav prev={prevProject} next={nextProject} />
    </article>
  );
}
