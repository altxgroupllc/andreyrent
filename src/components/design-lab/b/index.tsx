"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { motorbikes, quote, type Vehicle } from "@/content/vehicles";
import { durationTiers, deposit } from "@/content/pricing";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { reviews, googleRating } from "@/content/reviews";
import { brand } from "@/content/brand";
import { Logo } from "@/components/brand/logo";
import { thb, useCases, savingVsDaily } from "@/lib/rental";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, Pin, WhatsApp, LineApp } from "../icons";
import { NoPhoto } from "../no-photo";

/* ================================================================== *
 * B — MOTO DISCOVERY
 * ~70% Rental App / 30% Motorsport Urban — the briefed balance.
 *
 * The shopfront translated to screen: black ground, yellow sign plates, condensed
 * uppercase lettering that echoes the real "MOTORCYCLE FOR RENT" banner. Discovery is
 * horizontal — three swipeable garage rails by riding character rather than a grid.
 * Price never hides: every card wears a yellow price tag bound to the duration chips.
 * ================================================================== */

const RAILS = [
  { id: "scooter", n: "01", title: "Город", sub: "110–125 CC", lede: "Click, Scoopy, Giorno, ZoomerX. Узкие сои, рынки, парковка у 7-Eleven." },
  { id: "maxi", n: "02", title: "Вдвоём", sub: "150–350 CC", lede: "PCX, Forza, ADV. Длинное седло, ветровик, багажник под два шлема." },
  { id: "motorcycle", n: "03", title: "Характер", sub: "250–300 CC", lede: "CBR и Rebel. Механика, посадка, звук — для тех, кто уже ездит." },
];

/** The yellow sign plate: the logo's banner geometry, reused as a UI primitive. */
function Plate({ children, tone = "yellow", className = "" }: { children: React.ReactNode; tone?: "yellow" | "outline" | "red"; className?: string }) {
  const styles =
    tone === "yellow" ? { background: brand.yellow, color: brand.black }
    : tone === "red" ? { background: brand.red, color: brand.white }
    : { background: "transparent", color: brand.white, boxShadow: `inset 0 0 0 2px ${brand.yellow}` };
  return (
    <span className={`inline-block px-2.5 py-1 font-[family-name:var(--font-b-display)] text-[13px] font-600 uppercase tracking-[.06em] ${className}`} style={styles}>
      {children}
    </span>
  );
}

