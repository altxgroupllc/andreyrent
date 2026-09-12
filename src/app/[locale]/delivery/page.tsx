import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { deliveryRequestChecklist } from "@/content/business";
import { displayPolicy } from "@/content/display-policy";
import { isLocale, path } from "@/content/routes";
import { Card } from "@/components/system/surfaces";
import { PressableLink } from "@/components/system/pressable";
import { Pin, Clock, WhatsApp, LineApp } from "@/components/icons";
import { whatsappPlain } from "@/components/booking/whatsapp-link";
import { t, r } from "@/components/system/tokens";

export const metadata: Metadata = {
  title: "Доставка байка по Паттайе",
  description:
    "Привезём байк к отелю, кондо или вилле в Паттайе за 30–90 минут. Джомтьен, Пратумнак, центр, Наклуа. Или забирайте в офисе бесплатно.",
  alternates: { canonical: "/ru/delivery" },
};

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-6">
      <h1 className="max-w-[24ch] text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
        Доставка по Паттайе
      </h1>
      <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.6]" style={{ color: t.muted }}>
        Привезём заправленный байк к отелю, кондо или вилле за {deliveryEta.minMinutes}–{deliveryEta.maxMinutes} минут.
        Забрать в офисе — бесплатно.
      </p>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h2 className="text-[19px] font-600">Куда привозим</h2>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {deliveryZones.map((z) => (
              <li
                key={z.zone}
                className="flex items-center gap-2 px-3.5 py-2.5 text-[13.5px]"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}
              >
                <Pin size={15} sw={1.6} />
                {z.zone}
              </li>
            ))}
          </ul>
          {/* C-04: three published sources disagree on zone prices, so none are printed */}
          <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>
            <Clock size={15} sw={1.6} />
            <span>{displayPolicy.deliveryPrices.copy}</span>
          </p>

          <h2 className="mt-8 text-[19px] font-600">Что прислать</h2>
          <ol className="mt-3 space-y-1.5">
            {deliveryRequestChecklist.map((x, i) => (
              <li
                key={x}
                className="flex gap-2.5 px-3.5 py-2.5 text-[13.5px]"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}
              >
                <span className="tnum shrink-0" style={{ color: t.faint }}>{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>

          <PressableLink
            href={whatsappPlain()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-600"
            style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}
          >
            <WhatsApp size={16} /> Заказать доставку в WhatsApp
          </PressableLink>
        </div>

        <div>
          <h2 className="text-[19px] font-600">Или забрать в офисе</h2>
          <div className="mt-3 space-y-2">
            {offices.map((o) => (
              <Card key={o.id} className="p-4">
                <h3 className="flex items-center gap-2 text-[15px] font-600"><Pin size={16} sw={1.6} /> {o.name}</h3>
                <p className="mt-1.5 text-[13px]" style={{ color: t.muted }}>{o.district} · {o.hours}</p>
                <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className="tnum mt-2 block text-[14.5px] font-600">
                  {o.phone}
                </a>
                <div className="mt-3 flex gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500" style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}>
                    <WhatsApp size={14} /> WhatsApp
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500" style={{ background: t.lineGreen, color: "#FFFFFF", borderRadius: r.button }}>
                    <LineApp size={14} /> LINE
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <Link href={path.contacts(locale)} className="mt-3 inline-block text-[13.5px] underline-offset-2 hover:underline" style={{ color: t.muted }}>
            Адреса и карты →
          </Link>
        </div>
      </section>
    </div>
  );
}
