import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Shared step clock for the marketing product demos.
 *
 * - `cues` are the times (ms) at which the timeline advances to step 1, 2, ...
 *   Step 0 starts at t=0, the final step is `cues.length`.
 * - After `totalMs` the loop restarts (loopKey increments so callers can cross-fade).
 * - Runs only while >=35% in view, the tab is visible and the user hasn't paused.
 * - prefers-reduced-motion: pinned to the final ("story complete") frame, no timers.
 * - Mobile (<768px) uses `mobileCues` / `mobileTotalMs` (shorter loop) when given.
 * - On re-entry after >20 s off-screen the story replays from step 0.
 */
export interface DemoTimelineOptions {
  cues: number[];
  totalMs: number;
  mobileCues?: number[];
  mobileTotalMs?: number;
  /** viewport fraction required to start, default 0.35 */
  amount?: number;
}

const TICK_MS = 100;
const REPLAY_AFTER_MS = 20_000;

export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return isMobile;
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => (typeof document === "undefined" ? true : document.visibilityState === "visible"));
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

export function useDemoTimeline<T extends HTMLElement = HTMLDivElement>(options: DemoTimelineOptions) {
  const { amount = 0.35 } = options;
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const pageVisible = usePageVisible();
  const [paused, setPaused] = useState(false);

  const cues = isMobile && options.mobileCues ? options.mobileCues : options.cues;
  const totalMs = isMobile && options.mobileTotalMs ? options.mobileTotalMs : options.totalMs;
  const finalStep = cues.length;

  const [step, setStep] = useState(0);
  const [loopKey, setLoopKey] = useState(0);
  const elapsedRef = useRef(0);
  const leftAtRef = useRef<number | null>(null);
  const cuesRef = useRef(cues);
  cuesRef.current = cues;

  const playing = inView && pageVisible && !paused && !reduced;

  // Replay from the top when coming back after a long absence.
  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      leftAtRef.current = performance.now();
      return;
    }
    if (leftAtRef.current !== null && performance.now() - leftAtRef.current > REPLAY_AFTER_MS) {
      elapsedRef.current = 0;
      setStep(0);
      setLoopKey((k) => k + 1);
    }
    leftAtRef.current = null;
  }, [inView, reduced]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      elapsedRef.current += TICK_MS;
      if (elapsedRef.current >= totalMs) {
        elapsedRef.current = 0;
        setStep(0);
        setLoopKey((k) => k + 1);
        return;
      }
      const t = elapsedRef.current;
      const next = cuesRef.current.filter((cue) => cue <= t).length;
      setStep((current) => (current === next ? current : next));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, totalMs]);

  // Breakpoint switch: restart so cue sets stay consistent.
  useEffect(() => {
    elapsedRef.current = 0;
    setStep(0);
  }, [isMobile]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    ref,
    /** current step; pinned to the final frame under reduced motion */
    step: reduced ? finalStep : step,
    finalStep,
    loopKey,
    playing,
    paused,
    togglePause,
    reduced,
    isMobile,
    /** true once the timeline has started at least one beat (or is static) */
    at: (s: number) => (reduced ? true : step >= s),
  };
}

/** Count from 0 to `target` over `duration` ms once `active` turns true. Reduced motion => final value. */
export function useCountUp(target: number, active: boolean, { duration = 1200, from = 0, reduced = false } = {}) {
  const [value, setValue] = useState(reduced ? target : from);
  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!active) {
      setValue(from);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (target - from) * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, from, duration, reduced]);
  return value;
}

/** Reveal `text` word by word (msPerToken) once `active`. Reduced motion => full text. */
export function useStreamText(text: string, active: boolean, { msPerToken = 35, reduced = false } = {}) {
  const tokens = text.split(/(\s+)/);
  const [count, setCount] = useState(reduced ? tokens.length : 0);
  useEffect(() => {
    if (reduced) {
      setCount(tokens.length);
      return;
    }
    if (!active) {
      setCount(0);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= tokens.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, msPerToken);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, active, msPerToken, reduced]);
  return { text: tokens.slice(0, count).join(""), done: count >= tokens.length };
}

/** Shared easing / transitions from the motion spec. */
export const EASE_ENTER = [0.22, 1, 0.36, 1] as const;
export const T_ENTER = { duration: 0.5, ease: EASE_ENTER };
export const T_EXIT = { duration: 0.2, ease: "easeIn" as const };
export const T_LAYOUT = { type: "spring" as const, stiffness: 380, damping: 32 };
