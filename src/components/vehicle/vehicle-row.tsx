"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { savingVsDaily } from "@/lib/rental";
import { t, r, dur, easeOut } from "@/components/system/tokens";
import { RowPrice, RowRate } from "@/components/system/price-block";
import { NoPhoto } from "./no-photo";
import { vehicleAttributes, AttributeRow } from "./vehicle-attributes";
import { AvailabilityChip, isInstant } from "./availability";
import { displayName } from "./vehicle-name";

/**
 * The approved C3 row: two aligned baselines.
 *   title ── total
 *   attributes ── daily rate
 *
 * This is what keeps a long model name readable at 390px; a three-column layout
 * lets the price block starve the name. Image is 84x63 on a phone, 96x72 above.
 */
export function VehicleRow({
  vehicle, days, selected = false, eager = false, onOpen,
}: {
  vehicle: VehicleListItem;
  days: number;
  selected?: boolean;
  eager?: boolean;
  onOpen: (v: VehicleListItem) => void;
}) {
  const q = quote(vehicle, days);
  const save = savingVsDaily(vehicle, days);
  const reduce = useReducedMotion();
  const instant = isInstant(vehicle);

  return (
    <motion.button
      layout
      onClick={() => onOpen(vehicle)}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: dur.card, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      aria-pressed={selected}
      className="group relative flex w-full items-center gap-3 overflow-hidden p-3 text-left"
      style={{
        background: t.surface,
        border: `1px solid ${selected ? t.borderSelected : t.border}`,
        borderRadius: r.card,
        boxShadow: selected ? "0 1px 3px rgba(17,17,17,.07)" : "none",
        transition: `border-color ${dur.control}s, box-shadow ${dur.control}s`,
      }}
    >
      {/* selection is a yellow edge, never a yellow surface */}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { scaleY: 0 }}
            animate={reduce ? { opacity: 1 } : { scaleY: 1 }}
            exit={reduce ? { opacity: 0 } : { scaleY: 0 }}
            transition={{ duration: dur.control, ease: easeOut }}
            className="absolute left-0 top-0 h-full w-[3px] origin-center"
            style={{ background: t.yellow }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div
        className="relative h-[63px] w-[84px] shrink-0 overflow-hidden sm:h-[72px] sm:w-[96px]"
        style={{ background: t.plate, borderRadius: r.control }}
      >
        {vehicle.images[0] ? (
          <Image
            src={vehicle.images[0]}
            alt=""
            fill
            priority={eager}
            sizes="(max-width:640px) 84px, 96px"
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <NoPhoto tone="light" label="" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span
            className="min-w-0 flex-1 text-[15px] font-500 leading-[1.25]"
            style={{
              color: t.text,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {displayName(vehicle)}
          </span>
          <RowPrice total={q?.total ?? 0} />
        </div>

        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-x-2 overflow-hidden">
            {/* availability outranks specs — it takes the chip slot and attributes shorten */}
            <AvailabilityChip vehicle={vehicle} />
            <AttributeRow items={vehicleAttributes(vehicle, instant ? 2 : 1)} />
          </div>
          <RowRate perDay={q?.perDay ?? 0} savingPct={save?.pct ?? null} />
        </div>
      </div>
    </motion.button>
  );
}
