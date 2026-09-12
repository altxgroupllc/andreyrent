import { isSegment, type SegmentId } from "@/content/segments";
import { deliveryZones } from "@/content/locations";

/**
 * Canonical rental selection state lives in the URL, not in a provider.
 *
 *   /ru/bikes?days=7&need=city&zone=office
 *
 * Server components read it from searchParams for SEO-correct rendering; the client
 * island derives from the same values and writes back with replaceState-style navigation.
 * Nothing else is allowed to own this state.
 */
export interface RentalState {
  days: number;
  need: SegmentId;
  zone: string;
}

export const OFFICE_ZONE = "office";

export const DEFAULT_RENTAL: RentalState = { days: 7, need: "cheap", zone: OFFICE_ZONE };

export const MIN_DAYS = 1;
export const MAX_DAYS = 120;

/** Zone ids are stable slugs; labels come from the content layer. */
export function zoneIdOf(zoneName: string) {
  return deliveryZones.findIndex((z) => z.zone === zoneName) >= 0
    ? `z${deliveryZones.findIndex((z) => z.zone === zoneName)}`
    : OFFICE_ZONE;
}

export function zoneNameOf(id: string): string | null {
  if (id === OFFICE_ZONE) return null;
  const i = Number(id.replace(/^z/, ""));
  return Number.isInteger(i) && deliveryZones[i] ? deliveryZones[i].zone : null;
}

export const zoneOptions = [
  { id: OFFICE_ZONE, label: "Забрать в офисе" },
  ...deliveryZones.map((z, i) => ({ id: `z${i}`, label: z.zone })),
];

type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Parse and clamp. Any malformed parameter falls back to the default, never throws. */
export function parseRental(sp: Raw | URLSearchParams | undefined): RentalState {
  const get = (k: string) =>
    sp instanceof URLSearchParams ? sp.get(k) ?? undefined : one((sp ?? {})[k]);

  const rawDays = Number(get("days"));
  const days = Number.isFinite(rawDays) ? Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(rawDays))) : DEFAULT_RENTAL.days;

  const rawNeed = get("need") ?? "";
  const need: SegmentId = isSegment(rawNeed) ? rawNeed : DEFAULT_RENTAL.need;

  const rawZone = get("zone") ?? OFFICE_ZONE;
  const zone = rawZone === OFFICE_ZONE || zoneNameOf(rawZone) ? rawZone : OFFICE_ZONE;

  return { days, need, zone };
}

/** Serialise, omitting defaults so canonical URLs stay clean for search engines. */
export function rentalToParams(s: RentalState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.days !== DEFAULT_RENTAL.days) p.set("days", String(s.days));
  if (s.need !== DEFAULT_RENTAL.need) p.set("need", s.need);
  if (s.zone !== DEFAULT_RENTAL.zone) p.set("zone", s.zone);
  return p;
}

export function withRental(pathname: string, s: RentalState): string {
  const q = rentalToParams(s).toString();
  return q ? `${pathname}?${q}` : pathname;
}
