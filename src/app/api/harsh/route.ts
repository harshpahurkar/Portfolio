import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      name: "Harsh Pahurkar",
      role: "Backend & Full-Stack Engineer",
      location: "Toronto, Canada",
      status: "available",
      stack: ["Node.js", "Python", "FastAPI", "AWS", "PostgreSQL", "Docker"],
      contact: "harshpahurkar33@gmail.com",
      portfolio: "https://harshpahurkar.dev",
      github: "https://github.com/harshpahurkar",
      linkedin: "https://linkedin.com/in/harshpahurkar",
      easter_egg: "You found the API. I respect that.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Powered-By": "Harsh Pahurkar",
      },
    }
  );
}
