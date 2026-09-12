"use client";

import * as React from "react";
import { SmoothNumber } from "./smooth-number";
import { Chip } from "./surfaces";
import { t, days as pluralDays } from "./tokens";

/**
 * The approved pricing hierarchy: the dominant figure follows the decision being made.
 *
 * One day  — the daily rate IS the price, so it leads.
 * Longer   — the customer commits to a total, so the total leads and the daily rate
 *            drops to the explanation line next to a neutral savings chip.
 *
 * A "from X ฿" figure detached from its duration is forbidden anywhere in the product:
 * the live site advertises the monthly rate ÷ 30 under every card and the real daily
 * price is ~3x higher. See content/source-conflicts.md C-01.
 */
export function PriceBlock({
  perDay, total, days, savingPct, size = "row", align = "right",
}: {
  perDay: number;
  total: number;
  days: number;
  savingPct?: number | null;
  size?: "row" | "hero";
  align?: "left" | "right";
}) {
  const multiDay = days > 1;
  const right = align === "right";
  return (
    <div className={right ? "text-right" : ""}>
      <div className={`flex items-baseline gap-1 ${right ? "justify-end" : ""}`}>
        <SmoothNumber
          value={multiDay ? total : perDay}
          className={`${size === "hero" ? "text-[34px]" : "text-[20px]"} font-600 leading-none`}
        />
        <span className={`${size === "hero" ? "text-[16px]" : "text-[13px]"} font-500`} style={{ color: t.muted }}>
          ฿{multiDay ? "" : "/день"}
        </span>
      </div>
      <div
        className={`mt-1 flex items-center gap-1.5 ${right ? "justify-end" : ""} ${size === "hero" ? "text-[14px]" : "text-[12.5px]"}`}
        style={{ color: t.muted }}
      >
        {multiDay ? (
          <span className="whitespace-nowrap">
            <SmoothNumber value={perDay} /> ฿/день · {days} {pluralDays(days)}
          </span>
        ) : (
          <span className="whitespace-nowrap">за один день</span>
        )}
        {multiDay && savingPct ? <Chip className="shrink-0">−{savingPct}%</Chip> : null}
      </div>
    </div>
  );
}

/** Compact two-baseline variant used inside dense list rows. */
export function RowPrice({ total }: { total: number }) {
  return (
    <span className="flex shrink-0 items-baseline gap-1 whitespace-nowrap">
      <SmoothNumber value={total} className="text-[20px] font-600 leading-none" />
      <span className="text-[13px] font-500" style={{ color: t.muted }}>฿</span>
    </span>
  );
}

export function RowRate({ perDay, savingPct }: { perDay: number; savingPct?: number | null }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12.5px]" style={{ color: t.muted }}>
      <span><SmoothNumber value={perDay} /> ฿/день</span>
      {savingPct ? <Chip>−{savingPct}%</Chip> : null}
    </div>
  );
}
