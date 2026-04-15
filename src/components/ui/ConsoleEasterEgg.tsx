"use client";

import { useEffect } from "react";

const MESSAGES = [
  [
    "%c👋 Hey — you opened the console. Good instinct.",
    "color: #ff2d55; font-size: 14px; font-weight: bold;",
  ],
  [
    "%c🔧 Next.js 16 + React 19 + Tailwind v4 + Framer Motion",
    "color: #bf5af2; font-size: 12px;",
  ],
  [
    "%c🎯 Try the Konami Code. ↑↑↓↓←→←→BA",
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
