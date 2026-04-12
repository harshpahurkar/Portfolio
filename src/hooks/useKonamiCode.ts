"use client";

import { useEffect, useState, useCallback } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

export function useKonamiCode(callback: () => void) {
  const [index, setIndex] = useState(0);

  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === KONAMI_SEQUENCE[index]) {
        const next = index + 1;
        if (next === KONAMI_SEQUENCE.length) {
          stableCallback();
          setIndex(0);
        } else {
          setIndex(next);
        }
      } else {
        setIndex(e.code === KONAMI_SEQUENCE[0] ? 1 : 0);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, stableCallback]);
}
