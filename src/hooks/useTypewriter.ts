"use client";

import { useState, useEffect } from "react";

export function useTypewriter(
  text: string,
  trigger: boolean,
  speed = 40
): { display: string; done: boolean } {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplay("");
      setDone(false);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return { display, done };
}
