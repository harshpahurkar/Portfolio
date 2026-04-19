import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import SocialRail from "@/components/layout/SocialRail";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/ui/PageTransition";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import ConsoleEasterEgg from "@/components/ui/ConsoleEasterEgg";
import RetroGrid from "@/components/ui/RetroGrid";
import SpotlightCursor from "@/components/ui/SpotlightCursor";
import KonamiCode from "@/components/ui/KonamiCode";
import SoundToggle from "@/components/ui/SoundToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harshpahurkar.dev"),
  title: {
    default: "Harsh Pahurkar | Backend & Full-Stack Engineer",
    template: "%s | Harsh Pahurkar",
  },
  description:
    "Backend & Full-Stack Engineer specializing in microservices, REST APIs, and cloud-native systems. Previously at the Government of Ontario. Based in Toronto.",
  keywords: [
    "Harsh Pahurkar", "Backend Engineer", "Full-Stack Developer",
    "Toronto", "Node.js", "Python", "AWS", "Microservices", "REST API",
    "Government of Ontario", "Software Engineer",
  ],
  authors: [{ name: "Harsh Pahurkar" }],
  creator: "Harsh Pahurkar",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://harshpahurkar.dev",
    siteName: "Harsh Pahurkar",
    title: "Harsh Pahurkar | Backend & Full-Stack Engineer",
    description:
      "Backend & Full-Stack Engineer. Microservices, REST APIs, cloud-native systems. Previously at the Government of Ontario.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Pahurkar | Backend & Full-Stack Engineer",
    description:
      "Backend & Full-Stack Engineer. Microservices, REST APIs, cloud-native systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harsh Pahurkar",
              url: "https://harshpahurkar.dev",
              jobTitle: "Backend & Full-Stack Engineer",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Seneca Polytechnic",
              },
              knowsAbout: [
                "Node.js", "Python", "AWS", "Microservices", "REST APIs",
              ],
              sameAs: [
                "https://github.com/harshpahurkar",
                "https://linkedin.com/in/harshpahurkar",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<!-- You're inspecting my HTML? Bold move. I respect that. GitHub: github.com/harshpahurkar | Hint: Try the Konami Code. -->",
          }}
          style={{ display: "none" }}
        />
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded focus:font-mono focus:text-sm"
        >
          Skip to main content
        </a>
        <Navigation />
        <SocialRail />
        <RetroGrid />
        <SpotlightCursor />
        <ScrollProgress />
        <PageTransition />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
        <KonamiCode />
        <SoundToggle />
        <ConsoleEasterEgg />
      </body>
    </html>
  );
}
