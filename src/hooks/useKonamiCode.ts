"use client";

import { useEffect, useRef, useCallback } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "KeyB", "KeyA",
];

export function useKonamiCode(callback: () => void) {
  const indexRef = useRef(0);
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === KONAMI_SEQUENCE[indexRef.current]) {
        const next = indexRef.current + 1;
        if (next === KONAMI_SEQUENCE.length) {
          stableCallback();
          indexRef.current = 0;
        } else {
          indexRef.current = next;
        }
      } else {
        indexRef.current = e.code === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stableCallback]);
}
