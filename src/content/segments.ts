import type { VehicleListItem } from "./vehicle-list";

/**
 * Scenario segments for the intent-first chooser.
 *
 * ⚠️ NEEDS_OWNER_CONFIRMATION — these thresholds are a PRODUCT/EDITORIAL rule invented
 * during design, not verified business policy. The live site does not categorise its fleet
 * this way. They actively steer what a customer is shown, so Andrei must confirm or replace
 * them before launch.
 *
 * Everything that depends on a threshold reads it from here. Do not inline these numbers.
 */
export const SEGMENT_THRESHOLDS = {
  /** "По городу" — small commuter scooters. */
  cityMaxCc: 125,
  /** "Вдвоём" — comfortable two-up. NEEDS_OWNER_CONFIRMATION. */
  coupleMinCc: 150,
  /** "Подальше" — out-of-town / highway. NEEDS_OWNER_CONFIRMATION. */
  distanceMinCc: 300,
  confirmed: false,
} as const;

export type SegmentId = "cheap" | "city" | "couple" | "distance";

export interface Segment {
  id: SegmentId;
  label: string;
  hint: string;
  /** Human-readable basis, surfaced in code review and future owner confirmation. */
  basis: string;
}

export const segments: Segment[] = [
  { id: "cheap", label: "Подешевле", hint: "самый дешёвый день", basis: "sorted by price for the chosen duration" },
  { id: "city", label: "По городу", hint: `до ${SEGMENT_THRESHOLDS.cityMaxCc} см³`, basis: "engineCc <= cityMaxCc" },
  { id: "couple", label: "Вдвоём", hint: `от ${SEGMENT_THRESHOLDS.coupleMinCc} см³`, basis: "engineCc >= coupleMinCc — NEEDS_OWNER_CONFIRMATION" },
  { id: "distance", label: "Подальше", hint: `от ${SEGMENT_THRESHOLDS.distanceMinCc} см³`, basis: "engineCc >= distanceMinCc — NEEDS_OWNER_CONFIRMATION" },
];

export const isSegment = (x: string): x is SegmentId => segments.some((s) => s.id === x);

export function matchesSegment(v: Pick<VehicleListItem, "engineCc">, id: SegmentId): boolean {
  const cc = v.engineCc ?? 0;
  if (id === "city") return cc > 0 && cc <= SEGMENT_THRESHOLDS.cityMaxCc;
  if (id === "couple") return cc >= SEGMENT_THRESHOLDS.coupleMinCc;
  if (id === "distance") return cc >= SEGMENT_THRESHOLDS.distanceMinCc;
  return true;
}
