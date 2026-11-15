"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import type { StateShape } from "@/lib/geo";

export type MapKind = "senate" | "governor" | "both" | "none";

export interface MapState {
  code: string;
  name: string;
  kind: MapKind;
  races: string[]; // human labels, e.g. "U.S. Senate", "Governor"
}

// Northeastern states too small to tap reliably on the map.
const SMALL_STATES = ["VT", "NH", "MA", "RI", "CT", "NJ", "DE", "MD"];

const KIND_LABEL: Record<MapKind, string> = {
  senate: "Senate race",
  governor: "Governor race",
  both: "Senate and governor",
  none: "Neither on the ballot",
};

export function UsMap({ shapes, states }: { shapes: StateShape[]; states: MapState[] }) {
  const router = useRouter();
  const byCode = new Map(states.map((s) => [s.code, s]));
  const [active, setActive] = useState<{ code: string; x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // One-time entrance: states settle in from 96% scale with a short stagger (~550ms total).
  // Server HTML is the final state; pointer events are never blocked; skipped under reduced motion.
  useEffect(() => {
    if (!svgRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".state-path", {
        opacity: 0, scale: 0.96, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.out",
        stagger: { each: 0.005, from: "start" }, clearProps: "opacity,transform,transformOrigin",
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  const go = (code: string) => router.push(`/state/${code.toLowerCase()}/`);

  const showAt = (code: string, el: Element, evt?: { clientX: number; clientY: number }) => {
    const wrap = wrapRef.current?.getBoundingClientRect();
    if (!wrap) return;
    if (evt) {
      setActive({ code, x: evt.clientX - wrap.left, y: evt.clientY - wrap.top });
    } else {
      const r = el.getBoundingClientRect();
      setActive({ code, x: r.left + r.width / 2 - wrap.left, y: r.top + r.height / 2 - wrap.top });
    }
  };

  const activeState = active ? byCode.get(active.code) : undefined;

  return (
    <div>
      <div ref={wrapRef} className="relative">
        <svg
          ref={svgRef}
          viewBox="0 0 975 610"
          className="us-map h-auto w-full"
          role="group"
          aria-label="Map of U.S. states. Use Tab to move between states and Enter to open one."
          onMouseLeave={() => setActive(null)}
        >
          {shapes.map((s) => {
            const st = byCode.get(s.code);
            const kind = st?.kind ?? "none";
            return (
              <path
                key={s.code}
                d={s.d}
                className="state-path"
                data-kind={kind}
                data-active={active?.code === s.code}
                tabIndex={0}
                role="link"
                aria-label={`${s.name}: ${KIND_LABEL[kind]}`}
                onMouseMove={(e) => showAt(s.code, e.currentTarget, e)}
                onFocus={(e) => showAt(s.code, e.currentTarget)}
                onBlur={() => setActive(null)}
                onClick={() => go(s.code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    go(s.code);
                  }
                }}
              />
            );
          })}
        </svg>
        {active && activeState && (
          <div
            className="map-tip pointer-events-none absolute left-0 top-0 z-10 w-max max-w-[220px] rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md"
            style={{ transform: `translate3d(${Math.round(active.x)}px, ${Math.round(active.y - 12)}px, 0) translate(-50%, -100%)` }}
            role="status"
          >
            <div className="font-semibold">{activeState.name}</div>
            <div className="text-muted-foreground">
              {activeState.races.length ? activeState.races.join(" · ") : "No Senate or governor race"}
            </div>
          </div>
        )}
        <ul className="mt-2 flex flex-wrap justify-end gap-1.5" aria-label="Small states">
          {SMALL_STATES.map((code) => {
            const st = byCode.get(code);
            const kind = st?.kind ?? "none";
            return (
              <li key={code}>
                <button
                  type="button"
                  className="small-state press"
                  data-kind={kind}
                  data-active={active?.code === code}
                  aria-label={`${st?.name ?? code}: ${KIND_LABEL[kind]}`}
                  onMouseEnter={(e) => showAt(code, e.currentTarget)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={(e) => showAt(code, e.currentTarget)}
                  onBlur={() => setActive(null)}
                  onClick={() => go(code)}
                >
                  <span className="small-state-swatch" aria-hidden="true" />
                  {code}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Map legend">
          {(["both", "senate", "governor", "none"] as MapKind[]).map((k) => (
            <li key={k} className="flex items-center gap-2">
              <svg width="14" height="14" aria-hidden="true">
                <rect width="14" height="14" rx="3" className="state-path" data-kind={k} style={{ cursor: "default" }} />
              </svg>
              {KIND_LABEL[k]}
            </li>
          ))}
        </ul>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">Pick a state</span>
          <select
            className="press rounded-md border border-border bg-card px-3 py-2 text-base"
            defaultValue=""
            onChange={(e) => e.target.value && go(e.target.value)}
          >
            <option value="" disabled>Choose…</option>
            {[...states].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
