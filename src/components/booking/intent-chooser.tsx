"use client";

import * as React from "react";
import { motion } from "motion/react";
import { segments, type SegmentId } from "@/content/segments";
import { deposit } from "@/content/pricing";
import { deliveryEta } from "@/content/locations";
import { displayPolicy } from "@/content/display-policy";
import { thb } from "@/lib/rental";
import { t, r, dur, easeOut, days as pluralDays } from "@/components/system/tokens";
import { Pressable } from "@/components/system/pressable";
import { Card, Label } from "@/components/system/surfaces";
import { SmoothNumber } from "@/components/system/smooth-number";
import { DurationStepper } from "@/components/system/duration-stepper";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, Clock } from "@/components/icons";
import { zoneOptions, OFFICE_ZONE, type RentalState } from "./rental-state";

/** A step and its connector. The connector is the whole device — no wizard chrome. */
function Step({ n, title, last, children }: { n: number; title: string; last?: boolean; children: React.ReactNode }) {
  return (
    <section className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-x-3">
      <div className="relative flex flex-col items-center">
        <span
          className="tnum z-10 grid h-6 w-6 place-items-center text-[12px] font-600"
          style={{ background: t.surfaceSunken, color: t.muted, borderRadius: 999 }}
        >
          {n}
        </span>
        {!last && <span className="absolute bottom-[-20px] top-6 w-px" style={{ background: t.border }} aria-hidden />}
      </div>
      <div className="pb-5">
        <Label>{title}</Label>
        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

export function IntentChooser({
  rental, onChange, matchCount, poolCount, cheapestPerDay, category = "motorbike", labels,
}: {
  rental: RentalState;
  onChange: (patch: Partial<RentalState>) => void;
  matchCount: number;
  poolCount: number;
  cheapestPerDay: number;
  category?: "motorbike" | "auto" | "bicycle";
  labels: {
    step1: string; step2: string; step3: string;
    matches: string; of: string; fromPerDay: string; perDayOn: string;
    duration: { less: string; more: string; tariff: string; quickPick: string };
    included: { passport: string; deposit: string; helmets: string; deliveryEta: string; minutes: string };
  };
}) {
  const inclusions = [
    { i: <Passport size={16} sw={1.6} />, tx: labels.included.passport },
    { i: <DepositIcon size={16} sw={1.6} />, tx: `${labels.included.deposit} ${thb(deposit.min)}–${thb(deposit.max)} ฿` },
    ...(category === "motorbike" ? [{ i: <Helmet size={16} sw={1.6} />, tx: labels.included.helmets }] : []),
    { i: <Scooter size={16} sw={1.6} />, tx: `${labels.included.deliveryEta} ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} ${labels.included.minutes}` },
  ];
  return (
    <div>
      <Step n={1} title={labels.step1}>
        {category === "motorbike" ? <div className="grid grid-cols-2 gap-2">
          {segments.map((s) => {
            const on = rental.need === s.id;
            return (
              <Pressable
                key={s.id}
                onClick={() => onChange({ need: s.id as SegmentId })}
                ariaPressed={on}
                className="px-3 py-2.5 text-left"
                style={{
                  borderRadius: r.control,
                  background: on ? t.yellow : t.surface,
                  border: `1px solid ${on ? "transparent" : t.border}`,
                  transition: `background ${dur.control}s, border-color ${dur.control}s`,
                }}
              >
                <span className="block text-[14.5px] font-500" style={{ color: t.text }}>{s.label}</span>
                <span className="mt-0.5 block text-[12.5px]" style={{ color: on ? "rgba(23,23,23,.6)" : t.muted }}>
                  {s.hint}
                </span>
              </Pressable>
            );
          })}
        </div> : <div className="p-3 text-[14px] leading-5" style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.muted }}>
          {category === "auto" ? "Показываем все автомобили. Выберите модель — далее оформите её по тем же шагам." : "Показываем доступный велосипед."}
        </div>}
      </Step>

      <Step n={2} title={labels.step2}>
        <Card className="p-3">
          <DurationStepper days={rental.days} onChange={(n) => onChange({ days: n })} labels={labels.duration} />
        </Card>
      </Step>

      <Step n={3} title={labels.step3} last>
        <select
          value={rental.zone}
          onChange={(e) => onChange({ zone: e.target.value })}
          aria-label={labels.step3}
          className="w-full px-3 py-3 text-[14.5px] font-500 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderRadius: r.control, background: t.surface, border: `1px solid ${t.border}`, color: t.text, appearance: "none" }}
        >
          {zoneOptions.map((z) => (
            <option key={z.id} value={z.id}>{z.label}</option>
          ))}
        </select>
        <p className="mt-2 flex items-start gap-1.5 text-[12.5px]" style={{ color: t.muted }}>
          <Clock size={14} sw={1.6} />
          <span>
            {rental.zone === OFFICE_ZONE
              ? "Два офиса · 10:00–20:00 · бесплатно"
              : /* C-04: zone prices are disputed across three published sources */
                `${displayPolicy.deliveryPrices.copy} Привезём за ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} ${labels.included.minutes}.`}
          </span>
        </p>
      </Step>

      <motion.div
        layout
        transition={{ duration: dur.card, ease: easeOut }}
        className="px-3.5 py-3"
        style={{ background: t.yellow, borderRadius: r.control }}
      >
        <div className="text-[14.5px] font-600" style={{ color: t.text }}>
          {labels.matches} <SmoothNumber value={matchCount} /> {labels.of} {poolCount}
        </div>
        <div className="mt-0.5 text-[12.5px]" style={{ color: "rgba(23,23,23,.65)" }}>
          {labels.fromPerDay} <SmoothNumber value={cheapestPerDay} /> {labels.perDayOn} {rental.days} {pluralDays(rental.days)}
        </div>
      </motion.div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {inclusions.map((x) => (
          <div
            key={x.tx}
            className="flex items-center gap-2 px-2.5 py-2 text-[12.5px] font-500"
            style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control, color: t.text }}
          >
            <span style={{ color: t.muted }}>{x.i}</span>
            {x.tx}
          </div>
        ))}
      </div>
    </div>
  );
}
