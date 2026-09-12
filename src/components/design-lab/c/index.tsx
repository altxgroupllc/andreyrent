"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/animate-ui/components/radix/toggle-group";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motorbikes, cars, bicycles, quote, type Vehicle } from "@/content/vehicles";
import { deposit, extraCharges } from "@/content/pricing";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { rentalRules, insurance } from "@/content/rules";
import { googleRating, reviews } from "@/content/reviews";
import { brand } from "@/content/brand";
import { Logo } from "@/components/brand/logo";
import { thb, useCases, savingVsDaily, draftBookingMessage } from "@/lib/rental";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, Pin, Clock, WhatsApp, LineApp } from "../icons";
import { NoPhoto } from "../no-photo";

/* ================================================================== *
 * C — FAST LOCAL RENTAL
 * Mobile-first utility. Desktop is the phone column plus a reference rail — not the
 * other way round.
 *
 * Entry is a three-question chooser (зачем / на сколько / куда), answered with taps,
 * that resolves straight to matches. Duration is a ± stepper on real day counts, not
 * fixed tiers, so the tariff boundary is something you feel. Navigation is a bottom
 * tab bar; search is a command palette for people who already know the model.
 * ================================================================== */

type Need = "city" | "two" | "highway" | "cheap";
type Tab = "find" | "fleet" | "terms" | "contact";

const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "cheap", label: "Подешевле", hint: "самый дешёвый день" },
  { id: "city", label: "По городу", hint: "110–125 cc" },
  { id: "two", label: "Вдвоём", hint: "150 cc и выше" },
  { id: "highway", label: "Подальше", hint: "300 cc и выше" },
];

function matches(v: Vehicle, need: Need) {
  const cc = v.engineCc ?? 0;
  if (need === "city") return cc > 0 && cc <= 125;
  if (need === "two") return cc >= 150;
  if (need === "highway") return cc >= 300;
  return true;
}

/** Duration stepper — C's price-duration model. Real day counts, tariff named as you cross it. */
function DayStepper({ days, setDays }: { days: number; setDays: (n: number) => void }) {
  const clamp = (n: number) => Math.min(120, Math.max(1, n));
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setDays(clamp(days - 1))} aria-label="На день меньше"
        className="h-10 w-10 shrink-0 rounded-lg text-[19px] font-700 transition-colors"
        style={{ background: brand.ink800, color: brand.white }}>−</button>
      <div className="flex-1 rounded-lg px-3 py-1.5 text-center" style={{ background: brand.ink900 }}>
        <div className="tnum font-[family-name:var(--font-c-mono)] text-[21px] font-700 leading-tight" style={{ color: brand.yellow }}>
          {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"}
        </div>
        <div className="font-[family-name:var(--font-c-mono)] text-[10px] uppercase tracking-[.1em] text-white/45">
          тариф «{quote(motorbikes[0], days)?.tier ?? "—"}»
        </div>
      </div>
      <button onClick={() => setDays(clamp(days + 1))} aria-label="На день больше"
        className="h-10 w-10 shrink-0 rounded-lg text-[19px] font-700 transition-colors"
        style={{ background: brand.ink800, color: brand.white }}>+</button>
    </div>
  );
}

