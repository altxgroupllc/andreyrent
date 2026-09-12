import { vehicles, type PriceLadder, type Vehicle, type VehicleCategory, type VehicleSegment } from "./vehicles";

/**
 * Slim projection for client islands.
 *
 * `vehicles.ts` carries specs, pros/cons, verdicts and SEO copy — roughly 150 KB that a
 * catalogue list never reads. The interactive surfaces import this instead, so the client
 * bundle stays proportional to the interaction. Detail pages use the full record on the server.
 */
export interface VehicleListItem {
  slug: string;
  name: string;
  category: VehicleCategory;
  segment: VehicleSegment;
  engineCc: number | null;
  keyless: boolean;
  abs: boolean;
  isNew: boolean;
  available: boolean;
  availabilityLabel: string | null;
  prices: PriceLadder;
  depositLabel: string | null;
  images: string[];
}

export const toListItem = (v: Vehicle): VehicleListItem => ({
  slug: v.slug,
  name: v.name,
  category: v.category,
  segment: v.segment,
  engineCc: v.engineCc,
  keyless: v.keyless,
  abs: v.abs,
  isNew: v.isNew,
  available: v.available,
  availabilityLabel: v.availabilityLabel,
  prices: v.prices,
  depositLabel: v.depositLabel,
  images: v.images.slice(0, 5),
});

export const vehicleList: VehicleListItem[] = vehicles.map(toListItem);

export const listByCategory = (c: VehicleCategory) => vehicleList.filter((v) => v.category === c);
