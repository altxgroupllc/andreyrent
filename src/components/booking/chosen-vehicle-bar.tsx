"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { path, vehiclePath, type Locale } from "@/content/routes";
import { t, r, panelSpring, days as pluralDays } from "@/components/system/tokens";
import { SmoothNumber } from "@/components/system/smooth-number";
import { PressableLink } from "@/components/system/pressable";
import { withRental, type RentalState } from "./rental-state";
import { displayName } from "@/components/vehicle/vehicle-name";

/** Persists the choice: model, total for the period, a way in and a way to write. */
export function ChosenVehicleBar({
  vehicle, rental, locale, labels,
}: {
  vehicle: VehicleListItem;
  rental: RentalState;
  locale: Locale;
  labels: { details: string; write: string };
}) {
  const reduce = useReducedMotion();
  const q = quote(vehicle, rental.days);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { y: 80 }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: 80 }}
      transition={panelSpring}
      className="fixed inset-x-0 bottom-0 z-40 lg:bottom-4 lg:left-auto lg:right-4 lg:w-[440px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3"
        style={{
          background: t.dark,
          color: "#FFFFFF",
          borderTopLeftRadius: r.container,
          borderTopRightRadius: r.container,
          boxShadow: "0 -2px 32px rgba(17,17,17,.24)",
        }}
      >
        <div className="relative h-10 w-[54px] shrink-0 overflow-hidden" style={{ background: "rgba(255,255,255,.08)", borderRadius: 10 }}>
          {vehicle.images[0] && <Image src={vehicle.images[0]} alt="" fill sizes="54px" className="object-contain p-0.5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-500">{displayName(vehicle)}</div>
          <div className="text-[12.5px]" style={{ color: "rgba(255,255,255,.62)" }}>
            <SmoothNumber value={q?.total ?? 0} /> ฿ за {rental.days} {pluralDays(rental.days)}
          </div>
        </div>
        <Link
          href={withRental(vehiclePath(vehicle.category, vehicle.slug, locale), rental)}
          className="shrink-0 px-3 py-2 text-[13px] font-500"
          style={{ background: "rgba(255,255,255,.12)", color: "#FFFFFF", borderRadius: r.button }}
        >
          {labels.details}
        </Link>
        <PressableLink
          href={withRental(path.booking(vehicle.slug, locale), rental)}
          className="flex shrink-0 items-center gap-1.5 px-3 py-2 text-[13px] font-600"
          style={{ background: t.yellow, color: t.text, borderRadius: r.button }}
        >
          <span>{labels.write}</span>
        </PressableLink>
      </div>
    </motion.div>
  );
}
