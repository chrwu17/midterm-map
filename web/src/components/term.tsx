"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GlossSegment } from "@/lib/glossary";

const MORE_HREF = "/learn/political-terms/";

/**
 * A glossary word with a small definition popover.
 * Opens on hover (mouse), keyboard focus, or tap; Escape, tapping elsewhere, or moving focus away closes it.
 */
export function Term({ text, term, definition }: { text: string; term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pointerDown = useRef(false);
  const hoverOpened = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        if (wrapRef.current?.contains(document.activeElement)) btnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Keep the popover inside the viewport (16px gutter) on narrow screens.
  useLayoutEffect(() => {
    if (!open || !popRef.current) return;
    const r = popRef.current.getBoundingClientRect();
    const over = r.right - shift - (window.innerWidth - 16);
    setShift(over > 0 ? -over : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <span
      ref={wrapRef}
      className="relative inline"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(closeTimer.current);
        if (!open) hoverOpened.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse" || !hoverOpened.current) return;
        closeTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        type="button"
        className="term-trigger"
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={() => (pointerDown.current = true)}
        onFocus={() => {
          // Keyboard focus opens it; a click or tap is handled by onClick instead.
          if (!pointerDown.current) setOpen(true);
          pointerDown.current = false;
        }}
        onClick={() => {
          if (hoverOpened.current) {
            hoverOpened.current = false;
            setOpen(true);
          } else setOpen((o) => !o);
        }}
      >
        {text}
        <span className="sr-only"> (definition)</span>
      </button>
      <span
        ref={popRef}
        id={id}
        role="group"
        aria-label={`What "${term}" means`}
        hidden={!open}
        className="term-pop"
        style={shift ? { transform: `translateX(${shift}px)` } : undefined}
      >
        <span className="block font-semibold text-foreground">{term}</span>
        <span className="mt-1 block">{definition}</span>
        <Link href={MORE_HREF} className="mt-2 inline-block font-medium text-primary underline">
          More terms
        </Link>
      </span>
    </span>
  );
}

/** Render glossed text: plain strings stay as text, hits become Term popovers. */
export function Glossed({ segments }: { segments: GlossSegment[] }) {
  return (
    <>
      {segments.map((s, i) => (typeof s === "string" ? s : <Term key={i} {...s} />))}
    </>
  );
}
