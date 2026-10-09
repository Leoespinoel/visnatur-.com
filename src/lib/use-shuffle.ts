"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆÆÆ"; // Æ weighted so it shows up often while shuffling

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

export type ShuffleOptions = {
  /** ms between frames, or a function of elapsed ms (lets the cycling slow down over time). */
  tick?: number | ((elapsed: number) => number);
  /** ms between each letter settling (linear). Ignored when `settleAt` is given. */
  stagger?: number;
  /** ms before the first letter settles. */
  settleAfter?: number;
  /**
   * Custom settle time per letter: receives the letter's index among non-space letters (k)
   * and the count (n), returns ms after start. Lets later letters take longer than earlier ones.
   */
  settleAt?: (k: number, n: number) => number;
};

/**
 * Letters cycle through random capitals (Æ included) and settle left to right.
 * Used by the header wordmark and the intro. Does nothing under reduced motion.
 */
export function useShuffle(text: string, { tick = 45, stagger = 70, settleAfter = 350, settleAt }: ShuffleOptions = {}) {
  const [letters, setLetters] = useState<string[]>(() => text.split(""));
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  /** Stop and show the final text immediately. */
  const settle = useCallback(() => {
    stop();
    setLetters(text.split(""));
  }, [stop, text]);

  const shuffle = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    const chars = text.split("");
    const n = chars.filter((c) => c !== " ").length;
    const settleTimes = chars.map((_, i) => {
      const k = chars.slice(0, i).filter((c) => c !== " ").length;
      return settleAt ? settleAt(k, n) : settleAfter + k * stagger;
    });
    const start = performance.now();
    const frame = () => {
      const elapsed = performance.now() - start;
      let done = true;
      const next = chars.map((ch, i) => {
        if (ch === " ") return " ";
        if (elapsed >= settleTimes[i]) return ch;
        done = false;
        return randomChar();
      });
      setLetters(next);
      if (done) {
        timer.current = null;
        return;
      }
      timer.current = window.setTimeout(frame, typeof tick === "function" ? tick(elapsed) : tick);
    };
    frame();
  }, [stop, text, tick, stagger, settleAfter, settleAt]);

  useEffect(() => stop, [stop]);

  return { letters, shuffle, stop, settle };
}
