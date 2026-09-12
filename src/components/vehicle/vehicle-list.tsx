"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { VehicleListItem } from "@/content/vehicle-list";
import { t, r } from "@/components/system/tokens";
import { VehicleRow } from "./vehicle-row";

/**
 * Filtering preserves spatial continuity: surviving rows travel to their new positions,
 * removed rows fade at 0.985 scale. Never a hard re-render of the list.
 */
export function VehicleList({
  vehicles, days, selectedSlug, onOpen, emptyTitle, emptyHint, id = "results",
}: {
  vehicles: VehicleListItem[];
  days: number;
  selectedSlug?: string | null;
  onOpen: (v: VehicleListItem) => void;
  emptyTitle: string;
  emptyHint: string;
  id?: string;
}) {
  if (vehicles.length === 0) {
    return (
      <div
        className="mt-4 px-5 py-8 text-center text-[14px]"
        style={{ background: t.surface, border: `1px dashed ${t.borderStrong}`, borderRadius: r.card, color: t.muted }}
      >
        {emptyTitle}
        <br />
        {emptyHint}
      </div>
    );
  }

  return (
    <LayoutGroup id={id}>
      <motion.div layout className="mt-3 grid gap-2 xl:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {vehicles.map((v, i) => (
            <VehicleRow
              key={v.slug}
              vehicle={v}
              days={days}
              selected={selectedSlug === v.slug}
              eager={i < 4}
              onOpen={onOpen}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
