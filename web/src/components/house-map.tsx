"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { HouseMapView } from "@/lib/house";

export interface HouseMapDistrict {
  id: string; // also the id of the district's card in the list
  district: string;
  title: string; // "District 5"
  result: string; // "Jane Doe, projected winner"
}

const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

function Drawing({ view, views, stateName, byDistrict, active, tabStop, onActive, onGo, onStep }: {
  view: HouseMapView;
  views: HouseMapView[];
  stateName: string;
  byDistrict: Map<string, HouseMapDistrict>;
  active: string | null;
  tabStop: string;
  onActive: (district: string | null) => void;
  onGo: (district: string) => void;
  onStep: (key: string, from: string) => void;
}) {
  const main = view.letter === null;
  const frames = views.filter((v) => v.box && v.parent === view.letter);
  const pad = 3;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${view.width + pad * 2} ${view.height + pad * 2}`}
      className={`mx-auto block h-auto max-h-[440px] w-full ${main ? "sm:max-h-[560px]" : "rounded-md border border-border"}`}
      role={main ? "group" : undefined}
      // Close-ups repeat districts already reachable on the whole-state map, so only that one is announced.
      aria-hidden={main ? undefined : true}
      aria-label={main ? `Map of ${stateName}'s U.S. House districts. Arrow keys move between districts in number order. Enter goes to the result.` : undefined}
      onMouseLeave={() => onActive(null)}
    >
      {view.districts.map((s) => {
        const info = byDistrict.get(s.district);
        if (!info) return null;
        const on = active === s.district;
        const shape = (
          <path
            d={s.d}
            fillRule="evenodd"
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer transition-[fill] duration-150 motion-reduce:transition-none"
            style={{ fill: on ? "var(--map-senate)" : "var(--map-none)", stroke: "var(--ink-muted)", strokeWidth: 1.25, strokeLinejoin: "round" }}
            onMouseEnter={() => onActive(s.district)}
          />
        );
        if (!main) return <g key={s.district} onClick={() => onGo(s.district)}>{shape}</g>;
        return (
          <a
            key={s.district}
            href={`#${info.id}`}
            data-district={s.district}
            tabIndex={s.district === tabStop ? 0 : -1}
            aria-label={`${info.title}: ${info.result}`}
            className="outline-none"
            onFocus={() => onActive(s.district)}
            onBlur={() => onActive(null)}
            onClick={(e) => {
              e.preventDefault();
              onGo(s.district);
            }}
            onKeyDown={(e) => {
              if (e.key in ARROWS || e.key === "Home" || e.key === "End") {
                e.preventDefault();
                onStep(e.key, s.district);
              }
            }}
          >
            {shape}
          </a>
        );
      })}
      <g className="pointer-events-none" aria-hidden="true">
        {/* Drawn last so no neighbor covers the outline of the district in hand. */}
        {view.districts.filter((s) => s.district === active).map((s) => (
          <path key={s.district} d={s.d} fill="none" vectorEffect="non-scaling-stroke" style={{ stroke: "var(--ink)", strokeWidth: 3, strokeLinejoin: "round" }} />
        ))}
        {frames.map((f) => {
          // Frames can reach past the state's edge, for example over the sea; keep the outline in the drawing.
          const [x, y] = [Math.max(0, f.box![0]), Math.max(0, f.box![1])];
          const w = Math.min(view.width, f.box![0] + f.box![2]) - x, h = Math.min(view.height, f.box![1] + f.box![3]) - y;
          // Letters sit on the frame's corner, pulled back inside the drawing.
          const lx = Math.max(6, x), ly = Math.max(6, y);
          return (
            <g key={f.letter}>
              <rect x={x} y={y} width={w} height={h} fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="4 3" style={{ stroke: "var(--ink)", strokeWidth: 1.5 }} />
              <circle cx={lx} cy={ly} r={6} style={{ fill: "var(--ink)" }} />
              <text x={lx} y={ly} dy="0.35em" textAnchor="middle" className="text-[8px] font-bold" style={{ fill: "var(--surface)" }}>{f.letter}</text>
            </g>
          );
        })}
        {view.districts.filter((s) => s.label).map((s) => (
          <text
            key={s.district}
            x={s.x}
            y={s.y}
            dy="0.35em"
            textAnchor="middle"
            className={`font-semibold tabular-nums ${s.district.length > 2 ? "text-[12px]" : main ? "text-[10px] sm:text-[9px]" : "text-[10px]"}`}
            style={{ fill: "var(--ink)", stroke: active === s.district ? "var(--map-senate)" : "var(--map-none)", strokeWidth: 2, strokeLinejoin: "round", paintOrder: "stroke" }}
          >
            {s.district === "AL" ? "At-large" : s.district}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** The district map (when there is one) above the list of results. Each control leads to a card in that list. */
export function HouseDistricts({ views, districts, stateName, children }: {
  views: HouseMapView[] | null;
  districts: HouseMapDistrict[];
  stateName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [tabStop, setTabStop] = useState(districts[0].district);
  const [pick, setPick] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selectId = useId();
  const byDistrict = new Map(districts.map((d) => [d.district, d]));
  const single = districts.length === 1;

  // Opens the list, waits for the panel to finish growing, then moves focus to the card.
  const reveal = (id: string) => {
    setOpen(["districts"]);
    let lastHeight = -1, still = 0, frames = 0;
    const step = () => {
      const card = document.getElementById(id);
      const height = document.documentElement.scrollHeight;
      still = card && height === lastHeight ? still + 1 : 0;
      lastHeight = height;
      if (still < 4 && ++frames < 90) return requestAnimationFrame(step);
      if (!card) return;
      card.focus({ preventScroll: true });
      const nav = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      window.scrollTo({ top: window.scrollY + card.getBoundingClientRect().top - nav - 24, behavior: "instant" });
    };
    requestAnimationFrame(step);
  };
  const go = (district: string) => {
    const d = byDistrict.get(district);
    if (!d) return;
    setTabStop(district);
    reveal(d.id);
  };
  const onStep = (key: string, from: string) => {
    const i = districts.findIndex((d) => d.district === from);
    const n = districts.length;
    const to = districts[key === "Home" ? 0 : key === "End" ? n - 1 : (i + ARROWS[key] + n) % n].district;
    setTabStop(to);
    rootRef.current?.querySelector<SVGElement>(`a[data-district="${to}"]`)?.focus({ preventScroll: true });
  };

  // A link straight to a district (".../state/ca/#CA-12") opens the list too.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!districts.some((d) => d.id === id)) return;
    const raf = requestAnimationFrame(() => reveal(id));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only for the address the page was opened with
  }, []);

  const shown = active ? byDistrict.get(active) : undefined;
  const drawing = (view: HouseMapView) => (
    <Drawing view={view} views={views!} stateName={stateName} byDistrict={byDistrict} active={active} tabStop={tabStop} onActive={setActive} onGo={go} onStep={onStep} />
  );
  const insets = views?.slice(1) ?? [];

  return (
    <div ref={rootRef}>
      {views ? (
        <div className="mt-6">
          <p className="max-w-[65ch] text-sm text-muted-foreground">
            {single
              ? "Select the map to go to the result."
              : "Select a district to go to its result. Colors do not show party or who won."}
            {insets.length > 0 && ` ${insets.length === 1 ? "The dashed frame is" : "Dashed frames are"} enlarged in the ${insets.length === 1 ? "close-up" : "close-ups with the same letter"}.`}
          </p>
          <div className={`mt-4 grid items-start gap-x-8 gap-y-6 ${insets.length > 1 ? "lg:grid-cols-[2fr_4fr]" : insets.length ? "lg:grid-cols-2" : ""}`}>
            <div className={single ? "mx-auto w-full max-w-[420px]" : "w-full"}>
              {drawing(views[0])}
              <p className="mt-2 min-h-[2.5rem] text-center text-sm" aria-hidden="true">
                {shown && !single && <><span className="font-semibold">{shown.title}</span>: {shown.result}</>}
              </p>
            </div>
            {insets.length > 0 && (
              <div className={`grid gap-5 ${insets.length > 1 ? "md:grid-cols-2" : "max-w-[460px]"}`}>
                {insets.map((v) => (
                  <figure key={v.letter}>
                    <figcaption className="mb-1.5 text-sm font-semibold">
                      Close-up {v.letter}
                      {v.parent && <span className="font-normal text-muted-foreground"> (inside {v.parent})</span>}
                    </figcaption>
                    {drawing(v)}
                  </figure>
                ))}
              </div>
            )}
          </div>
          {!single && (
            <form
              className="mt-4 flex flex-wrap items-center gap-2 text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                if (pick) go(pick);
              }}
            >
              <label htmlFor={selectId} className="font-medium">Pick a district</label>
              <select id={selectId} className="min-h-11 rounded-md border border-border bg-card px-3 text-base" value={pick} onChange={(e) => setPick(e.target.value)}>
                <option value="" disabled>Choose…</option>
                {districts.map((d) => <option key={d.id} value={d.district}>{d.title}</option>)}
              </select>
              <button type="submit" className="press min-h-11 rounded-md border border-border bg-card px-4 font-medium hover:bg-secondary">Go to result</button>
            </form>
          )}
        </div>
      ) : (
        <p className="mt-6 max-w-[65ch] text-sm text-muted-foreground">
          We could not confirm {stateName}&apos;s 2026 district lines, so there is no map. The list below has every result.
        </p>
      )}
      {single ? (
        <div className="mt-6">{children}</div>
      ) : (
        <Accordion className="mt-5 border-t border-border" value={open} onValueChange={(v) => setOpen(v as string[])}>
          <AccordionItem value="districts">
            <AccordionTrigger className="text-base font-semibold">See all {districts.length} districts</AccordionTrigger>
            {/* Kept in the page while closed, so district links have a target and the browser's find works. */}
            <AccordionContent hiddenUntilFound>
              <div className="pt-2">{children}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
