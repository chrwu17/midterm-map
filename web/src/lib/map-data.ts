import { STATES } from "./states";
import { getAllRaces } from "./races";
import type { MapState, MapKind } from "@/components/us-map";

export function raceLabel(office: "senate" | "governor", special: boolean) {
  return office === "senate" ? (special ? "U.S. Senate (special)" : "U.S. Senate") : "Governor";
}

export function getMapStates(): MapState[] {
  const races = getAllRaces();
  return STATES.map((s) => {
    const mine = races.filter((r) => r.state === s.code);
    const senate = s.senate2026 || mine.some((r) => r.office === "senate");
    const gov = s.governor2026 || mine.some((r) => r.office === "governor");
    const kind: MapKind = senate && gov ? "both" : senate ? "senate" : gov ? "governor" : "none";
    const labels: string[] = [];
    if (mine.length) {
      [...mine]
        .sort((a, b) => (a.office === b.office ? 0 : a.office === "senate" ? -1 : 1))
        .forEach((r) => labels.push(raceLabel(r.office, r.special)));
    } else {
      if (senate) labels.push(s.code === "OH" || s.code === "FL" ? "U.S. Senate (special)" : "U.S. Senate");
      if (gov) labels.push("Governor");
    }
    return { code: s.code, name: s.name, kind, races: labels };
  });
}
