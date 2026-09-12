import * as React from "react";
import Link from "next/link";
import { quote, type Vehicle } from "@/content/vehicles";
import { toListItem } from "@/content/vehicle-list";
import { durationTiers } from "@/content/pricing";
import { categoryPath, vehiclePath, type Locale } from "@/content/routes";
import { thb } from "@/lib/rental";
import { getDictionary } from "@/content/i18n";
import { t, r } from "@/components/system/tokens";
import { Card, Chip, SectionHeading } from "@/components/system/surfaces";
import { VehicleGallery } from "./vehicle-gallery";
import { VehicleBookingPanel } from "./vehicle-booking-panel";
import { Island, IslandFallback } from "@/components/system/island";
import { vehicleAttributes, AttributeRow } from "./vehicle-attributes";
import { displayName } from "./vehicle-name";

/**
 * Model page. Server-rendered for SEO; only the booking panel and gallery are client
 * islands. Every fact on this page comes from the content layer.
 */
export function VehicleDetail({
  vehicle, related, locale, backLabel,
}: { vehicle: Vehicle; related: Vehicle[]; locale: Locale; backLabel: string }) {
  const dict = getDictionary(locale);
  const item = toListItem(vehicle);

  const ladder = durationTiers
    .map((tier) => ({ tier, q: quote(vehicle, tier.days) }))
    .filter((x) => x.q);

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 lg:pb-12">
      <nav className="mb-4 text-[13px]" style={{ color: t.muted }}>
        <Link href={categoryPath(vehicle.category, locale)} className="underline-offset-2 hover:underline">
          ← {backLabel}
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
        <div>
          <h1 className="text-[31px] font-600 leading-[1.15] tracking-[-.015em]">{displayName(item)}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <AttributeRow items={vehicleAttributes(item, 3)} responsive={false} />
            {!vehicle.available && <Chip>{vehicle.availabilityLabel}</Chip>}
          </div>

          <div className="mt-5 lg:max-w-[640px]">
            <VehicleGallery vehicle={item} max={vehicle.images.length} sizes="(max-width:1024px) 100vw, 640px" aspect="4/3" preload />
          </div>

          {vehicle.verdict && (
            <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.7]" style={{ color: t.muted }}>
              {vehicle.verdict}
            </p>
          )}

          {(vehicle.pros.length > 0 || vehicle.cons.length > 0) && (
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {vehicle.pros.length > 0 && (
                <div>
                  <h2 className="text-[15px] font-600">{dict.vehicle.pros}</h2>
                  <ul className="mt-2.5 space-y-1.5">
                    {vehicle.pros.map((p) => (
                      <li key={p} className="border-l-2 pl-2.5 text-[13.5px] leading-[1.6]" style={{ borderColor: t.yellow, color: t.muted }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {vehicle.cons.length > 0 && (
                <div>
                  <h2 className="text-[15px] font-600">{dict.vehicle.cons}</h2>
                  <ul className="mt-2.5 space-y-1.5">
                    {vehicle.cons.map((p) => (
                      <li key={p} className="border-l-2 pl-2.5 text-[13.5px] leading-[1.6]" style={{ borderColor: t.border, color: t.muted }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {vehicle.forWhom.length > 0 && (
            <div className="mt-7">
              <h2 className="text-[15px] font-600">{dict.vehicle.forWhom}</h2>
              <ul className="mt-2.5 space-y-1.5">
                {vehicle.forWhom.map((p) => (
                  <li key={p} className="text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>— {p}</li>
                ))}
              </ul>
            </div>
          )}

          {vehicle.specs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[17px] font-600">{dict.vehicle.specs}</h2>
              <dl className="mt-3">
                {vehicle.specs.map((s) => (
                  <div key={s.label} className="flex gap-4 border-b py-2.5 text-[13.5px]" style={{ borderColor: t.border }}>
                    <dt className="w-[38%] shrink-0" style={{ color: t.muted }}>{s.label}</dt>
                    <dd className="leading-[1.5]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-[17px] font-600">{dict.vehicle.tariffTable}</h2>
            <table className="mt-3 w-full text-[13.5px]">
              <thead>
                <tr style={{ color: t.muted }}>
                  <th scope="col" className="pb-2 text-left font-500">{dict.vehicle.period}</th>
                  <th scope="col" className="pb-2 text-right font-500">{dict.vehicle.price}</th>
                </tr>
              </thead>
              <tbody>
                {ladder.map(({ tier, q }) => (
                  <tr key={tier.id} className="border-t" style={{ borderColor: t.border }}>
                    <td className="py-2.5">{tier.label}</td>
                    <td className="tnum py-2.5 text-right font-500">
                      {tier.billing === "whole-period"
                        ? `${thb(q!.total / (tier.days / 30))} ฿ / месяц`
                        : `${thb(q!.perDay)} ฿ / сутки`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-[68px]">
            <Island fallback={<IslandFallback height={420} />}>
              <VehicleBookingPanel vehicle={item} dict={dict} />
            </Island>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeading title={dict.vehicle.relatedTitle} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((rv) => (
              <Link
                key={rv.slug}
                href={vehiclePath(rv.category, rv.slug, locale)}
                className="p-3"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card }}
              >
                <div className="text-[14px] font-500">{displayName(toListItem(rv))}</div>
                <div className="mt-1 text-[12.5px]" style={{ color: t.muted }}>
                  {rv.engineCc ? `${rv.engineCc} см³` : ""}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