function RailCard({ v, days, onOpen }: { v: Vehicle; days: number; onOpen: (v: Vehicle) => void }) {
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  const reduce = useReducedMotion();
  return (
    <motion.button
      onClick={() => onOpen(v)}
      className="group relative w-[224px] shrink-0 snap-start text-left sm:w-[280px]"
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden" style={{ background: brand.ink800 }}>
        {v.images[0] ? (
          <Image src={v.images[0]} alt="" fill sizes="(max-width:640px) 224px, 280px"
            className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]" />
        ) : (
          <NoPhoto />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,.94) 4%, rgba(10,10,10,.25) 42%, transparent 68%)" }} />

        {/* the price tag — a physical sticker, always readable */}
        <div className="absolute left-0 top-0 flex flex-col items-start">
          <span className="tnum px-2 py-1 font-[family-name:var(--font-b-display)] text-[19px] font-700 leading-none"
            style={{ background: brand.yellow, color: brand.black }}>
            {q ? thb(q.perDay) : "—"} ฿
          </span>
          <span className="px-2 py-0.5 font-[family-name:var(--font-b-body)] text-[9.5px] font-600 uppercase tracking-[.08em]"
            style={{ background: brand.black, color: brand.white }}>
            в день · {days} дн.
          </span>
        </div>

        {save && save.pct >= 40 && (
          <span className="absolute right-0 top-0 px-2 py-1 font-[family-name:var(--font-b-display)] text-[11px] font-600 uppercase"
            style={{ background: brand.black, color: brand.yellow }}>−{save.pct}%</span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="font-[family-name:var(--font-b-display)] text-[19px] font-600 uppercase leading-[1.05] tracking-[.01em] text-white sm:text-[22px]">
            {v.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {useCases(v).slice(0, 3).map((t) => (
              <span key={t} className="font-[family-name:var(--font-b-body)] text-[9.5px] font-600 uppercase tracking-[.08em] text-white/60">{t}</span>
            ))}
          </div>
          {!v.available && <Plate tone="outline" className="mt-2 !text-[10px]">{v.availabilityLabel}</Plate>}
        </div>
      </div>
    </motion.button>
  );
}

function Rail({ r, days, onOpen }: { r: (typeof RAILS)[number]; days: number; onOpen: (v: Vehicle) => void }) {
  const items = motorbikes.filter((v) => v.segment === r.id);
  const ref = React.useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  const min = Math.min(...items.map((v) => quote(v, days)?.perDay ?? 9e9));

  return (
    <section id={r.id} className="border-t" style={{ borderColor: brand.ink700 }}>
      <div className="mx-auto max-w-[1400px] px-3 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span className="font-[family-name:var(--font-b-display)] text-[13px] font-600 tracking-[.3em]" style={{ color: brand.yellow }}>
            {r.n}
          </span>
          <h2 className="font-[family-name:var(--font-b-display)] text-[38px] font-700 uppercase leading-[.92] tracking-[.005em] text-white sm:text-[54px]">
            {r.title}
          </h2>
          <span className="font-[family-name:var(--font-b-body)] text-[12px] font-700 uppercase tracking-[.12em] text-white/45">{r.sub}</span>
          <span className="tnum ml-auto font-[family-name:var(--font-b-body)] text-[12.5px] text-white/55">
            {items.length} моделей · от <b className="font-700" style={{ color: brand.yellow }}>{thb(min)} ฿</b> в день на {days} дн.
          </span>
          <div className="hidden gap-1 sm:flex">
            <button onClick={() => scrollBy(-1)} aria-label="Назад" className="border border-white/25 px-2.5 py-1 text-white/80 hover:border-white">←</button>
            <button onClick={() => scrollBy(1)} aria-label="Вперёд" className="border border-white/25 px-2.5 py-1 text-white/80 hover:border-white">→</button>
          </div>
        </div>
        <p className="mt-2 max-w-[58ch] font-[family-name:var(--font-b-body)] text-[14.5px] leading-[1.65] text-white/60">{r.lede}</p>

        <div ref={ref} className="rail mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {items.map((v) => <RailCard key={v.slug} v={v} days={days} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}

export function DirectionB() {
  const [days, setDays] = React.useState(7);
  const [open, setOpen] = React.useState<Vehicle | null>(null);
  const [shot, setShot] = React.useState(0);
  const reduce = useReducedMotion();
  const hero = motorbikes.find((v) => v.slug === "honda-adv-160cc-keyless") ?? motorbikes[0];

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  React.useEffect(() => { setShot(0); }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  const q = open ? quote(open, days) : null;

  return (
    <div className="font-[family-name:var(--font-b-body)]" style={{ background: brand.black, color: brand.white }}>
      {/* scroll progress — a yellow rule that fills as you move down the garage */}
      <motion.div className="fixed left-0 right-0 z-50 h-[3px] origin-left"
        style={{ top: "var(--lab-top, 0px)", background: brand.yellow, scaleX: bar }} />

      <header className="sticky z-40" style={{ top: "var(--lab-top, 0px)", background: brand.black }}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-5 px-3 py-2.5 sm:px-6">
          <Logo height={30} />
          <nav className="ml-auto hidden gap-6 font-[family-name:var(--font-b-display)] text-[14px] font-500 uppercase tracking-[.08em] text-white/60 md:flex">
            {RAILS.map((r) => <a key={r.id} href={`#${r.id}`} className="hover:text-white">{r.title}</a>)}
            <a href="#practical" className="hover:text-white">Условия</a>
          </nav>
          <a href="#practical" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 font-[family-name:var(--font-b-display)] text-[13px] font-600 uppercase tracking-[.05em] md:ml-0"
            style={{ background: brand.green, color: brand.white }}>
            <WhatsApp size={16} /> WhatsApp
          </a>
        </div>
      </header>

      {/* ---------- hero: photo + sign plate ---------- */}
      <section className="relative">
        <div className="relative h-[60svh] min-h-[430px] overflow-hidden sm:h-[70svh]">
          {hero.images[0] && (
            <Image src={hero.images[0]} alt={hero.name} fill priority sizes="100vw" className="object-cover" style={{ filter: "contrast(1.08) brightness(.86)" }} />
          )}
          {/* Two scrims, not one: the vertical gradient alone leaves white lettering sitting on a
              bright fairing. The left wedge guarantees the headline column stays legible whatever
              the photograph happens to contain. */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,.55) 0%, rgba(10,10,10,.28) 26%, rgba(10,10,10,.88) 72%, rgba(10,10,10,.99) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,10,.88) 0%, rgba(10,10,10,.55) 34%, transparent 66%)" }} />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1400px] px-3 pb-7 sm:px-6 sm:pb-10">
              <Plate>Паттайя · с 2009</Plate>
              {/* The yellow plate is an inline-block with its own leading so its box cannot
                  clip the line above it — a plain inline span overlapped the descenders. */}
              <h1 className="mt-3 max-w-[13ch] font-[family-name:var(--font-b-display)] text-[42px] font-700 uppercase leading-[1.06] tracking-[.005em] sm:text-[72px] lg:text-[92px]">
                Байк в Паттайе<br />
                <span className="mt-1 inline-block leading-[1.1]" style={{ background: brand.yellow, color: brand.black, padding: "0.02em 0.12em" }}>
                  за 10 минут
                </span>
              </h1>
              <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-white/72 sm:text-[17px]">
                28 моделей Honda и Yamaha, два офиса, доставка к отелю за {deliveryEta.minMinutes}–{deliveryEta.maxMinutes} минут.
                Паспорт остаётся у вас — в залог идут деньги, а не документ.
              </p>
            </div>
          </div>
        </div>

        {/* duration chips — a yellow rule under the sign */}
        <div className="border-y" style={{ borderColor: brand.ink700, background: brand.ink900 }}>
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-5 gap-y-2 px-3 py-3 sm:px-6">
            <span className="font-[family-name:var(--font-b-display)] text-[12px] font-600 uppercase tracking-[.14em] text-white/45">
              Цены на срок
            </span>
            <div className="rail flex gap-1.5 overflow-x-auto">
              {durationTiers.map((t) => {
                const on = days === t.days;
                return (
                  <button key={t.id} onClick={() => setDays(t.days)} aria-pressed={on}
                    className="shrink-0 px-3 py-1.5 font-[family-name:var(--font-b-display)] text-[13px] font-600 uppercase tracking-[.05em] transition-colors"
                    style={on ? { background: brand.yellow, color: brand.black } : { color: "rgba(255,255,255,.6)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.2)" }}>
                    {t.label}
                  </button>
                );
              })}
            </div>
            <span className="ml-auto hidden font-[family-name:var(--font-b-body)] text-[12px] text-white/40 lg:block">
              {durationTiers.find((t) => t.days === days)?.billing === "whole-period" ? "цена целого периода" : "тариф за сутки"}
            </span>
          </div>
        </div>
      </section>

      {RAILS.map((r) => <Rail key={r.id} r={r} days={days} onOpen={setOpen} />)}

      {/* ---------- practical ---------- */}
      <section id="practical" className="border-t" style={{ borderColor: brand.ink700 }}>
        <div className="mx-auto max-w-[1400px] px-3 py-10 sm:px-6 sm:py-14">
          <h2 className="font-[family-name:var(--font-b-display)] text-[34px] font-700 uppercase leading-[.95] sm:text-[50px]">
            Что нужно знать <span style={{ color: brand.yellow }}>до</span>, а не после
          </h2>

          <div className="mt-8 grid gap-x-8 gap-y-7 md:grid-cols-3">
            {[
              { i: <Passport size={24} sw={2.25} />, h: "Документы", b: "Оригинал загранпаспорта показываете, с него снимают копию и возвращают. С 18 лет. Права категории A обязательны по закону Таиланда — штраф 500–1 000 ฿ платит арендатор." },
              { i: <DepositIcon size={24} sw={2.25} />, h: "Залог", b: `Деньги, ${thb(deposit.min)}–${thb(deposit.max)} ฿ в зависимости от модели. Возвращают сразу после сдачи.` },
              { i: <Helmet size={24} sw={2.25} />, h: "В цене", b: "Два шлема, замок, полный бак 95-го, страховка до 30 000 ฿ на госпиталь. Авария, угон и падение не покрыты." },
            ].map((x) => (
              <article key={x.h} className="border-t-[3px] pt-3" style={{ borderColor: brand.yellow }}>
                <div style={{ color: brand.yellow }}>{x.i}</div>
                <h3 className="mt-2.5 font-[family-name:var(--font-b-display)] text-[22px] font-600 uppercase">{x.h}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.7] text-white/62">{x.b}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <h3 className="flex items-center gap-2.5 font-[family-name:var(--font-b-display)] text-[24px] font-600 uppercase">
                <Scooter size={23} sw={2.25} /> Привезём
              </h3>
              <ul className="mt-4">
                {deliveryZones.map((z) => (
                  <li key={z.zone} className="flex items-baseline justify-between gap-4 border-b py-2.5" style={{ borderColor: brand.ink700 }}>
                    <span className="text-[15px]">{z.zone}</span>
                    <span className="tnum font-[family-name:var(--font-b-display)] text-[18px] font-700" style={{ color: brand.yellow }}>{z.price} ฿</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {offices.map((o) => (
                  <div key={o.id} className="p-3.5" style={{ background: brand.ink900 }}>
                    <h4 className="flex items-center gap-1.5 font-[family-name:var(--font-b-display)] text-[16px] font-600 uppercase">
                      <Pin size={16} sw={2.25} /> {o.name}
                    </h4>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-white/55">{o.address}</p>
                    <p className="tnum mt-1.5 text-[14px] font-700" style={{ color: brand.yellow }}>{o.phone}</p>
                    <div className="mt-2.5 flex gap-1.5">
                      <span className="flex items-center gap-1 px-2 py-1 text-[11.5px] font-600" style={{ background: brand.green, color: brand.white }}>
                        <WhatsApp size={13} /> WhatsApp
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 text-[11.5px] font-600" style={{ background: brand.lineGreen, color: brand.white }}>
                        <LineApp size={13} /> LINE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <figure className="border-l-[3px] pl-5" style={{ borderColor: brand.yellow }}>
              <div className="flex items-baseline gap-2">
                <span className="tnum font-[family-name:var(--font-b-display)] text-[46px] font-700 leading-none">{googleRating.value}</span>
                <span className="text-[13px] text-white/50">Google · {googleRating.scale}</span>
              </div>
              <blockquote className="mt-4 text-[16px] leading-[1.7] text-white/78">«{reviews[1].text.slice(0, 300)}…»</blockquote>
              <figcaption className="mt-3 font-[family-name:var(--font-b-display)] text-[13px] font-600 uppercase tracking-[.14em] text-white/45">
                {reviews[1].author}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- specimen ---------- */}
      <section className="border-t" style={{ borderColor: brand.ink700 }}>
        <div className="mx-auto grid max-w-[1400px] gap-7 px-3 py-9 sm:px-6 md:grid-cols-3">
          <div>
            <div className="font-[family-name:var(--font-b-display)] text-[42px] font-700 uppercase leading-[.95]">Oswald 700</div>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-white/60">
              Manrope 400 — нейтральный текст под вывесочным заголовком. Oswald повторяет
              узкие прописные существующей вывески.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-2" style={{ color: brand.yellow }}>
            {[Passport, DepositIcon, Helmet, Scooter, Pin].map((I, i) => (
              <div key={i} className="p-2.5" style={{ background: brand.ink900 }}><I size={22} sw={2.25} /></div>
            ))}
            <div className="flex items-center gap-1.5 p-2.5" style={{ background: brand.ink900, color: brand.green }}>
              <WhatsApp size={20} /><LineApp size={20} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["Чёрный", brand.black], ["Жёлтый", brand.yellow], ["Белый", brand.white], ["Красный", brand.red], ["Зелёный", brand.green]].map(([n, c]) => (
              <div key={n}>
                <div className="h-11 w-[74px]" style={{ background: c, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }} />
                <div className="mt-1 font-[family-name:var(--font-b-body)] text-[10px] font-600 uppercase tracking-[.08em] text-white/50">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- mobile sticky price bar ---------- */}
      <div className="sticky bottom-0 z-40 md:hidden" style={{ background: brand.black, borderTop: `2px solid ${brand.yellow}` }}>
        <div className="flex items-center gap-2 px-3 py-2" style={{ paddingBottom: "max(.5rem, env(safe-area-inset-bottom))" }}>
          <div className="rail flex gap-1 overflow-x-auto">
            {durationTiers.map((t) => (
              <button key={t.id} onClick={() => setDays(t.days)} aria-pressed={days === t.days}
                className="shrink-0 px-2 py-1.5 font-[family-name:var(--font-b-display)] text-[12px] font-600 uppercase"
                style={days === t.days ? { background: brand.yellow, color: brand.black } : { color: "rgba(255,255,255,.55)" }}>
                {t.shortLabel}
              </button>
            ))}
          </div>
          <a href="#practical" className="ml-auto flex shrink-0 items-center gap-1.5 px-3 py-2 font-[family-name:var(--font-b-display)] text-[12.5px] font-600 uppercase"
            style={{ background: brand.green, color: brand.white }}>
            <WhatsApp size={15} /> Написать
          </a>
        </div>
      </div>

      {/* ---------- model detail: full-bleed spread ---------- */}
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-y-auto"
          style={{ background: brand.black }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          role="dialog" aria-modal="true" aria-label={open.name}
        >
          <div className="sticky top-0 z-10 flex items-center gap-3 px-3 py-2.5 sm:px-6" style={{ background: brand.black, borderBottom: `2px solid ${brand.yellow}` }}>
            <span className="font-[family-name:var(--font-b-display)] text-[15px] font-600 uppercase">{open.name}</span>
            <button onClick={() => setOpen(null)} autoFocus
              className="ml-auto px-3 py-1.5 font-[family-name:var(--font-b-display)] text-[12.5px] font-600 uppercase"
              style={{ background: brand.yellow, color: brand.black }}>
              Закрыть ✕
            </button>
          </div>

          <div className="mx-auto max-w-[1400px] px-3 pb-16 sm:px-6">
            <div className="relative mt-3 aspect-[4/3] overflow-hidden sm:aspect-[16/9]" style={{ background: brand.ink800 }}>
              {open.images[shot] ? <Image src={open.images[shot]} alt={`${open.name} — кадр ${shot + 1}`} fill sizes="100vw" className="object-cover" /> : <NoPhoto />}
            </div>
            {open.images.length > 1 && (
              <div className="rail mt-2 flex gap-1.5 overflow-x-auto">
                {open.images.map((src, i) => (
                  <button key={src} onClick={() => setShot(i)} aria-label={`Кадр ${i + 1}`}
                    className="relative h-14 w-20 shrink-0 overflow-hidden"
                    style={{ boxShadow: i === shot ? `inset 0 0 0 3px ${brand.yellow}` : "none", opacity: i === shot ? 1 : 0.45 }}>
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-7 grid gap-9 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <h2 className="font-[family-name:var(--font-b-display)] text-[36px] font-700 uppercase leading-[.95] sm:text-[52px]">{open.name}</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {useCases(open).map((t) => <Plate key={t} tone="outline" className="!text-[11px]">{t}</Plate>)}
                </div>
                {open.verdict && <p className="mt-5 text-[16px] leading-[1.72] text-white/75">{open.verdict}</p>}

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  {open.pros.length > 0 && (
                    <div>
                      <h4 className="font-[family-name:var(--font-b-display)] text-[14px] font-600 uppercase tracking-[.12em]" style={{ color: brand.yellow }}>За</h4>
                      <ul className="mt-2.5 space-y-1.5">{open.pros.map((p) => <li key={p} className="text-[14px] leading-[1.6] text-white/72">{p}</li>)}</ul>
                    </div>
                  )}
                  {open.cons.length > 0 && (
                    <div>
                      <h4 className="font-[family-name:var(--font-b-display)] text-[14px] font-600 uppercase tracking-[.12em] text-white/45">Против</h4>
                      <ul className="mt-2.5 space-y-1.5">{open.cons.map((p) => <li key={p} className="text-[14px] leading-[1.6] text-white/55">{p}</li>)}</ul>
                    </div>
                  )}
                </div>

                <dl className="mt-7 border-t" style={{ borderColor: brand.ink700 }}>
                  {open.specs.map((s) => (
                    <div key={s.label} className="flex gap-5 border-b py-2.5" style={{ borderColor: brand.ink800 }}>
                      <dt className="w-[38%] shrink-0 text-[13px] text-white/45">{s.label}</dt>
                      <dd className="text-[13.5px] leading-[1.5]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <aside className="lg:sticky lg:self-start" style={{ top: "calc(var(--lab-top, 0px) + 4.5rem)" }}>
                <div className="p-5" style={{ background: brand.ink900, borderTop: `4px solid ${brand.yellow}` }}>
                  <div className="rail flex gap-1.5 overflow-x-auto">
                    {durationTiers.map((t) => (
                      <button key={t.id} onClick={() => setDays(t.days)} aria-pressed={days === t.days}
                        className="shrink-0 px-2.5 py-1 font-[family-name:var(--font-b-display)] text-[12px] font-600 uppercase"
                        style={days === t.days ? { background: brand.yellow, color: brand.black } : { color: "rgba(255,255,255,.5)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.2)" }}>
                        {t.shortLabel}
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="tnum font-[family-name:var(--font-b-display)] text-[54px] font-700 leading-none" style={{ color: brand.yellow }}>
                      {q ? thb(q.perDay) : "—"}
                    </span>
                    <span className="font-[family-name:var(--font-b-display)] text-[20px] font-600 uppercase">฿/день</span>
                  </div>
                  <p className="tnum mt-1 text-[13.5px] text-white/55">итого {q ? thb(q.total) : "—"} ฿ за {days} дн.</p>

                  <dl className="mt-4 space-y-1.5 text-[13.5px]">
                    {[["Залог", open.depositLabel ?? "—"], ["Паспорт", "остаётся у вас"], ["Наличие", open.availabilityLabel ?? "—"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b pb-1.5" style={{ borderColor: brand.ink700 }}>
                        <dt className="text-white/45">{k}</dt><dd>{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 py-3 font-[family-name:var(--font-b-display)] text-[15px] font-600 uppercase tracking-[.04em]"
                    style={{ background: brand.green, color: brand.white }}>
                    <WhatsApp size={18} /> Написать в WhatsApp
                  </button>
                  <button className="mt-2 w-full py-2.5 font-[family-name:var(--font-b-display)] text-[14px] font-600 uppercase tracking-[.04em]"
                    style={{ background: brand.red, color: brand.white }}>
                    Забронировать на {days} дн.
                  </button>
                  <p className="mt-2 text-center text-[11px] text-white/35">Прототип — заявка не отправляется</p>
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
