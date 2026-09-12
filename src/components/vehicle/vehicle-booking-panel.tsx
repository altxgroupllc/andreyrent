"use client";

import * as React from "react";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { savingVsDaily } from "@/lib/rental";
import { displayPolicy } from "@/content/display-policy";
import { t, r, days as pluralDays } from "@/components/system/tokens";
import { Card } from "@/components/system/surfaces";
import { PriceBlock } from "@/components/system/price-block";
import { DurationStepper } from "@/components/system/duration-stepper";
import { SmoothNumber } from "@/components/system/smooth-number";
import { Pressable, PressableLink } from "@/components/system/pressable";
import { useRental } from "@/components/booking/use-rental";
import { OFFICE_ZONE } from "@/components/booking/rental-state";
import { path } from "@/content/routes";
import { withRental } from "@/components/booking/rental-state";
import { isInstant, primaryCta } from "./availability";
import type { Dictionary } from "@/content/i18n";

/**
 * The booking panel on a model page. Duration lives in the URL, so arriving here from
 * the catalogue keeps the срок the customer already chose.
 *
 * The primary action opens the browser-only booking prototype. The final request is
 * still confirmed with an operator; no payment or passport data is sent from this UI.
 */
export function VehicleBookingPanel({ vehicle, dict }: { vehicle: VehicleListItem; dict: Dictionary }) {
  const [rental, setRental] = useRental();
  const q = quote(vehicle, rental.days);
  const save = savingVsDaily(vehicle, rental.days);
  const instant = isInstant(vehicle);

  return (
    <>
    <Card className="p-4">
      <DurationStepper
        days={rental.days}
        onChange={(n) => setRental({ days: n })}
        labels={dict.duration}
        groupId="detail"
      />

      <div className="mt-4">
        <PriceBlock
          perDay={q?.perDay ?? 0}
          total={q?.total ?? 0}
          days={rental.days}
          savingPct={save?.pct ?? null}
          size="hero"
          align="left"
        />
      </div>

      <dl className="mt-3.5 space-y-2 text-[13.5px]">
        <div className="flex items-baseline justify-between gap-4">
          <dt style={{ color: t.muted }}>{dict.vehicle.delivery}</dt>
          <dd className="text-right font-500">
            {/* C-04: zone prices disputed across three sources — never printed */}
            {rental.zone === OFFICE_ZONE ? "0 ฿ (офис)" : "по району"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt style={{ color: t.muted }}>{dict.vehicle.depositReturnable}</dt>
          <dd className="tnum font-500">{vehicle.depositLabel ?? "—"}</dd>
        </div>
        <div
          className="flex items-baseline justify-between gap-4 border-t pt-2.5 text-[16px] font-600"
          style={{ borderColor: t.border }}
        >
          <dt>{dict.vehicle.rentalFor} {rental.days} {pluralDays(rental.days)}</dt>
          <dd className="flex items-baseline gap-1">
            <SmoothNumber value={q?.total ?? 0} />
            <span>฿</span>
          </dd>
        </div>
      </dl>

      {!instant && (
        <p className="mt-3 text-[12.5px] leading-[1.5]" style={{ color: t.muted }}>
          {displayPolicy.nonInstantAvailability.copy}
        </p>
      )}

      <PressableLink
        href={withRental(path.booking(vehicle.slug), rental)}
        className="mt-4 flex items-center justify-center gap-2 py-3 text-[14.5px] font-600"
        style={{ background: t.yellow, color: t.text, borderRadius: r.button }}
      >
        {primaryCta(vehicle, dict.vehicle.book)}
      </PressableLink>

      <p className="mt-2 text-center text-[11.5px]" style={{ color: t.faint }}>
        Пройдёте заявку по шагам, затем сможете написать оператору в WhatsApp.
      </p>
    </Card>
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pt-2 lg:hidden" style={{ background: "linear-gradient(transparent, rgba(245,245,243,.96) 28%)", paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-[640px] items-center gap-2 p-2" style={{ background: t.dark, color: "#fff", borderRadius: r.card, boxShadow: "0 8px 28px rgba(17,17,17,.22)" }}>
        <Pressable onClick={() => setRental({ days: Math.max(1, rental.days - 1) })} ariaLabel="На день меньше" className="h-9 w-9 shrink-0 text-[18px]" style={{ background: "rgba(255,255,255,.12)", borderRadius: r.button }}>−</Pressable>
        <div className="min-w-0 flex-1 text-center"><span className="text-[12px]" style={{ color: "rgba(255,255,255,.7)" }}>{rental.days} {pluralDays(rental.days)}</span></div>
        <Pressable onClick={() => setRental({ days: rental.days + 1 })} ariaLabel="На день больше" className="h-9 w-9 shrink-0 text-[18px]" style={{ background: "rgba(255,255,255,.12)", borderRadius: r.button }}>+</Pressable>
        <PressableLink href={withRental(path.booking(vehicle.slug), rental)} className="min-h-9 px-3 py-2 text-[13px] font-600" style={{ background: t.yellow, color: t.text, borderRadius: r.button }}>Забронировать</PressableLink>
      </div>
    </div>
    </>
  );
}
