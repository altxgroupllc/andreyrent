"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { savingVsDaily } from "@/lib/rental";
import { displayPolicy } from "@/content/display-policy";
import { path, vehiclePath, type Locale } from "@/content/routes";
import { withRental, type RentalState } from "@/components/booking/rental-state";
import { t, r, dur, easeOut, panelSpring } from "@/components/system/tokens";
import { PriceBlock } from "@/components/system/price-block";
import { Pressable } from "@/components/system/pressable";
import { VehicleGallery } from "./vehicle-gallery";
import { vehicleAttributes, AttributeRow } from "./vehicle-attributes";
import { isInstant, primaryCta } from "./availability";
import { displayName } from "./vehicle-name";

/**
 * The intermediate step between a list row and the full model page, so nothing is
 * chosen blind. Desktop: a 420px centred card. Mobile: a bottom sheet at ~60% height.
 * Both keep the list visible behind, dimmed — context is never lost.
 */
export function QuickPreview({
  vehicle, rental, locale, labels, onClose,
}: {
  vehicle: VehicleListItem;
  rental: RentalState;
  locale: Locale;
  labels: { quickView: string; choose: string; details: string; close: string; deposit: string; delivery: string };
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const q = quote(vehicle, rental.days);
  const save = savingVsDaily(vehicle, rental.days);
  const instant = isInstant(vehicle);

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: dur.control, ease: easeOut }}
      style={{ background: "rgba(17,17,17,0.28)" }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.99 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
        transition={panelSpring}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${displayName(vehicle)} — ${labels.quickView}`}
        className="w-full rounded-t-[20px] sm:max-w-[420px] sm:rounded-[20px]"
        style={{ background: t.surface, boxShadow: "0 8px 48px rgba(17,17,17,.2)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto mt-2 h-1 w-9 sm:hidden" style={{ background: t.borderStrong, borderRadius: 999 }} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-600 leading-[1.25]">{displayName(vehicle)}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <AttributeRow items={vehicleAttributes(vehicle, 3)} responsive={false} />
              </div>
            </div>
            <Pressable
              onClick={onClose}
              ariaLabel={labels.close}
              className="grid h-8 w-8 shrink-0 place-items-center text-[14px]"
              style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.text }}
            >
              ✕
            </Pressable>
          </div>

          <div className="mt-3">
            <VehicleGallery vehicle={vehicle} />
          </div>

          {!instant && (
            <p className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: t.muted }}>
              {displayPolicy.nonInstantAvailability.copy}
            </p>
          )}

          <div className="mt-3.5 flex items-end justify-between gap-4">
            <PriceBlock
              perDay={q?.perDay ?? 0}
              total={q?.total ?? 0}
              days={rental.days}
              savingPct={save?.pct ?? null}
              size="hero"
              align="left"
            />
            <div className="text-right text-[12.5px]" style={{ color: t.muted }}>
              <div>{labels.deposit} {vehicle.depositLabel ?? "—"}</div>
              <div className="mt-0.5">
                {rental.zone === "office" ? "Самовывоз, 0 ฿" : labels.delivery}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <Link
              href={withRental(path.booking(vehicle.slug, locale), rental)}
              className="flex min-h-11 items-center justify-center px-4 py-3 text-center text-[14.5px] font-600"
              style={{ background: t.yellow, color: t.text, borderRadius: r.button }}
            >
              {primaryCta(vehicle, "Продолжить к бронированию")}
            </Link>
            <Link
              href={withRental(vehiclePath(vehicle.category, vehicle.slug, locale), rental)}
              className="flex min-h-11 items-center justify-center px-4 py-3 text-[14.5px] font-500"
              style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.button }}
            >
              {labels.details}
            </Link>
          </div>
          <button onClick={onClose} className="mt-3 w-full py-1 text-[12.5px] font-500" style={{ color: t.muted }}>
            Пока пропустить
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
