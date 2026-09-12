"use client";

import * as React from "react";
import Image from "next/image";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CountUp from "@/components/CountUp";
import { motorbikes, cars, bicycles, quote, type Vehicle } from "@/content/vehicles";
import { deposit } from "@/content/pricing";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { googleRating, reviews } from "@/content/reviews";
import { brand } from "@/content/brand";
import { Logo } from "@/components/brand/logo";
import { thb, useCases, savingVsDaily } from "@/lib/rental";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, KeyFob, WhatsApp } from "../icons";
import { NoPhoto } from "../no-photo";

/* ================================================================== *
 * A — INVENTORY FIRST
 * ~80% product utility / 20% motorcycle expression.
 *
 * The page opens on a working booking bar and the live inventory. There is no
 * marketing hero: dates, duration and price are the first thing on screen, and the
 * grid re-prices the moment the range changes. Comparison is the second pillar —
 * pick up to three bikes and the compare tray answers "which one, and why".
 * Light surface, black chrome, yellow used strictly for state and primary action.
 * ================================================================== */

const MAXC = 3;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.14em] text-neutral-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function VehicleCard({
  v, days, onCompare, compared, onOpen, disabled, eager,
}: { v: Vehicle; days: number; onCompare: (v: Vehicle) => void; compared: boolean; onOpen: (v: Vehicle) => void; disabled: boolean; eager: boolean }) {
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  return (
    <article
      className="group flex flex-col border bg-white transition-colors"
      style={{ borderColor: compared ? brand.black : "#E2E2DF", borderWidth: compared ? 2 : 1 }}
    >
      <button onClick={() => onOpen(v)} aria-label={`${v.name} — подробнее`} className="relative block aspect-[4/3] overflow-hidden bg-[#F1F1EE] text-left">
        {v.images[0] ? (
          <Image src={v.images[0]} alt="" fill priority={eager} sizes="(max-width:640px) 50vw, 260px"
            className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : (
          <NoPhoto tone="light" />
        )}
        {!v.available && (
          <span className="absolute left-0 top-0 bg-[#0A0A0A] px-2 py-1 font-[family-name:var(--font-a-mono)] text-[9.5px] uppercase tracking-[.1em] text-white">
            {v.availabilityLabel}
          </span>
        )}
        {save && save.pct >= 40 && (
          <span className="absolute right-0 top-0 px-2 py-1 font-[family-name:var(--font-a-mono)] text-[9.5px] font-600 uppercase tracking-[.06em]"
            style={{ background: brand.yellow, color: brand.black }}>
            −{save.pct}%
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-2.5">
        <button onClick={() => onOpen(v)} className="-my-1 py-1 text-left">
          <h3 className="text-[13.5px] font-600 leading-tight text-neutral-900">{v.name}</h3>
        </button>
        <div className="mt-1 flex flex-wrap gap-1">
          {useCases(v).slice(0, 3).map((t) => (
            <span key={t} className="border px-1.5 py-px font-[family-name:var(--font-a-mono)] text-[9px] uppercase tracking-[.05em] text-neutral-600" style={{ borderColor: "#E2E2DF" }}>{t}</span>
          ))}
        </div>

        <div className="mt-auto pt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="tnum text-[22px] font-700 leading-none text-neutral-900">
              {q ? <CountUp to={q.perDay} duration={0.45} separator=" " /> : "—"}
            </span>
            <span className="text-[12px] font-500 text-neutral-500">฿/день</span>
          </div>
          <div className="tnum mt-0.5 font-[family-name:var(--font-a-mono)] text-[10.5px] text-neutral-500">
            {q ? `итого ${thb(q.total)} ฿ за ${days} дн.` : "нет тарифа на этот срок"}
          </div>

          <div className="mt-2 grid grid-cols-[1fr_auto] gap-1.5">
            <button onClick={() => onOpen(v)}
              className="px-2 py-1.5 text-[12px] font-600 transition-colors"
              style={{ background: brand.black, color: brand.white }}>
              Подробнее
            </button>
            <button
              onClick={() => onCompare(v)}
              disabled={disabled && !compared}
              aria-pressed={compared}
              title={compared ? "Убрать из сравнения" : "Добавить к сравнению"}
              className="border px-2 py-1.5 font-[family-name:var(--font-a-mono)] text-[10.5px] uppercase tracking-[.05em] transition-colors disabled:opacity-35"
              style={{
                borderColor: compared ? brand.black : "#D6D6D2",
                background: compared ? brand.yellow : "transparent",
                color: brand.black,
              }}
            >
              {compared ? "✓" : "+"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DirectionA() {
  const today = React.useMemo(() => new Date(2026, 8, 12), []);
  const [range, setRange] = React.useState<DateRange | undefined>({ from: today, to: addDays(today, 6) });
  const [cat, setCat] = React.useState<"motorbike" | "auto" | "bicycle">("motorbike");
  const [facet, setFacet] = React.useState<string>("all");
  const [sort, setSort] = React.useState<"price" | "engine">("price");
  const [compare, setCompare] = React.useState<Vehicle[]>([]);
  const [open, setOpen] = React.useState<Vehicle | null>(null);
  const [trayOpen, setTrayOpen] = React.useState(false);

  const days = React.useMemo(() => {
    if (!range?.from || !range?.to) return 1;
    return Math.max(1, differenceInCalendarDays(range.to, range.from) + 1);
  }, [range]);

  const pool = cat === "motorbike" ? motorbikes : cat === "auto" ? cars : bicycles;
  const list = React.useMemo(() => {
    const f = pool.filter((v) =>
      facet === "all" ? true :
      facet === "keyless" ? v.keyless :
      facet === "abs" ? v.abs :
      facet === "new" ? v.isNew : v.segment === facet);
    return [...f].sort((a, b) =>
      sort === "price"
        ? (quote(a, days)?.perDay ?? 1e9) - (quote(b, days)?.perDay ?? 1e9)
        : (b.engineCc ?? 0) - (a.engineCc ?? 0));
  }, [pool, facet, sort, days]);

  const toggleCompare = (v: Vehicle) =>
    setCompare((c) => c.some((x) => x.slug === v.slug) ? c.filter((x) => x.slug !== v.slug) : c.length >= MAXC ? c : [...c, v]);

  React.useEffect(() => { if (compare.length === 0) setTrayOpen(false); }, [compare.length]);
  React.useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  const rangeLabel = range?.from && range?.to
    ? `${format(range.from, "d MMM", { locale: ru })} — ${format(range.to, "d MMM", { locale: ru })}`
    : "Выберите даты";

  return (
    <div className="font-[family-name:var(--font-a-sans)]" style={{ background: brand.paper, color: brand.black }}>
      {/* ---------- chrome: black plate, the logo's required dark surface ---------- */}
      <header className="sticky z-30" style={{ top: "var(--lab-top, 0px)", background: brand.black }}>
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-3 py-2 sm:px-6">
          <Logo height={26} />
          <nav className="ml-auto hidden gap-5 text-[13px] text-white/70 md:flex">
            <a href="#inventory" className="hover:text-white">Парк</a>
            <a href="#terms" className="hover:text-white">Условия</a>
            <a href="#where" className="hover:text-white">Доставка</a>
          </nav>
          <a href="#book" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-600 md:ml-0"
            style={{ background: brand.green, color: brand.white }}>
            <WhatsApp size={15} /> WhatsApp
          </a>
        </div>
      </header>

      {/* ---------- the hero IS the booking bar + live inventory count ---------- */}
      <section className="border-b bg-white" style={{ borderColor: "#E2E2DF" }}>
        <div className="mx-auto max-w-[1320px] px-3 py-4 sm:px-6 sm:py-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Даты аренды">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex w-full items-center justify-between border px-2.5 py-2 text-left text-[13.5px] font-500"
                      style={{ borderColor: "#D6D6D2", background: brand.white }}>
                      {rangeLabel}
                      <span className="tnum font-[family-name:var(--font-a-mono)] text-[11px] text-neutral-500">{days} дн.</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={1} defaultMonth={today} locale={ru} />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field label="Тип техники">
                <div className="grid grid-cols-3 border" style={{ borderColor: "#D6D6D2", background: brand.white }}>
                  {([["motorbike", "Байки", motorbikes.length], ["auto", "Авто", cars.length], ["bicycle", "Вело", bicycles.length]] as const).map(([id, l, n]) => {
                    const on = cat === id;
                    return (
                      <button key={id} onClick={() => { setCat(id); setFacet("all"); }} aria-pressed={on}
                        className="px-1 py-2 text-[12.5px] font-600 transition-colors"
                        style={{ background: on ? brand.yellow : "transparent", color: brand.black }}>
                        {l} <span className="tnum font-400 text-neutral-500">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Получение">
                <select className="w-full border px-2.5 py-2 text-[13.5px] font-500"
                  style={{ borderColor: "#D6D6D2", background: brand.white, color: brand.black }} defaultValue="Пратумнак">
                  <option>Пратумнак — офис, 0 ฿</option>
                  <option>Наклуа — офис, 0 ฿</option>
                  {deliveryZones.map((z) => <option key={z.zone}>{z.zone} — доставка {z.price} ฿</option>)}
                </select>
              </Field>
            </div>

            <div className="flex items-center gap-3 lg:pb-1">
              <div className="border-l pl-3" style={{ borderColor: "#E2E2DF" }}>
                <div className="tnum text-[26px] font-700 leading-none">{list.length}</div>
                <div className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.1em] text-neutral-500">
                  моделей на {days} дн.
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 max-w-[92ch] text-[12.5px] leading-[1.55] text-neutral-600">
            Все цены ниже — за выбранный период. Посуточный тариф примерно втрое дороже
            месячного, поэтому цена здесь всегда привязана к сроку, а не к слову «от».
          </p>
        </div>
      </section>

      {/* ---------- filters + inventory ---------- */}
      <section id="inventory" className="mx-auto max-w-[1320px] px-3 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <div className="rail flex gap-1.5 overflow-x-auto">
            {[
              { id: "all", l: "Все" },
              ...(cat === "motorbike" ? [
                { id: "scooter", l: "Скутеры" },
                { id: "maxi", l: "Макси" },
                { id: "motorcycle", l: "Мотоциклы" },
                { id: "mini", l: "MSX" },
                { id: "keyless", l: "Keyless" },
                { id: "abs", l: "ABS" },
                { id: "new", l: "Новые" },
              ] : []),
            ].map((f) => {
              const on = facet === f.id;
              return (
                <button key={f.id} onClick={() => setFacet(f.id)} aria-pressed={on}
                  className="shrink-0 border px-2.5 py-1 text-[12.5px] font-500 transition-colors"
                  style={{ borderColor: on ? brand.black : "#D6D6D2", background: on ? brand.yellow : brand.white }}>
                  {f.l}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.1em] text-neutral-500">Сортировка</span>
            {([["price", "Цена"], ["engine", "Объём"]] as const).map(([id, l]) => (
              <button key={id} onClick={() => setSort(id)} aria-pressed={sort === id}
                className="border px-2 py-1 text-[12px] font-500"
                style={{ borderColor: sort === id ? brand.black : "#D6D6D2", background: sort === id ? brand.yellow : brand.white }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((v, i) => (
            <VehicleCard key={v.slug} v={v} days={days} onOpen={setOpen} eager={i < 5}
              onCompare={toggleCompare} compared={compare.some((x) => x.slug === v.slug)}
              disabled={compare.length >= MAXC} />
          ))}
        </div>
      </section>

      {/* ---------- terms + delivery + trust ---------- */}
      <section id="terms" className="border-t bg-white" style={{ borderColor: "#E2E2DF" }}>
        <div className="mx-auto grid max-w-[1320px] gap-6 px-3 py-7 sm:px-6 lg:grid-cols-4">
          {[
            { i: <Passport size={20} sw={1.5} />, h: "Документы", b: "Оригинал загранпаспорта показываете — с него снимают копию и возвращают. С 18 лет. Права категории A обязательны по закону Таиланда." },
            { i: <DepositIcon size={20} sw={1.5} />, h: "Залог", b: `Деньги, ${thb(deposit.min)}–${thb(deposit.max)} ฿ по модели. Паспорт в залог не остаётся.` },
            { i: <Helmet size={20} sw={1.5} />, h: "В цене", b: "Два шлема, замок, полный бак 95-го, страховка до 30 000 ฿ на госпиталь. Авария и угон не покрыты." },
            { i: <Scooter size={20} sw={1.5} />, h: "Доставка", b: `По зонам 150–500 ฿, привозим за ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} минут. Или забрать в офисе бесплатно.` },
          ].map((x) => (
            <div key={x.h} className="border-t-2 pt-2.5" style={{ borderColor: brand.yellow }}>
              <div className="text-neutral-900">{x.i}</div>
              <h3 className="mt-1.5 text-[14px] font-700">{x.h}</h3>
              <p className="mt-1 text-[12.5px] leading-[1.6] text-neutral-600">{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="where" className="mx-auto max-w-[1320px] px-3 py-7 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <h3 className="text-[16px] font-700">Доставка по зонам</h3>
            <table className="mt-2 w-full border-t" style={{ borderColor: brand.black }}>
              <tbody>
                {deliveryZones.map((z) => (
                  <tr key={z.zone} className="border-b" style={{ borderColor: "#E2E2DF" }}>
                    <td className="py-1.5 text-[13px]">{z.zone}</td>
                    <td className="tnum py-1.5 text-right font-[family-name:var(--font-a-mono)] text-[13px] font-600">{z.price} ฿</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {offices.map((o) => (
                <div key={o.id} className="border bg-white p-2.5" style={{ borderColor: "#E2E2DF" }}>
                  <div className="text-[13px] font-600">{o.name}</div>
                  <div className="mt-0.5 text-[12px] leading-[1.5] text-neutral-600">{o.address}</div>
                  <div className="tnum mt-1 font-[family-name:var(--font-a-mono)] text-[12.5px] font-600">{o.phone}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l-2 pl-4" style={{ borderColor: brand.yellow }}>
            <div className="flex items-baseline gap-2">
              <span className="tnum text-[32px] font-700 leading-none">{googleRating.value}</span>
              <span className="text-[12px] text-neutral-500">Google · {googleRating.scale}</span>
            </div>
            <p className="mt-2 text-[13px] leading-[1.65] text-neutral-700">«{reviews[3].text}»</p>
            <p className="mt-1.5 font-[family-name:var(--font-a-mono)] text-[11px] uppercase tracking-[.08em] text-neutral-500">— {reviews[3].author}</p>
          </div>
        </div>
      </section>

      {/* ---------- specimen ---------- */}
      <section className="border-t bg-white" style={{ borderColor: "#E2E2DF" }}>
        <div className="mx-auto grid max-w-[1320px] gap-6 px-3 py-7 sm:px-6 md:grid-cols-3">
          <div>
            <div className="text-[32px] font-700 leading-[1.05] tracking-[-.02em]">Commissioner 700</div>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-neutral-600">Commissioner 400 — гротеск низкого контраста для плотного каталога.</p>
            <p className="tnum mt-1 font-[family-name:var(--font-a-mono)] text-[13px]">IBM Plex Mono · 0123456789 ฿</p>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            {[Passport, DepositIcon, Helmet, Scooter, KeyFob].map((I, i) => (
              <div key={i} className="border p-2" style={{ borderColor: "#E2E2DF" }}><I size={20} sw={1.5} /></div>
            ))}
            <div className="flex items-center gap-1.5 border px-2 py-2" style={{ borderColor: "#E2E2DF", color: brand.green }}>
              <WhatsApp size={18} /><span className="text-[11px] text-neutral-600">канал связи</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["Чёрный", brand.black], ["Жёлтый", brand.yellow], ["Белый", brand.white], ["Красный", brand.red], ["Зелёный", brand.green]].map(([n, c]) => (
              <div key={n}>
                <div className="h-10 w-[76px] border" style={{ background: c, borderColor: "#D6D6D2" }} />
                <div className="mt-1 font-[family-name:var(--font-a-mono)] text-[9px] uppercase tracking-[.06em] text-neutral-500">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- compare tray — A's signature interaction ---------- */}
      {compare.length > 0 && (
        <div className="sticky bottom-0 z-40" style={{ background: brand.black }}>
          <div className="mx-auto max-w-[1320px] px-3 sm:px-6" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <div className="flex items-center gap-2 py-2">
              <button onClick={() => setTrayOpen((o) => !o)} aria-expanded={trayOpen}
                className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] font-600"
                style={{ background: brand.yellow, color: brand.black }}>
                Сравнить {compare.length}/{MAXC}
                <span aria-hidden style={{ transform: trayOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▲</span>
              </button>
              <div className="rail flex gap-1.5 overflow-x-auto">
                {compare.map((v) => (
                  <button key={v.slug} onClick={() => toggleCompare(v)} title="Убрать"
                    className="flex shrink-0 items-center gap-1.5 border border-white/25 px-2 py-1 text-[11.5px] text-white">
                    {v.name} <span className="text-white/50">✕</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setCompare([])} className="ml-auto shrink-0 font-[family-name:var(--font-a-mono)] text-[10.5px] uppercase tracking-[.08em] text-white/55 hover:text-white">
                Очистить
              </button>
            </div>

            {trayOpen && (
              <div className="overflow-x-auto border-t border-white/15 pb-3 pt-3">
                <table className="w-full min-w-[520px] text-left">
                  <thead>
                    <tr>
                      <th className="w-[120px]" />
                      {compare.map((v) => (
                        <th key={v.slug} className="px-2 pb-2 align-bottom">
                          <div className="relative mb-1.5 aspect-[4/3] w-full max-w-[140px] overflow-hidden bg-white/10">
                            {v.images[0] ? <Image src={v.images[0]} alt="" fill sizes="140px" className="object-contain p-1" /> : <NoPhoto />}
                          </div>
                          <div className="text-[12.5px] font-600 text-white">{v.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {([
                      ["Цена за день", (v: Vehicle) => { const q = quote(v, days); return q ? `${thb(q.perDay)} ฿` : "—"; }],
                      ["Итого за срок", (v: Vehicle) => { const q = quote(v, days); return q ? `${thb(q.total)} ฿` : "—"; }],
                      ["Объём", (v: Vehicle) => (v.engineCc ? `${v.engineCc} cc` : "—")],
                      ["Keyless", (v: Vehicle) => (v.keyless ? "да" : "нет")],
                      ["ABS", (v: Vehicle) => (v.abs ? "да" : "нет")],
                      ["Залог", (v: Vehicle) => v.depositLabel ?? "—"],
                      ["Наличие", (v: Vehicle) => v.availabilityLabel ?? "—"],
                      ["Кому подойдёт", (v: Vehicle) => v.forWhom[0] ?? "—"],
                    ] as [string, (v: Vehicle) => string][]).map(([k, get]) => (
                      <tr key={k} className="border-t border-white/12">
                        <th scope="row" className="py-1.5 pr-2 font-[family-name:var(--font-a-mono)] text-[10.5px] font-400 uppercase tracking-[.06em] text-white/50">{k}</th>
                        {compare.map((v) => (
                          <td key={v.slug} className="tnum px-2 py-1.5 text-[12.5px] text-white">{get(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-3 flex items-center gap-1.5 px-3 py-2 text-[13px] font-700"
                  style={{ background: brand.red, color: brand.white }}>
                  Забронировать выбранное
                </button>
                <p className="mt-1 font-[family-name:var(--font-a-mono)] text-[9.5px] uppercase tracking-[.08em] text-white/40">
                  Прототип · заявка не отправляется
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- model detail: a side sheet, not a page ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55" onClick={() => setOpen(null)} role="presentation">
          <aside
            className="h-full w-full max-w-[560px] overflow-y-auto bg-white"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label={open.name}
          >
            <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5" style={{ background: brand.black }}>
              <span className="text-[13.5px] font-600 text-white">{open.name}</span>
              <button onClick={() => setOpen(null)} autoFocus
                className="ml-auto border border-white/30 px-2.5 py-1 text-[12.5px] text-white">Закрыть ✕</button>
            </div>

            <div className="relative aspect-[4/3] bg-[#F1F1EE]">
              {open.images[0] ? <Image src={open.images[0]} alt={open.name} fill sizes="560px" className="object-contain p-2" /> : <NoPhoto tone="light" />}
            </div>
            {open.images.length > 1 && (
              <div className="rail flex gap-1.5 overflow-x-auto p-2">
                {open.images.slice(1).map((src) => (
                  <div key={src} className="relative h-14 w-20 shrink-0 bg-[#F1F1EE]">
                    <Image src={src} alt="" fill sizes="80px" className="object-contain p-0.5" />
                  </div>
                ))}
              </div>
            )}

            <div className="p-4">
              <div className="border p-3" style={{ borderColor: "#E2E2DF" }}>
                <div className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.12em] text-neutral-500">
                  {rangeLabel} · {days} дн.
                </div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="tnum text-[34px] font-700 leading-none">{quote(open, days) ? thb(quote(open, days)!.perDay) : "—"}</span>
                  <span className="text-[15px] font-500 text-neutral-500">฿/день</span>
                </div>
                <dl className="mt-2.5 space-y-1 text-[12.5px]">
                  {[
                    ["Итого за срок", quote(open, days) ? `${thb(quote(open, days)!.total)} ฿` : "—"],
                    ["Залог (возвратный)", open.depositLabel ?? "—"],
                    ["Наличие", open.availabilityLabel ?? "—"],
                  ].map(([k, val]) => (
                    <div key={k} className="flex justify-between gap-3 border-b pb-1" style={{ borderColor: "#EFEFEC" }}>
                      <dt className="text-neutral-500">{k}</dt><dd className="tnum font-600">{val}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <button className="flex items-center justify-center gap-1.5 py-2 text-[13px] font-700"
                    style={{ background: brand.green, color: brand.white }}>
                    <WhatsApp size={16} /> Написать
                  </button>
                  <button className="py-2 text-[13px] font-700" style={{ background: brand.red, color: brand.white }}>
                    Забронировать
                  </button>
                </div>
                <p className="mt-1.5 font-[family-name:var(--font-a-mono)] text-[9.5px] uppercase tracking-[.08em] text-neutral-400">
                  Прототип · ничего не отправляется
                </p>
              </div>

              {open.verdict && <p className="mt-4 text-[13.5px] leading-[1.65] text-neutral-700">{open.verdict}</p>}

              {open.pros.length > 0 && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.12em] text-neutral-500">Плюсы</h4>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] leading-[1.55] text-neutral-700">
                      {open.pros.map((x) => <li key={x} className="border-l-2 pl-2" style={{ borderColor: brand.yellow }}>{x}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-a-mono)] text-[10px] uppercase tracking-[.12em] text-neutral-500">Минусы</h4>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] leading-[1.55] text-neutral-600">
                      {open.cons.map((x) => <li key={x} className="border-l-2 border-neutral-300 pl-2">{x}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              <dl className="mt-4 border-t" style={{ borderColor: brand.black }}>
                {open.specs.map((s) => (
                  <div key={s.label} className="flex gap-4 border-b py-1.5" style={{ borderColor: "#EFEFEC" }}>
                    <dt className="w-[40%] shrink-0 font-[family-name:var(--font-a-mono)] text-[11px] text-neutral-500">{s.label}</dt>
                    <dd className="text-[12.5px] leading-[1.5]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
