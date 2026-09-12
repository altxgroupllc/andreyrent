"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { matchesSegment } from "@/content/segments";
import type { Locale } from "@/content/routes";
import { t } from "@/components/system/tokens";
import { SectionHeading } from "@/components/system/surfaces";
import { Pressable } from "@/components/system/pressable";
import { SmoothNumber } from "@/components/system/smooth-number";
import { VehicleList } from "@/components/vehicle/vehicle-list";
import { QuickPreview } from "@/components/vehicle/quick-preview";
import { IntentChooser } from "./intent-chooser";
import { useRental } from "./use-rental";
import { days as pluralDays, variants as pluralVariants, r } from "@/components/system/tokens";
import type { Dictionary } from "@/content/i18n";

type Cat = "motorbike" | "auto" | "bicycle";

/**
 * The rental experience island. Everything around it is a server component; this owns
 * only the interactive selection, and derives its state from the URL via useRental().
 */
export function RentalExperience({
  pools, locale, dict, showChooser = true, showHeading = true, initialCategory = "motorbike",
}: {
  pools: Record<Cat, VehicleListItem[]>;
  locale: Locale;
  dict: Dictionary;
  showChooser?: boolean;
  showHeading?: boolean;
  initialCategory?: Cat;
}) {
  const [rental, setRental] = useRental();
  const [cat, setCat] = React.useState<Cat>(initialCategory);
  const [preview, setPreview] = React.useState<VehicleListItem | null>(null);

  const pool = pools[cat];
  const list = React.useMemo(
    () =>
      pool
        .filter((v) => cat === "motorbike" ? matchesSegment(v, rental.need) : true)
        .sort((a, b) => (quote(a, rental.days)?.perDay ?? 1e9) - (quote(b, rental.days)?.perDay ?? 1e9)),
    [pool, rental.need, rental.days],
  );

  const cheapest = list.length ? quote(list[0], rental.days)?.perDay ?? 0 : 0;
  const heading = showChooser
    ? (cat === "motorbike" ? dict.results.bikes : cat === "auto" ? dict.results.cars : dict.results.bicycles)
    : (cat === "motorbike" ? "Все байки" : cat === "auto" ? "Все автомобили" : "Все велосипеды");

  const categoryTabs = (
    <div className="flex gap-1 p-1" style={{ background: t.surfaceSunken, borderRadius: r.control }}>
      {([["motorbike", dict.nav.bikes], ["auto", dict.nav.cars], ["bicycle", dict.nav.bicycles]] as [Cat, string][]).map(
        ([id, label]) => {
          const on = cat === id;
          return (
            <Pressable
              key={id}
              onClick={() => setCat(id)}
              ariaPressed={on}
              className="rounded-[9px] px-3 py-1.5 text-[13px] font-500"
              style={{
                color: t.text,
                minHeight: 32,
                background: on ? t.surface : "transparent",
                boxShadow: on ? "0 1px 2px rgba(17,17,17,.08)" : "none",
              }}
            >
              {label}
            </Pressable>
          );
        },
      )}
    </div>
  );

  const results = (
    <>
      <SectionHeading
        title={heading}
        sub={showChooser ? <><SmoothNumber value={list.length} /> {pluralVariants(list.length)} {" · "}{dict.results.tariffOn} <SmoothNumber value={rental.days} /> {pluralDays(rental.days)}</> : <><SmoothNumber value={list.length} /> {pluralVariants(list.length)} · срок и итоговая стоимость выбираются в карточке модели</>}
        action={showChooser ? undefined : categoryTabs}
      />
      <VehicleList
        vehicles={list}
        days={rental.days}
        selectedSlug={null}
        onOpen={setPreview}
        emptyTitle={dict.results.empty}
        emptyHint={dict.results.emptyHint}
      />
    </>
  );

  return (
    <>
      {showChooser ? (
        <div className="lg:grid lg:grid-cols-[minmax(0,392px)_minmax(0,1fr)] lg:gap-8">
          <div>
            {showHeading && <><h1 className="whitespace-pre-line text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
              {dict.home.title}
            </h1>
            <p className="mt-2.5 max-w-[42ch] text-[15px] leading-[1.55]" style={{ color: t.muted }}>
              {dict.home.lede}
            </p></>}
            <div className={showHeading ? "mt-6" : ""}>
              <div className="mb-5">
                <p className="mb-2 text-[12px] font-600 uppercase tracking-[.1em]" style={{ color: t.faint }}>Что хотите арендовать?</p>
                {categoryTabs}
              </div>
              <IntentChooser
                rental={rental}
                onChange={setRental}
                matchCount={list.length}
                poolCount={pool.length}
                cheapestPerDay={cheapest}
                category={cat}
                labels={{
                  step1: dict.home.step1,
                  step2: dict.home.step2,
                  step3: dict.home.step3,
                  matches: dict.home.matches,
                  of: dict.home.of,
                  fromPerDay: dict.home.fromPerDay,
                  perDayOn: dict.home.perDayOn,
                  duration: dict.duration,
                  included: dict.included,
                }}
              />
            </div>
          </div>
          <div className="mt-8 lg:mt-0">{results}</div>
        </div>
      ) : (
        results
      )}

      <AnimatePresence>
        {preview && (
          <QuickPreview
            vehicle={preview}
            rental={rental}
            locale={locale}
            labels={{
              quickView: dict.vehicle.quickView,
              choose: dict.vehicle.choose,
              details: dict.vehicle.details,
              close: dict.vehicle.close,
              deposit: dict.vehicle.deposit,
              delivery: dict.vehicle.delivery,
            }}
            onClose={() => setPreview(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
