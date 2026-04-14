# harshpahurkar.com

My personal portfolio and project showcase. Built with Next.js, deployed on Vercel.

**Live:** [harshpahurkar.com](https://harshpahurkar.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion, custom Web Audio API synth sounds
- **Smooth Scroll:** Lenis
- **Syntax Highlighting:** Shiki
- **Icons:** Lucide React
- **Deployment:** Vercel

## Features

- Interactive particle constellation background with mouse reactivity
- Per-section color identity system (cyan, orange, violet, pink)
- Synthesized sound effects (hover, click, type, glitch, success, whoosh)
- Detailed case study pages with architecture diagrams and code spotlights
- Smooth scroll, parallax effects, and scroll-triggered animations
- Console easter eggs and Konami code
- SEO optimized with dynamic OG images and sitemap generation
- Fully responsive

## Projects Featured

- **Global Billing Service** | Multi-currency billing microservice (Stripe, AWS ECS, 39 currencies)
- **Fragments Microservice** | Cloud-native content service (S3, DynamoDB, Cognito)
- **Redis Search Engine** | Full-text search engine built on Redis
- **Housify** | Real estate platform

## Getting Started

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Pages and API routes
│   └── projects/     # Dynamic case study pages
├── components/
│   ├── case-study/   # Case study page components
│   ├── layout/       # Navigation, Footer, MobileMenu
│   ├── sections/     # Homepage sections (Hero, About, Projects, etc.)
│   └── ui/           # Reusable UI components and animations
├── data/             # All content and project data
└── lib/              # Utilities, audio engine, animations
```

## License

MIT
