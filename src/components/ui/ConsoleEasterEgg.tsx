"use client";

import { useEffect } from "react";

const MESSAGES = [
  [
    "%c🎮 Oh? You opened the console? We're the same, you and I.",
    "color: #ff2d55; font-size: 16px; font-weight: bold;",
  ],
  [
    "%c⚡ Built by Harsh Pahurkar — ENTP, so naturally I over-engineered the portfolio instead of applying to jobs.",
    "color: #bf5af2; font-size: 12px;",
  ],
  [
    "%c💼 If you're a recruiter reading source code... you're my kind of recruiter. Let's talk.",
    "color: #ff2d55; font-size: 12px;",
  ],
  [
    "%c🔧 Stack: Next.js 16 + React 19 + Tailwind v4 + Framer Motion + an unreasonable number of opinions",
    "color: #ff6b2b; font-size: 11px;",
  ],
  [
    "%c🧪 Fun fact: This portfolio has more animations than some production apps I've shipped. Priorities.",
    "color: #00e5ff; font-size: 11px;",
  ],
  [
    "%c🎯 Psst… try the Konami Code. ↑↑↓↓←→←→BA — you won't regret it. Probably.",
    "color: #00e5ff; font-size: 11px; font-style: italic;",
  ],
];

export default function ConsoleEasterEgg() {
  useEffect(() => {
    // Small delay so it appears after initial logs
    const timer = setTimeout(() => {
      MESSAGES.forEach(([msg, style]) => {
        console.log(msg, style);
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
