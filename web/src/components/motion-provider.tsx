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
    // Lenis caches the page height. Accordions, popovers, web fonts and client-side route changes all
    // change it after load, and a stale value stops the scroll short of the real bottom. Re-measure
    // whenever the document's size changes.
    const resize = () => lenis.resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    observer.observe(document.documentElement);
    const mutations = new MutationObserver(resize);
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state", "open", "hidden", "style"] });
    window.addEventListener("load", resize);
    document.fonts?.ready.then(resize);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("load", resize);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
