import Hero from "@/components/sections/Hero";
import MetricsBar from "@/components/sections/MetricsBar";
import About from "@/components/sections/About";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import OtherProjects from "@/components/sections/OtherProjects";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import Contact from "@/components/sections/Contact";
import ScrollingBanner from "@/components/ui/ScrollingBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <MetricsBar />
      <About />
      <ScrollingBanner />
      <FeaturedProjects />
      <OtherProjects />
      <div className="section-divider max-w-sm mx-auto" />
      <Experience />
      <div className="section-divider max-w-sm mx-auto" />
      <TechStack />
      <div className="section-divider max-w-sm mx-auto" />
      <Contact />
    </>
  );
}
