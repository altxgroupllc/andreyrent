import type { VehicleListItem } from "@/content/vehicle-list";
import { displayPolicy } from "@/content/display-policy";

/**
 * C-07: the bicycle is «Trinx M600» in its own <h1> and booking dropdown but
 * «Trinx M007» in the price table, and the slug/images say m007. Until Andrei
 * confirms, we print the brand without the disputed model number.
 */
export function displayName(v: Pick<VehicleListItem, "category" | "name">): string {
  if (v.category === "bicycle") return displayPolicy.bicycleNaming.displayName;
  return v.name;
}