function Row({ v, days, onOpen }: { v: Vehicle; days: number; onOpen: (v: Vehicle) => void }) {
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  return (
    <button onClick={() => onOpen(v)}
      className="flex w-full items-center gap-2.5 rounded-xl border bg-white p-2 text-left transition-colors active:scale-[.995]"
      style={{ borderColor: "#E6E6E2" }}>
      <div className="relative aspect-square w-[62px] shrink-0 overflow-hidden rounded-lg" style={{ background: "#F1F1EE" }}>
        {v.images[0] ? <Image src={v.images[0]} alt="" fill sizes="62px" className="object-cover" /> : <NoPhoto tone="light" label="" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13.5px] font-600 text-neutral-900">{v.name}</span>
          {!v.available && (
            <span className="shrink-0 rounded px-1.5 py-px font-[family-name:var(--font-c-mono)] text-[9px] uppercase"
              style={{ background: brand.black, color: brand.yellow }}>{v.availabilityLabel}</span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {useCases(v).slice(0, 3).map((t) => (
            <span key={t} className="rounded px-1.5 py-px font-[family-name:var(--font-c-mono)] text-[9px] uppercase tracking-[.04em] text-neutral-600"
              style={{ background: "#F1F1EE" }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="tnum font-[family-name:var(--font-c-mono)] text-[17px] font-700 leading-none text-neutral-900">
          {q ? thb(q.perDay) : "—"}<span className="text-[11px] font-400 text-neutral-500"> ฿/д</span>
        </div>
        <div className="tnum mt-0.5 font-[family-name:var(--font-c-mono)] text-[10px] text-neutral-500">{q ? `${thb(q.total)} ฿` : ""}</div>
        {save && <div className="mt-0.5 inline-block rounded px-1 font-[family-name:var(--font-c-mono)] text-[9px] font-700" style={{ background: brand.yellow, color: brand.black }}>−{save.pct}%</div>}
      </div>
    </button>
  );
}

export function DirectionC() {
  const [tab, setTab] = React.useState<Tab>("find");
  const [need, setNeed] = React.useState<Need>("cheap");
  const [days, setDays] = React.useState(7);
  const [zone, setZone] = React.useState("Забрать в офисе");
  const [cat, setCat] = React.useState<"motorbike" | "auto" | "bicycle">("motorbike");
  const [open, setOpen] = React.useState<Vehicle | null>(null);
  const [search, setSearch] = React.useState(false);
  const reduce = useReducedMotion();

  const pool = cat === "motorbike" ? motorbikes : cat === "auto" ? cars : bicycles;
  const list = React.useMemo(
    () => pool.filter((v) => matches(v, need)).sort((a, b) => (quote(a, days)?.perDay ?? 1e9) - (quote(b, days)?.perDay ?? 1e9)),
    [pool, need, days],
  );

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearch(true); }
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  const zoneCost = deliveryZones.find((z) => z.zone === zone)?.price ?? 0;
  const q = open ? quote(open, days) : null;

  const Chooser = (
    <div className="space-y-3.5">
      <div>
        <SectionLabel>1 · Что нужно</SectionLabel>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {NEEDS.map((n) => {
            const on = need === n.id;
            return (
              <button key={n.id} onClick={() => setNeed(n.id)} aria-pressed={on}
                className="rounded-xl border px-2.5 py-2 text-left transition-colors"
                style={{ borderColor: on ? brand.black : "#E6E6E2", background: on ? brand.yellow : brand.white }}>
                <div className="text-[13.5px] font-600 text-neutral-900">{n.label}</div>
                <div className="font-[family-name:var(--font-c-mono)] text-[9.5px] uppercase tracking-[.06em] text-neutral-600">{n.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel>2 · На сколько</SectionLabel>
        <div className="mt-1.5 rounded-xl p-2" style={{ background: brand.black }}>
          <DayStepper days={days} setDays={setDays} />
          <ToggleGroup type="single" value={String(days)} onValueChange={(v) => v && setDays(Number(v))}
            data-on-dark
            className="mt-2 !w-full grid grid-cols-5 gap-1">
            {[1, 3, 7, 30, 90].map((d) => (
              <ToggleGroupItem
                key={d}
                value={String(d)}
                /* The primitive does not forward `style` to its button, so state colour is
                   expressed as classes — otherwise the labels compute to black on black. */
                className={`h-7 w-full min-w-0 rounded-md px-0 font-[family-name:var(--font-c-mono)] text-[10.5px] font-500 uppercase ${
                  days === d ? "!bg-[#FDDD00] !text-[#0A0A0A]" : "!text-white/65 hover:!text-white"
                }`}
              >
                {d < 30 ? `${d} д` : `${d / 30} мес`}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div>
        <SectionLabel>3 · Куда привезти</SectionLabel>
        <select value={zone} onChange={(e) => setZone(e.target.value)}
          className="mt-1.5 w-full rounded-xl border px-2.5 py-2.5 text-[13.5px] font-500"
          style={{ borderColor: "#E6E6E2", background: brand.white, color: brand.black }}>
          <option>Забрать в офисе</option>
          {deliveryZones.map((z) => <option key={z.zone} value={z.zone}>{z.zone} — {z.price} ฿</option>)}
        </select>
        <p className="mt-1.5 flex items-center gap-1.5 font-[family-name:var(--font-c-mono)] text-[10.5px] text-neutral-500">
          <Clock size={12} sw={1.75} />
          {zoneCost ? `доставка ${zoneCost} ฿ · ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} мин` : "2 офиса · 10:00–20:00 · бесплатно"}
        </p>
      </div>

      <div className="rounded-xl px-3 py-2.5" style={{ background: brand.yellow }}>
        <div className="tnum text-[13px] font-700 text-neutral-900">
          Подходит {list.length} из {pool.length}
        </div>
        <div className="font-[family-name:var(--font-c-mono)] text-[10.5px] text-neutral-800">
          от {list.length ? thb(quote(list[0], days)?.perDay ?? 0) : "—"} ฿/день на {days} дн.
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-[family-name:var(--font-c-sans)]" style={{ background: "#F4F4F1", color: brand.black }}>
      <header className="sticky z-30" style={{ top: "var(--lab-top, 0px)", background: brand.black }}>
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-3 py-2">
          <Logo height={24} />
          <button onClick={() => setSearch(true)}
            className="ml-auto flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-white/60"
            style={{ background: brand.ink800 }}>
            Поиск модели
            <kbd className="hidden font-[family-name:var(--font-c-mono)] text-[10px] text-white/40 sm:inline">⌘K</kbd>
          </button>
          <a href="#contact" aria-label="Написать в WhatsApp"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12.5px] font-600"
            style={{ background: brand.green, color: brand.white }}>
            <WhatsApp size={16} />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-3 pb-24 pt-3 lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-5 lg:pb-8">
        {/* ---- left: the chooser (the whole hero on mobile) ---- */}
        <div className={tab === "find" ? "block" : "hidden lg:block"}>
          <h1 className="text-[21px] font-700 leading-[1.2] tracking-[-.015em]">
            Байк в Паттайе за три касания
          </h1>
          <p className="mt-1 text-[13px] leading-[1.5] text-neutral-600">
            Ответьте на три вопроса — увидите подходящие модели с реальной ценой за ваш срок,
            залогом и доставкой.
          </p>
          <div className="mt-3">{Chooser}</div>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {[
              { i: <Passport size={16} sw={1.75} />, t: "Паспорт у вас" },
              { i: <DepositIcon size={16} sw={1.75} />, t: `Залог ${thb(deposit.min)}–${thb(deposit.max)} ฿` },
              { i: <Helmet size={16} sw={1.75} />, t: "2 шлема в цене" },
              { i: <Scooter size={16} sw={1.75} />, t: `Привоз ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} мин` },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 text-[11.5px] font-500" style={{ borderColor: "#E6E6E2" }}>
                <span className="text-neutral-700">{x.i}</span>{x.t}
              </div>
            ))}
          </div>
        </div>

        {/* ---- right: results ---- */}
        <div className={tab === "find" || tab === "fleet" ? "mt-4 block lg:mt-0" : "hidden lg:block lg:mt-0"}>
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-700">Подходит на {days} дн.</h2>
            <div className="ml-auto flex gap-1">
              {([["motorbike", "Байки"], ["auto", "Авто"], ["bicycle", "Вело"]] as const).map(([id, l]) => (
                <button key={id} onClick={() => setCat(id)} aria-pressed={cat === id}
                  className="min-h-[30px] rounded-lg border px-2.5 py-1 text-[11.5px] font-600"
                  style={{ borderColor: cat === id ? brand.black : "#E6E6E2", background: cat === id ? brand.yellow : brand.white }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {list.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed p-5 text-center text-[13px] text-neutral-500" style={{ borderColor: "#D9D9D4" }}>
              На этот запрос в выбранной категории ничего нет. Смените тип техники или сценарий.
            </p>
          ) : (
            <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {list.map((v) => <Row key={v.slug} v={v} days={days} onOpen={setOpen} />)}
            </div>
          )}
        </div>

        {/* ---- terms tab ---- */}
        <section id="terms" className={`${tab === "terms" ? "block" : "hidden"} lg:col-span-2 lg:mt-8 lg:block`}>
          <h2 className="text-[15px] font-700">Условия аренды</h2>
          <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {rentalRules.slice(0, 6).map((r) => (
              <div key={r.id} className="rounded-xl border bg-white p-2.5" style={{ borderColor: "#E6E6E2" }}>
                <div className="flex items-baseline gap-1.5">
                  <span className="tnum rounded px-1.5 font-[family-name:var(--font-c-mono)] text-[10px] font-700" style={{ background: brand.yellow, color: brand.black }}>{r.n}</span>
                  <h3 className="text-[13px] font-700">{r.title}</h3>
                </div>
                <p className="mt-1 text-[12px] leading-[1.55] text-neutral-600">{r.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl p-3" style={{ background: brand.black, color: brand.white }}>
            <h3 className="text-[13px] font-700" style={{ color: brand.yellow }}>Страховка покрывает не всё</h3>
            <p className="mt-1 text-[12.5px] leading-[1.6] text-white/70">
              {insurance.covers} Не покрывает: {insurance.doesNotCover.join(", ").toLowerCase()}. {insurance.note}
            </p>
          </div>

          <h3 className="mt-4 text-[14px] font-700">Что может добавиться к счёту</h3>
          <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
            {extraCharges.map((c) => (
              <li key={c.item} className="flex justify-between gap-3 rounded-lg border bg-white px-2.5 py-1.5 text-[12px]" style={{ borderColor: "#E6E6E2" }}>
                <span className="text-neutral-700">{c.item}</span>
                <span className="tnum shrink-0 font-[family-name:var(--font-c-mono)] text-[11.5px] font-700">{c.amount}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- contact tab ---- */}
        <section id="contact" className={`${tab === "contact" ? "block" : "hidden"} lg:col-span-2 lg:mt-8 lg:block`}>
          <h2 className="text-[15px] font-700">Офисы и доставка</h2>
          <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {offices.map((o) => (
              <div key={o.id} className="rounded-xl border bg-white p-3" style={{ borderColor: "#E6E6E2" }}>
                <h3 className="flex items-center gap-1.5 text-[13.5px] font-700"><Pin size={15} sw={1.75} /> {o.name}</h3>
                <p className="mt-1 text-[12px] leading-[1.5] text-neutral-600">{o.address}</p>
                <p className="tnum mt-1 font-[family-name:var(--font-c-mono)] text-[13px] font-700">{o.phone}</p>
                <div className="mt-2 flex gap-1.5">
                  <span className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-600" style={{ background: brand.green, color: brand.white }}>
                    <WhatsApp size={13} /> WhatsApp
                  </span>
                  <span className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-600" style={{ background: brand.lineGreen, color: brand.white }}>
                    <LineApp size={13} /> LINE
                  </span>
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {deliveryZones.map((z) => (
              <li key={z.zone} className="flex justify-between rounded-lg border bg-white px-2.5 py-1.5 text-[12.5px]" style={{ borderColor: "#E6E6E2" }}>
                <span>{z.zone}</span><span className="tnum font-[family-name:var(--font-c-mono)] font-700">{z.price} ฿</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-xl border bg-white p-3" style={{ borderColor: "#E6E6E2" }}>
            <div className="flex items-baseline gap-2">
              <span className="tnum font-[family-name:var(--font-c-mono)] text-[24px] font-700">{googleRating.value}</span>
              <span className="text-[12px] text-neutral-500">Google Reviews</span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-[1.6] text-neutral-700">«{reviews[4].text}» — {reviews[4].author}</p>
          </div>

          <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-3" style={{ borderColor: "#E0E0DC" }}>
            <div>
              <div className="text-[26px] font-700 leading-tight tracking-[-.02em]">Golos Text 700</div>
              <p className="mt-1 text-[12.5px] text-neutral-600">Golos Text 400 — интерфейсный шрифт с настоящей кириллицей.</p>
              <p className="tnum mt-1 font-[family-name:var(--font-c-mono)] text-[12.5px]">JetBrains Mono · 0123456789 ฿</p>
            </div>
            <div className="flex flex-wrap items-start gap-1.5">
              {[Passport, DepositIcon, Helmet, Scooter, Pin, Clock].map((I, i) => (
                <div key={i} className="rounded-lg border bg-white p-2" style={{ borderColor: "#E6E6E2" }}><I size={17} sw={1.75} /></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[["Чёрный", brand.black], ["Жёлтый", brand.yellow], ["Белый", brand.white], ["Красный", brand.red], ["Зелёный", brand.green]].map(([n, c]) => (
                <div key={n}>
                  <div className="h-9 w-[62px] rounded-lg border" style={{ background: c, borderColor: "#D9D9D4" }} />
                  <div className="mt-1 font-[family-name:var(--font-c-mono)] text-[9px] uppercase text-neutral-500">{n}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---- bottom tab bar: C's navigation model ---- */}
      <nav className="sticky bottom-0 z-40 lg:hidden" style={{ background: brand.black }}>
        <div className="grid grid-cols-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {([["find", "Подбор"], ["fleet", "Парк"], ["terms", "Условия"], ["contact", "Контакт"]] as [Tab, string][]).map(([id, l]) => {
            const on = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} aria-current={on ? "page" : undefined}
                className="relative py-2.5 text-[11.5px] font-600 transition-colors"
                style={{ color: on ? brand.yellow : "rgba(255,255,255,.5)" }}>
                {on && <motion.span layoutId="c-tab" className="absolute inset-x-3 top-0 h-[2px]" style={{ background: brand.yellow }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                {l}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ---- command palette search ---- */}
      <CommandDialog open={search} onOpenChange={setSearch} title="Поиск модели" description="Найдите байк по названию">
        <CommandInput placeholder="Honda Click, Forza, PCX…" />
        <CommandList>
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          <CommandGroup heading={`Цены на ${days} дн.`}>
            {[...motorbikes, ...cars, ...bicycles].map((v) => (
              <CommandItem key={v.slug} value={v.name} onSelect={() => { setOpen(v); setSearch(false); }}>
                <span className="flex-1">{v.name}</span>
                <span className="tnum font-[family-name:var(--font-c-mono)] text-[12px] text-neutral-500">
                  {quote(v, days) ? `${thb(quote(v, days)!.perDay)} ฿/д` : "—"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* ---- model detail: bottom sheet on mobile, centred card on desktop ---- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setOpen(null)} role="presentation">
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="max-h-[92svh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-[520px] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label={open.name}
          >
            <div className="sticky top-0 z-10 flex items-center gap-2 rounded-t-2xl bg-white/95 px-3 py-2 backdrop-blur">
              <span className="truncate text-[14px] font-700">{open.name}</span>
              <button onClick={() => setOpen(null)} autoFocus className="ml-auto rounded-lg border px-2.5 py-1 text-[12.5px]" style={{ borderColor: "#E6E6E2" }}>✕</button>
            </div>

            <div className="relative aspect-[16/10]" style={{ background: "#F1F1EE" }}>
              {open.images[0] ? <Image src={open.images[0]} alt={open.name} fill sizes="520px" className="object-cover" /> : <NoPhoto tone="light" />}
            </div>
            {open.images.length > 1 && (
              <div className="rail flex gap-1.5 overflow-x-auto px-3 py-2">
                {open.images.slice(1).map((s) => (
                  <div key={s} className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md" style={{ background: "#F1F1EE" }}>
                    <Image src={s} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="px-3 pb-4">
              <div className="rounded-xl p-3" style={{ background: brand.black, color: brand.white }}>
                <DayStepper days={days} setDays={setDays} />
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="tnum font-[family-name:var(--font-c-mono)] text-[32px] font-700 leading-none" style={{ color: brand.yellow }}>
                    {q ? thb(q.perDay) : "—"}
                  </span>
                  <span className="text-[13px] text-white/60">฿ в день</span>
                </div>
                <dl className="mt-2.5 space-y-1 font-[family-name:var(--font-c-mono)] text-[11.5px]">
                  {[
                    [`Аренда × ${days} дн.`, q ? `${thb(q.total)} ฿` : "—"],
                    ["Доставка", zoneCost ? `${zoneCost} ฿` : "0 ฿ (офис)"],
                    ["Залог (возвратный)", open.depositLabel ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 text-white/60"><dt>{k}</dt><dd className="tnum text-white">{v}</dd></div>
                  ))}
                  <div className="mt-1 flex justify-between gap-3 border-t pt-1.5 text-[13px] font-700" style={{ borderColor: brand.ink700 }}>
                    <dt>К оплате сейчас</dt><dd className="tnum" style={{ color: brand.yellow }}>{q ? thb(q.total + zoneCost) : "—"} ฿</dd>
                  </div>
                </dl>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-1.5">
                  <button className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13.5px] font-700"
                    style={{ background: brand.green, color: brand.white }}>
                    <WhatsApp size={16} /> Написать
                  </button>
                  <button className="rounded-lg px-3 py-2.5 text-[13.5px] font-700" style={{ background: brand.red, color: brand.white }}>
                    Бронь
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg p-2 font-[family-name:var(--font-c-mono)] text-[9.5px] leading-[1.5] text-white/45" style={{ background: brand.ink900 }}>
{draftBookingMessage({ vehicle: open, days, pickup: zone })}
                </pre>
                <p className="mt-1 font-[family-name:var(--font-c-mono)] text-[9px] uppercase tracking-[.08em] text-white/35">
                  Прототип · ничего не отправляется
                </p>
              </div>

              {open.verdict && <p className="mt-3 text-[13px] leading-[1.6] text-neutral-700">{open.verdict}</p>}
              <dl className="mt-3">
                {open.specs.slice(0, 8).map((s) => (
                  <div key={s.label} className="flex gap-3 border-b py-1.5 font-[family-name:var(--font-c-mono)] text-[11.5px]" style={{ borderColor: "#EFEFEC" }}>
                    <dt className="w-[42%] shrink-0 text-neutral-500">{s.label}</dt>
                    <dd className="leading-[1.45]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-[family-name:var(--font-c-mono)] text-[10px] uppercase tracking-[.14em] text-neutral-500">{children}</span>
);

/** Mobile "Фильтр" affordance kept available from the fleet tab. */
export function CFilterDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-lg border px-3 py-2 text-[12.5px] font-600" style={{ borderColor: "#E6E6E2" }}>Подбор</button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md px-4 pt-2" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
          <DrawerTitle className="mb-3 text-[15px] font-700">Подбор</DrawerTitle>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
