import * as React from "react";
import Link from "next/link";
import type { Vehicle } from "@/content/vehicles";
import { durationTiers } from "@/content/pricing";
import { thb } from "@/lib/rental";
import { vehiclePath, type Locale } from "@/content/routes";
import { toListItem } from "@/content/vehicle-list";
import { displayName } from "@/components/vehicle/vehicle-name";
import { t, r } from "@/components/system/tokens";

/**
 * The published tariff ladder, rendered straight from the same pricing data the catalogue
 * uses. `/prices` and `/bikes` serve different intent but share one source — no duplication.
 */
export function PriceTable({ title, vehicles, locale }: { title: string; vehicles: Vehicle[]; locale: Locale }) {
  if (vehicles.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-[19px] font-600">{title}</h2>
      <div className="mt-3 overflow-x-auto" style={{ borderRadius: r.card, border: `1px solid ${t.border}`, background: t.surface }}>
        <table className="w-full min-w-[640px] text-[13.5px]">
          <thead>
            <tr style={{ color: t.muted, background: t.surfaceSunken }}>
              <th scope="col" className="px-3 py-2.5 text-left font-500">Модель</th>
              {durationTiers.map((tier) => (
                <th key={tier.id} scope="col" className="px-3 py-2.5 text-right font-500 whitespace-nowrap">
                  {tier.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.slug} className="border-t" style={{ borderColor: t.border }}>
                <th scope="row" className="px-3 py-2.5 text-left font-500">
                  <Link href={vehiclePath(v.category, v.slug, locale)} className="underline-offset-2 hover:underline">
                    {displayName(toListItem(v))}
                  </Link>
                </th>
                {durationTiers.map((tier) => {
                  const key =
                    tier.days === 1 ? v.prices.day1
                    : tier.days === 3 ? v.prices.day3
                    : tier.days === 7 ? v.prices.day7
                    : tier.days === 30 ? v.prices.month1
                    : tier.days === 60 ? v.prices.month2
                    : v.prices.month3;
                  return (
                    <td key={tier.id} className="tnum whitespace-nowrap px-3 py-2.5 text-right">
                      {key ? (
                        <>
                          {thb(key)} ฿
                          <span className="ml-1 text-[11.5px]" style={{ color: t.faint }}>
                            {tier.billing === "whole-period" ? "/мес" : "/сут"}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: t.faint }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
