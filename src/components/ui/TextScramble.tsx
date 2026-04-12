"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextScramble({ text, className = "", delay = 0 }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(text);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!inView || hasRun) return;

    const timer = setTimeout(() => {
      let frame = 0;
      const totalFrames = text.length * 3;
      const revealedAt: number[] = text.split("").map((_, i) => i * 2 + Math.random() * 4);

      const interval = setInterval(() => {
        frame++;
        const result = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (frame >= revealedAt[i]) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplay(result);

        if (frame >= totalFrames) {
          clearInterval(interval);
          setDisplay(text);
          setHasRun(true);
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [inView, text, delay, hasRun]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
