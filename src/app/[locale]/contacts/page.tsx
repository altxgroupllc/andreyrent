import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { offices } from "@/content/locations";
import { business } from "@/content/business";
import { googleRating, reviews } from "@/content/reviews";
import { displayPolicy } from "@/content/display-policy";
import { isLocale } from "@/content/routes";
import { Card } from "@/components/system/surfaces";
import { PressableLink } from "@/components/system/pressable";
import { Pin, Clock, WhatsApp, LineApp } from "@/components/icons";
import { whatsappPlain } from "@/components/booking/whatsapp-link";
import { t, r } from "@/components/system/tokens";

export const metadata: Metadata = {
  title: "Контакты в Паттайе",
  description: "Два офиса в Паттайе: Пратумнак и Наклуа. Ежедневно 10:00–20:00. WhatsApp, Telegram, LINE.",
  alternates: { canonical: "/ru/contacts" },
};

const mapsLink = (o: { name: string; address: string; mapUrl?: string }) =>
  o.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.address} Pattaya`)}`;

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-6">
      <h1 className="text-[31px] font-600 leading-[1.15] tracking-[-.015em]">Контакты</h1>
      <p className="mt-2.5 max-w-[60ch] text-[15px] leading-[1.6]" style={{ color: t.muted }}>
        {business.legalName} работает в Паттайе с {business.foundedYear} года. Два офиса, ежедневно
        с {business.hours.open} до {business.hours.close}.
      </p>

      <section className="mt-7 grid gap-3 sm:grid-cols-2">
        {offices.map((o) => (
          <Card key={o.id} className="p-5">
            <h2 className="flex items-center gap-2 text-[17px] font-600"><Pin size={17} sw={1.6} /> {o.name}</h2>
            <p className="mt-2 flex items-center gap-2 text-[13.5px]" style={{ color: t.muted }}>
              <Clock size={15} sw={1.6} /> {o.hours}
            </p>
            {/* C-14: the street address appears in four variants — we link to the map instead */}
            <p className="mt-2 text-[13px]" style={{ color: t.muted }}>{displayPolicy.officeAddress.copy}</p>
            <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className="tnum mt-3 block text-[17px] font-600">
              {o.phone}
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              <PressableLink
                href={whatsappPlain()} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-500"
                style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}
              >
                <WhatsApp size={15} /> WhatsApp
              </PressableLink>
              <span className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-500" style={{ background: t.lineGreen, color: "#FFFFFF", borderRadius: r.button }}>
                <LineApp size={15} /> LINE
              </span>
              <a
                href={mapsLink(o)} target="_blank" rel="noopener noreferrer"
                className="px-3 py-2 text-[13px] font-500"
                style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.button }}
              >
                Построить маршрут
              </a>
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-[17px] font-600">Почта</h2>
          <a href={`mailto:${business.email}`} className="mt-2 block text-[14.5px] underline-offset-2 hover:underline">
            {business.email}
          </a>
          <h2 className="mt-5 text-[17px] font-600">Языки</h2>
          <p className="mt-1.5 text-[13.5px]" style={{ color: t.muted }}>{business.languages.join(" · ")}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-baseline gap-2">
            <span className="tnum text-[28px] font-600">{googleRating.value}</span>
            <span className="text-[13px]" style={{ color: t.muted }}>Google Reviews</span>
          </div>
          <blockquote className="mt-3 text-[13.5px] leading-[1.7]" style={{ color: t.muted }}>
            «{reviews[3].text}»
          </blockquote>
          <p className="mt-2 text-[12.5px]" style={{ color: t.faint }}>— {reviews[3].author}</p>
        </Card>
      </section>
    </div>
  );
}
