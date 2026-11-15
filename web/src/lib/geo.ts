import { geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import atlas from "us-atlas/states-albers-10m.json";
import { STATE_BY_FIPS } from "./states";

export interface StateShape {
  code: string;
  name: string;
  d: string;
}

/** Precompute SVG paths at build time (Albers-projected already, 975x610 viewBox). */
export function getStateShapes(): StateShape[] {
  const topo = atlas as unknown as Topology<{ states: GeometryCollection<{ name: string }> }>;
  const fc = feature(topo, topo.objects.states);
  const path = geoPath(null);
  return fc.features.flatMap((f) => {
    const info = STATE_BY_FIPS.get(String(f.id).padStart(2, "0"));
    const d = path(f);
    if (!info || !d) return [];
    return [{ code: info.code, name: info.name, d }];
  });
}
