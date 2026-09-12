import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { motorbikes, cars, bicycles } from "@/content/vehicles";
import { durationTiers, pricingRules, extraCharges, deposit } from "@/content/pricing";
import { displayPolicy } from "@/content/display-policy";
import { isLocale, path } from "@/content/routes";
import { PriceTable } from "@/components/content/price-table";
import { Card } from "@/components/system/surfaces";
import { t, r } from "@/components/system/tokens";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Цены на аренду в Паттайе",
  description:
    "Полный прайс на аренду мотобайков, скутеров, авто и велосипедов в Паттайе: тарифы на 1, 3, 7 дней и на 1, 2, 3 месяца.",
  alternates: { canonical: "/ru/prices" },
};

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-6">
      <h1 className="max-w-[24ch] text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
        Цены на аренду в Паттайе
      </h1>
      <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.6]" style={{ color: t.muted }}>
        Полный прайс по всем срокам. Главное правило простое: чем дольше срок аренды, тем дешевле
        обходится день. На 30, 60 и 90 дней считается стоимость целого периода, а не «дни × тариф».
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={path.bikes(locale)}
          className="px-3.5 py-2 text-[13.5px] font-500"
          style={{ background: t.yellow, color: t.text, borderRadius: r.button }}
        >
          Подобрать байк на свои даты
        </Link>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {durationTiers.map((tier) => (
          <Card key={tier.id} className="p-3.5">
            <div className="text-[14.5px] font-600">{tier.label}</div>
            <p className="mt-1 text-[13px] leading-[1.55]" style={{ color: t.muted }}>{tier.blurb}</p>
          </Card>
        ))}
      </div>

      <PriceTable title="Мотобайки и скутеры" vehicles={motorbikes} locale={locale} />
      <PriceTable title="Авто" vehicles={cars} locale={locale} />
      <PriceTable title="Велосипеды" vehicles={bicycles} locale={locale} />

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-[19px] font-600">Как устроен прайс</h2>
          <div className="mt-3 space-y-2">
            {pricingRules.map((rule) => (
              <Card key={rule.id} className="p-3.5">
                <h3 className="text-[14.5px] font-600">{rule.title}</h3>
                <p className="mt-1 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>{rule.body}</p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[19px] font-600">Что может добавиться к счёту</h2>
          <ul className="mt-3 space-y-1.5">
            {extraCharges
              /* C-15: the fuel figure is published two different ways — not shown */
              .filter((c) => !c.item.toLowerCase().includes("топлив"))
              .map((c) => (
                <li
                  key={c.item}
                  className="flex items-baseline justify-between gap-4 px-3.5 py-2.5 text-[13.5px]"
                  style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}
                >
                  <span>{c.item}</span>
                  <span className="tnum shrink-0 text-[13px] font-500" style={{ color: t.muted }}>{c.amount}</span>
                </li>
              ))}
            <li
              className="px-3.5 py-2.5 text-[13.5px]"
              style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control, color: t.muted }}
            >
              {displayPolicy.fuelShortfall.copy}
            </li>
          </ul>

          <Card className="mt-4 p-4">
            <h3 className="text-[14.5px] font-600">Залог</h3>
            <p className="mt-1 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>
              {deposit.label} {deposit.min.toLocaleString("ru-RU")}–{deposit.max.toLocaleString("ru-RU")} {deposit.currency}.
              {" "}{deposit.note} {deposit.passportNote}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
