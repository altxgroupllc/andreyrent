"use client";

import * as React from "react";
import { LayoutGroup, motion } from "motion/react";
import { motorbikes, quote } from "@/content/vehicles";
import { t, r, spring, days as pluralDays } from "./tokens";
import { SmoothNumber } from "./smooth-number";
import { Pressable } from "./pressable";
import { MIN_DAYS, MAX_DAYS } from "@/components/booking/rental-state";

const PRESETS = [1, 3, 7, 30, 90];

/**
 * Real day counts with quick presets, not fixed tariff tiles — so the tariff
 * boundaries at 3, 7 and 30 days are something the customer feels.
 * The tier label is derived from the published ladder, never hardcoded.
 */
export function DurationStepper({
  days, onChange, labels, groupId = "duration",
}: {
  days: number;
  onChange: (n: number) => void;
  labels: { less: string; more: string; tariff: string; quickPick: string };
  groupId?: string;
}) {
  const clamp = (n: number) => Math.min(MAX_DAYS, Math.max(MIN_DAYS, n));
  const tier = quote(motorbikes[0], days)?.tier ?? "—";

  const btn: React.CSSProperties = {
    width: 44, height: 44, borderRadius: r.control,
    background: t.surfaceSunken, color: t.text,
    display: "grid", placeItems: "center", fontSize: 20, lineHeight: 1,
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Pressable onClick={() => onChange(clamp(days - 1))} ariaLabel={labels.less} style={btn} disabled={days <= MIN_DAYS}>
          −
        </Pressable>

        <div className="flex-1 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <SmoothNumber value={days} className="text-[26px] font-600 leading-none" />
            <span className="text-[15px] font-500" style={{ color: t.muted }}>{pluralDays(days)}</span>
          </div>
          <div className="mt-1 text-[12.5px]" style={{ color: t.faint }}>
            {labels.tariff} «{tier}»
          </div>
        </div>

        <Pressable onClick={() => onChange(clamp(days + 1))} ariaLabel={labels.more} style={btn}>
          +
        </Pressable>
      </div>

      <LayoutGroup id={`${groupId}-presets`}>
        <div
          className="mt-2.5 grid grid-cols-5 gap-1 p-1"
          style={{ background: t.surfaceSunken, borderRadius: r.control }}
          role="group"
          aria-label={labels.quickPick}
        >
          {PRESETS.map((d) => {
            const on = days === d;
            return (
              <button
                key={d}
                onClick={() => onChange(d)}
                aria-pressed={on}
                className="relative h-8 rounded-[9px] text-[12.5px] font-500 transition-colors"
                style={{ color: on ? t.text : t.muted }}
              >
                {on && (
                  <motion.span
                    layoutId={`${groupId}-preset`}
                    className="absolute inset-0 rounded-[9px]"
                    style={{ background: t.yellow }}
                    transition={spring}
                  />
                )}
                <span className="relative">{d < 30 ? `${d} дн.` : `${d / 30} мес.`}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
