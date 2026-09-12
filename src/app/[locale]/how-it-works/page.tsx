import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { rentalRules, insurance, ridingInThailand } from "@/content/rules";
import { faq } from "@/content/faq";
import { deposit } from "@/content/pricing";
import { included, passportPolicy, deliveryRequestChecklist } from "@/content/business";
import { displayPolicy } from "@/content/display-policy";
import { isLocale, path } from "@/content/routes";
import { Card } from "@/components/system/surfaces";
import { Passport, Deposit as DepositIcon, Helmet, Scooter } from "@/components/icons";
import { t, r } from "@/components/system/tokens";

export const metadata: Metadata = {
  title: "Условия аренды: документы, залог, страховка",
  description:
    "Что нужно для аренды байка в Паттайе: документы, денежный залог, страховка, топливо, ответственность и правила движения в Таиланде.",
  alternates: { canonical: "/ru/how-it-works" },
};

/** Rules the live site states in two different ways are replaced by display-policy copy. */
const OVERRIDES: Record<string, string> = {
  licence: displayPolicy.licence.copy,
  fuel: displayPolicy.fuelShortfall.copy,
};

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const faqTopics = faq.filter((f) => ["documents", "liability", "insurance", "handover", "breakdown", "riding"].includes(f.topic));

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-6">
      <h1 className="max-w-[26ch] text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
        Как арендовать байк в Паттайе
      </h1>
      <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.6]" style={{ color: t.muted }}>
        Документы, залог, что входит в цену и за что отвечает арендатор — всё, что стоит знать
        до поездки, а не после.
      </p>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: <Passport size={20} sw={1.6} />, h: "Паспорт остаётся у вас", b: passportPolicy.detail },
          { i: <DepositIcon size={20} sw={1.6} />, h: "Денежный залог", b: `${deposit.min.toLocaleString("ru-RU")}–${deposit.max.toLocaleString("ru-RU")} ฿ в зависимости от модели. ${deposit.note}` },
          { i: <Helmet size={20} sw={1.6} />, h: "Два шлема в цене", b: "Шлемы и замок предоставляются бесплатно и обрабатываются антисептиком после каждого клиента." },
          { i: <Scooter size={20} sw={1.6} />, h: "Доставка", b: displayPolicy.deliveryPrices.copy },
        ].map((x) => (
          <Card key={x.h} className="p-4">
            <span style={{ color: t.muted }}>{x.i}</span>
            <h2 className="mt-2 text-[14.5px] font-600">{x.h}</h2>
            <p className="mt-1.5 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>{x.b}</p>
          </Card>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-[19px] font-600">Условия аренды</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rentalRules.map((rule) => (
            <Card key={rule.id} className="p-3.5">
              <div className="flex items-baseline gap-2">
                <span
                  className="tnum px-1.5 py-0.5 text-[11.5px] font-600"
                  style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}
                >
                  {rule.n}
                </span>
                <h3 className="text-[14.5px] font-600">{rule.title}</h3>
              </div>
              <p className="mt-1.5 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>
                {OVERRIDES[rule.id] ?? rule.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 p-5" style={{ background: t.dark, borderRadius: r.container }}>
        <h2 className="text-[16px] font-600" style={{ color: t.yellow }}>Страховка покрывает не всё</h2>
        <p className="mt-2 max-w-[80ch] text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,.75)" }}>
          {insurance.covers} Не покрывает: {insurance.doesNotCover.join(", ").toLowerCase()}. {insurance.note}
        </p>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-[19px] font-600">Что входит в стоимость</h2>
          <ul className="mt-3 space-y-1.5">
            {included.map((x) => (
              <li key={x.label} className="px-3.5 py-2.5" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                <span className="text-[13.5px] font-500">{x.label}</span>
                <span className="mt-0.5 block text-[12.5px]" style={{ color: t.muted }}>{x.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[19px] font-600">Что прислать для доставки</h2>
          <ol className="mt-3 space-y-1.5">
            {deliveryRequestChecklist.map((x, i) => (
              <li key={x} className="flex gap-2.5 px-3.5 py-2.5 text-[13.5px]" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                <span className="tnum shrink-0" style={{ color: t.faint }}>{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
          <Link
            href={path.delivery(locale)}
            className="mt-3 inline-block px-3.5 py-2 text-[13.5px] font-500"
            style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.button }}
          >
            Районы доставки →
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[19px] font-600">Движение и парковка в Паттайе</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <Card className="p-4">
            <h3 className="text-[14.5px] font-600">Штрафы</h3>
            <ul className="mt-2 space-y-1">
              {ridingInThailand.commonFines.map((f) => (
                <li key={f.violation} className="flex justify-between gap-4 text-[13.5px]">
                  <span style={{ color: t.muted }}>{f.violation}</span>
                  <span className="tnum shrink-0 font-500">{f.fine}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="text-[14.5px] font-600">Парковка</h3>
            <ul className="mt-2 space-y-1 text-[13.5px]" style={{ color: t.muted }}>
              {ridingInThailand.parking.tips.map((p) => <li key={p}>— {p}</li>)}
            </ul>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[19px] font-600">Частые вопросы</h2>
        <div className="mt-3 space-y-2">
          {faqTopics.map((f) => (
            <details key={f.id} className="px-4 py-3" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card }}>
              <summary className="cursor-pointer text-[14.5px] font-500">{f.question}</summary>
              <p className="mt-2 text-[13.5px] leading-[1.7]" style={{ color: t.muted }}>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
