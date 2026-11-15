"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide Lenis smooth scroll (requested for this site), off under prefers-reduced-motion.
 * Motion review (v3): the scroll-triggered card fades and vote-bar growth were removed; they hid or
 * delayed text and data the reader was about to read. Anchor links ("Skip to content", "Pick your state")
 * go through Lenis so they don't fight it, and keyboard and touch scrolling stay native.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 0.8, autoRaf: true, anchors: true, syncTouch: false });
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
}

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
