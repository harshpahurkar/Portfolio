import type { MetadataRoute } from "next";
import { getFeaturedProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getFeaturedProjects().map((p) => ({
    url: `https://harshpahurkar.dev/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: "https://harshpahurkar.dev", lastModified: new Date(), priority: 1 },
    ...projects,
  ];
}
