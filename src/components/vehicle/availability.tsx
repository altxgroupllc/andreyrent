import * as React from "react";
import type { VehicleListItem } from "@/content/vehicle-list";
import { displayPolicy } from "@/content/display-policy";
import { Chip } from "@/components/system/surfaces";

/**
 * C-13: the live site marks four vehicles «Под заказ» and never defines it.
 * We treat it as non-instant availability, invent no lead time, and change the
 * call to action rather than the promise.
 */
export const isInstant = (v: Pick<VehicleListItem, "available">) => v.available;

export function AvailabilityChip({ vehicle }: { vehicle: Pick<VehicleListItem, "available"> }) {
  if (isInstant(vehicle)) return null;
  return <Chip className="shrink-0">{displayPolicy.nonInstantAvailability.label}</Chip>;
}

export const primaryCta = (v: Pick<VehicleListItem, "available">, fallback: string) =>
  isInstant(v) ? fallback : displayPolicy.nonInstantAvailability.cta;
