"use client";

import { useRef, useEffect } from "react";
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
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!inView || hasRunRef.current) return;
    hasRunRef.current = true;
    const el = ref.current;
    if (!el) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timerId = setTimeout(() => {
      let frame = 0;
      const totalFrames = text.length * 3;
      const revealedAt: number[] = text.split("").map((_, i) => i * 2 + Math.random() * 4);

      intervalId = setInterval(() => {
        frame++;
        const result = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (frame >= revealedAt[i]) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        el.textContent = result;

        if (frame >= totalFrames) {
          if (intervalId) clearInterval(intervalId);
          el.textContent = text;
        }
      }, 30);
    }, delay * 1000);

    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, text, delay]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
