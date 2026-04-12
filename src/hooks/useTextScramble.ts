"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function useTextScramble(text: string, trigger: boolean, speed = 30) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);

  const scramble = useCallback(() => {
    let iteration = 0;
    const length = text.length;

    function step() {
      const progress = iteration / (length * 2);
      const revealed = Math.floor(progress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < revealed) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);
      iteration++;

      if (iteration < length * 2) {
        frameRef.current = window.setTimeout(step, speed);
      } else {
        setDisplay(text);
      }
    }

    step();
  }, [text, speed]);

  useEffect(() => {
    if (trigger) {
      scramble();
    }
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [trigger, scramble]);

  return display;
}
