"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motorbikes, cars, bicycles, quote, type Vehicle } from "@/content/vehicles";
import { deposit, extraCharges } from "@/content/pricing";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { rentalRules, insurance } from "@/content/rules";
import { googleRating, reviews } from "@/content/reviews";
import { Logo } from "@/components/brand/logo";
import { thb, useCases, savingVsDaily, draftBookingMessage } from "@/lib/rental";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, Pin, Clock, KeyFob, Engine, WhatsApp, LineApp } from "../icons";
import { NoPhoto } from "../no-photo";
import { t, r, dur, easeOut, spring, panelSpring, SmoothNumber, Pressable, Label, Card, PriceBlock, plural } from "./system";

/* ================================================================== *
 * C3 — PRECISION RENTAL · refinement
 *
 * C2's product logic and visual system are unchanged. This pass touches only:
 *   · the motorcycles' presence in the list
 *   · selection and hover language
 *   · price hierarchy bound to the chosen duration
 *   · a coherent results toolbar
 *   · a connected three-step flow
 *   · a compact header
 *   · a quick preview between row and full panel
 * ================================================================== */

type Need = "city" | "two" | "highway" | "cheap";
type Tab = "find" | "fleet" | "terms" | "contact";

const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "cheap", label: "Подешевле", hint: "самый дешёвый день" },
  { id: "city", label: "По городу", hint: "110–125 см³" },
  { id: "two", label: "Вдвоём", hint: "от 150 см³" },
  { id: "highway", label: "Подальше", hint: "от 300 см³" },
];

function matchesNeed(v: Vehicle, need: Need) {
  const cc = v.engineCc ?? 0;
  if (need === "city") return cc > 0 && cc <= 125;
  if (need === "two") return cc >= 150;
  if (need === "highway") return cc >= 300;
  return true;
}

/**
 * Attributes that actually change the ride, read off published specs.
 * The row shows two — a third gets clipped by the price column at two-up widths —
 * and the quick preview, which has the width, shows three.
 */
function attributes(v: Vehicle, max = 3): { icon: React.ReactNode; text: string }[] {
  const out: { icon: React.ReactNode; text: string }[] = [];
  if (v.engineCc) out.push({ icon: <Engine size={13} sw={1.6} />, text: `${v.engineCc} см³` });
  if (v.keyless) out.push({ icon: <KeyFob size={13} sw={1.6} />, text: "Keyless" });
  if (v.abs && out.length < max) out.push({ icon: <Scooter size={13} sw={1.6} />, text: "ABS" });
  if (out.length < max) {
    const tag = useCases(v).find((c) => c === "Вдвоём" || c === "Трасса" || c === "Город");
    if (tag) out.push({ icon: <Pin size={13} sw={1.6} />, text: tag });
  }
  return out.slice(0, max);
}

/* ---------------- step flow with a quiet connector ---------------- */

function Step({ n, title, last, children }: { n: number; title: string; last?: boolean; children: React.ReactNode }) {
  return (
    <section className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-x-3">
      <div className="relative flex flex-col items-center">
        <span
          className="tnum z-10 grid h-6 w-6 place-items-center text-[12px] font-600"
          style={{ background: t.surfaceSunken, color: t.muted, borderRadius: 999 }}
        >
          {n}
        </span>
        {/* the connector is the whole visual device — no chevrons, no progress bar */}
        {!last && <span className="absolute top-6 bottom-[-20px] w-px" style={{ background: t.border }} aria-hidden />}
      </div>
      <div className="pb-5">
        <Label>{title}</Label>
        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

/* ---------------- duration stepper (unchanged logic) ---------------- */

function Stepper({ days, setDays }: { days: number; setDays: (n: number) => void }) {
  const clamp = (n: number) => Math.min(120, Math.max(1, n));
  const tier = quote(motorbikes[0], days)?.tier ?? "—";
  const btn: React.CSSProperties = {
    width: 44, height: 44, borderRadius: r.control, background: t.surfaceSunken,
    color: t.text, display: "grid", placeItems: "center", fontSize: 20, lineHeight: 1,
  };
  return (
    <div>
      <div className="flex items-center gap-2">
        <Pressable onClick={() => setDays(clamp(days - 1))} ariaLabel="На день меньше" style={btn} disabled={days <= 1}>−</Pressable>
        <div className="flex-1 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <SmoothNumber value={days} className="text-[26px] font-600 leading-none" />
            <span className="text-[15px] font-500" style={{ color: t.muted }}>{plural(days)}</span>
          </div>
          <div className="mt-1 text-[12.5px]" style={{ color: t.faint }}>тариф «{tier}»</div>
        </div>
        <Pressable onClick={() => setDays(clamp(days + 1))} ariaLabel="На день больше" style={btn}>+</Pressable>
      </div>
      <LayoutGroup id="c3-presets">
        <div className="mt-2.5 grid grid-cols-5 gap-1 p-1" style={{ background: t.surfaceSunken, borderRadius: r.control }}
          role="group" aria-label="Быстрый выбор срока">
          {[1, 3, 7, 30, 90].map((d) => {
            const on = days === d;
            return (
              <button key={d} onClick={() => setDays(d)} aria-pressed={on}
                className="relative h-8 rounded-[9px] text-[12.5px] font-500 transition-colors"
                style={{ color: on ? t.text : t.muted }}>
                {on && <motion.span layoutId="c3-preset" className="absolute inset-0 rounded-[9px]" style={{ background: t.yellow }} transition={spring} />}
                <span className="relative">{d < 30 ? `${d} дн.` : `${d / 30} мес.`}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* ---------------- list row ---------------- */

function Row({
  v, days, selected, onPreview, eager,
}: { v: Vehicle; days: number; selected: boolean; onPreview: (v: Vehicle) => void; eager: boolean }) {
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  const reduce = useReducedMotion();

  return (
    <motion.button
      layout
      onClick={() => onPreview(v)}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: dur.card, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      aria-pressed={selected}
      className="group relative flex w-full items-center gap-3 overflow-hidden p-3 text-left"
      style={{
        background: t.surface,
        border: `1px solid ${selected ? t.borderSelected : t.border}`,
        borderRadius: r.card,
        boxShadow: selected ? "0 1px 3px rgba(17,17,17,.07)" : "none",
        transition: `border-color ${dur.control}s, box-shadow ${dur.control}s`,
      }}
    >
      {/* selection is a yellow edge, not a yellow surface */}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { scaleY: 0 }}
            animate={reduce ? { opacity: 1 } : { scaleY: 1 }}
            exit={reduce ? { opacity: 0 } : { scaleY: 0 }}
            transition={{ duration: dur.control, ease: easeOut }}
            className="absolute left-0 top-0 h-full w-[3px] origin-center"
            style={{ background: t.yellow }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* the motorcycle gets real room: 4:3, 84px on a phone, 96px above it */}
      <div className="relative h-[63px] w-[84px] shrink-0 overflow-hidden sm:h-[72px] sm:w-[96px]"
        style={{ background: t.plate, borderRadius: r.control }}>
        {v.images[0] ? (
          <Image src={v.images[0]} alt="" fill priority={eager} sizes="(max-width:640px) 84px, 96px"
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <NoPhoto tone="light" label="" />
        )}
      </div>

      {/*
        Two aligned rows rather than three columns: the name shares a baseline with the
        total, and the attributes share one with the per-day rate. This is what keeps a
        long model name readable at 390px — the price block no longer eats its column.
      */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span
            className="min-w-0 flex-1 text-[15px] font-500 leading-[1.25]"
            style={{ color: t.text, display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}
          >
            {v.name}
          </span>
          <span className="flex shrink-0 items-baseline gap-1 whitespace-nowrap">
            <SmoothNumber value={q?.total ?? 0} className="text-[20px] font-600 leading-none" />
            <span className="text-[13px] font-500" style={{ color: t.muted }}>฿</span>
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-x-2 overflow-hidden">
            {/* Availability outranks specs: if a bike is «Под заказ» that is the thing to
                read first, so it takes the chip slot and the attribute list shortens.
                One attribute at 390px, two once there is room — a clipped half-word is
                worse than showing less. */}
            {!v.available && (
              <span className="shrink-0 px-1.5 py-0.5 text-[11px] font-500"
                style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}>
                {v.availabilityLabel}
              </span>
            )}
            {attributes(v, v.available ? 2 : 1).map((a, i) => (
              <span key={a.text}
                className={`shrink-0 items-center gap-1 whitespace-nowrap text-[12px] ${i === 0 ? "flex" : "hidden sm:flex"}`}
                style={{ color: t.muted }}>
                {a.icon}{a.text}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12.5px]" style={{ color: t.muted }}>
            <span><SmoothNumber value={q?.perDay ?? 0} /> ฿/день</span>
            {save && (
              <span className="px-1.5 py-0.5 text-[11px] font-500"
                style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}>
                −{save.pct}%
              </span>
            )}
          </div>
        </div>
      </div>

    </motion.button>
  );
}

/* ---------------- quick preview ---------------- */

function QuickPreview({
  v, days, zone, onClose, onDetails, onSelect,
}: {
  v: Vehicle; days: number; zone: string;
  onClose: () => void; onDetails: () => void; onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  const zoneCost = deliveryZones.find((z) => z.zone === zone)?.price ?? 0;
  const [shot, setShot] = React.useState(0);

  React.useEffect(() => { setShot(0); }, [v.slug]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: dur.control, ease: easeOut }}
      style={{ background: "rgba(17,17,17,0.28)" }}
      onClick={onClose} role="presentation"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.99 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
        transition={panelSpring}
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={`${v.name} — быстрый просмотр`}
        className="w-full rounded-t-[20px] sm:max-w-[420px] sm:rounded-[20px]"
        style={{ background: t.surface, boxShadow: "0 8px 48px rgba(17,17,17,.2)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative mx-auto mt-2 h-1 w-9 sm:hidden" style={{ background: t.borderStrong, borderRadius: 999 }} />

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-600 leading-[1.25]">{v.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                {attributes(v).map((a) => (
                  <span key={a.text} className="flex items-center gap-1 text-[12.5px]" style={{ color: t.muted }}>{a.icon}{a.text}</span>
                ))}
              </div>
            </div>
            <Pressable onClick={onClose} ariaLabel="Закрыть просмотр"
              className="grid h-8 w-8 shrink-0 place-items-center text-[14px]"
              style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.text }}>✕</Pressable>
          </div>

          <div className="relative mt-3 aspect-[16/10] overflow-hidden" style={{ background: t.plate, borderRadius: r.card }}>
            {v.images[shot] ? (
              <Image src={v.images[shot]} alt={`${v.name} — фото ${shot + 1}`} fill sizes="420px" className="object-contain p-2" />
            ) : (
              <NoPhoto tone="light" />
            )}
          </div>

          {v.images.length > 1 && (
            <div className="rail mt-2 flex gap-1.5 overflow-x-auto">
              {v.images.slice(0, 5).map((src, i) => (
                <button key={src} onClick={() => setShot(i)} aria-label={`Фото ${i + 1}`}
                  className="relative h-11 w-[58px] shrink-0 overflow-hidden"
                  style={{
                    background: t.plate, borderRadius: r.control,
                    outline: i === shot ? `2px solid ${t.text}` : "none", outlineOffset: -2,
                    opacity: i === shot ? 1 : 0.6,
                  }}>
                  <Image src={src} alt="" fill sizes="58px" className="object-contain p-0.5" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-3.5 flex items-end justify-between gap-4">
            <PriceBlock perDay={q?.perDay ?? 0} total={q?.total ?? 0} days={days} saving={save?.pct ?? null} size="hero" />
            <div className="text-right text-[12.5px]" style={{ color: t.muted }}>
              <div>Залог {v.depositLabel ?? "—"}</div>
              <div className="mt-0.5">{zoneCost ? `Доставка ${zoneCost} ฿` : "Самовывоз, 0 ฿"}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Pressable onClick={onSelect}
              className="py-3 text-[14.5px] font-600"
              style={{ background: t.yellow, color: t.text, borderRadius: r.button }}>
              Выбрать этот байк
            </Pressable>
            <Pressable onClick={onDetails}
              className="px-4 py-3 text-[14.5px] font-500"
              style={{ background: t.surfaceSunken, color: t.text, borderRadius: r.button }}>
              Подробнее
            </Pressable>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- direction ---------------- */

export function DirectionC3() {
  const [tab, setTab] = React.useState<Tab>("find");
  const [need, setNeed] = React.useState<Need>("cheap");
  const [days, setDays] = React.useState(7);
  const [zone, setZone] = React.useState("Забрать в офисе");
  const [cat, setCat] = React.useState<"motorbike" | "auto" | "bicycle">("motorbike");
  const [preview, setPreview] = React.useState<Vehicle | null>(null);
  const [detail, setDetail] = React.useState<Vehicle | null>(null);
  const [chosen, setChosen] = React.useState<Vehicle | null>(null);
  const [search, setSearch] = React.useState(false);
  const reduce = useReducedMotion();

  const pool = cat === "motorbike" ? motorbikes : cat === "auto" ? cars : bicycles;
  const list = React.useMemo(
    () => pool.filter((v) => matchesNeed(v, need)).sort((a, b) => (quote(a, days)?.perDay ?? 1e9) - (quote(b, days)?.perDay ?? 1e9)),
    [pool, need, days],
  );

  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearch(true); }
      if (e.key === "Escape") { setPreview(null); setDetail(null); }
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  React.useEffect(() => {
    if (!preview && !detail) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [preview, detail]);

  const [enterFrom, setEnterFrom] = React.useState<{ x?: string; y?: string }>({ y: "100%" });
  React.useEffect(() => {
    if (!detail) return;
    setEnterFrom(window.matchMedia("(min-width: 640px)").matches ? { x: "100%" } : { y: "100%" });
  }, [detail]);

  const zoneCost = deliveryZones.find((z) => z.zone === zone)?.price ?? 0;
  const q = detail ? quote(detail, days) : null;
  const cheapest = list.length ? quote(list[0], days)?.perDay ?? 0 : 0;

  const catLabel = cat === "motorbike" ? "байки" : cat === "auto" ? "авто" : "велосипеды";

  return (
    <div className="font-[family-name:var(--font-c2)]" style={{ background: t.page, color: t.text }}>
      {/* ---------- compact header ---------- */}
      <header className="sticky z-30" style={{
        top: "var(--lab-top, 0px)",
        background: "rgba(21,21,21,0.93)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}>
        <div className="mx-auto flex h-[52px] max-w-[1320px] items-center gap-3 px-4">
          <Logo height={26} />
          <span className="hidden text-[12.5px] sm:inline" style={{ color: "rgba(255,255,255,.45)" }}>
            Паттайя · Пратумнак и Наклуа · 10:00–20:00
          </span>
          <Pressable onClick={() => setSearch(true)} ariaLabel="Поиск модели"
            className="ml-auto grid h-9 w-9 place-items-center sm:w-auto sm:gap-2 sm:px-3"
            style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,.8)", borderRadius: r.control }}>
            <span className="flex items-center gap-2 text-[13px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Поиск</span>
            </span>
          </Pressable>
          <Pressable as="a" ariaLabel="Написать в WhatsApp"
            className="grid h-9 place-items-center px-3"
            style={{ background: t.green, color: "#FFFFFF", borderRadius: r.control }}>
            <span className="flex items-center gap-2 text-[13px] font-500"><WhatsApp size={16} /><span className="hidden sm:inline">WhatsApp</span></span>
          </Pressable>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 lg:grid lg:grid-cols-[minmax(0,392px)_minmax(0,1fr)] lg:gap-8 lg:pb-12">
        {/* ---------- left: connected three-step flow ---------- */}
        <div className={tab === "find" ? "block" : "hidden lg:block"}>
          <h1 className="text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
            Байк в Паттайе<br />за три шага
          </h1>
          <p className="mt-2.5 max-w-[42ch] text-[15px] leading-[1.55]" style={{ color: t.muted }}>
            Джомтьен, Пратумнак, центр или Наклуа — скажите, что нужно и на сколько,
            и увидите реальную цену за ваш срок.
          </p>

          <div className="mt-6">
            <Step n={1} title="Что нужно">
              <div className="grid grid-cols-2 gap-2">
                {NEEDS.map((n) => {
                  const on = need === n.id;
                  return (
                    <Pressable key={n.id} onClick={() => setNeed(n.id)} ariaPressed={on}
                      className="px-3 py-2.5 text-left"
                      style={{
                        borderRadius: r.control,
                        background: on ? t.yellow : t.surface,
                        border: `1px solid ${on ? "transparent" : t.border}`,
                        transition: `background ${dur.control}s, border-color ${dur.control}s`,
                      }}>
                      <span className="block text-[14.5px] font-500" style={{ color: t.text }}>{n.label}</span>
                      <span className="mt-0.5 block text-[12.5px]" style={{ color: on ? "rgba(23,23,23,.6)" : t.muted }}>{n.hint}</span>
                    </Pressable>
                  );
                })}
              </div>
            </Step>

            <Step n={2} title="На сколько">
              <Card className="p-3"><Stepper days={days} setDays={setDays} /></Card>
            </Step>

            <Step n={3} title="Куда привезти" last>
              <select value={zone} onChange={(e) => setZone(e.target.value)} aria-label="Точка получения"
                className="w-full px-3 py-3 text-[14.5px] font-500 outline-none"
                style={{ borderRadius: r.control, background: t.surface, border: `1px solid ${t.border}`, color: t.text, appearance: "none" }}>
                <option>Забрать в офисе</option>
                {deliveryZones.map((z) => <option key={z.zone} value={z.zone}>{z.zone} — {z.price} ฿</option>)}
              </select>
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px]" style={{ color: t.muted }}>
                <Clock size={14} sw={1.6} />
                {zoneCost ? `Доставка ${zoneCost} ฿ · ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} минут` : "Два офиса · бесплатно"}
              </p>
            </Step>
          </div>

          <motion.div layout transition={{ duration: dur.card, ease: easeOut }}
            className="px-3.5 py-3" style={{ background: t.yellow, borderRadius: r.control }}>
            <div className="text-[14.5px] font-600" style={{ color: t.text }}>
              Подходит <SmoothNumber value={list.length} /> из {pool.length}
            </div>
            <div className="mt-0.5 text-[12.5px]" style={{ color: "rgba(23,23,23,.65)" }}>
              от <SmoothNumber value={cheapest} /> ฿ в день на {days} {plural(days)}
            </div>
          </motion.div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { i: <Passport size={16} sw={1.6} />, tx: "Паспорт остаётся у вас" },
              { i: <DepositIcon size={16} sw={1.6} />, tx: `Залог ${thb(deposit.min)}–${thb(deposit.max)} ฿` },
              { i: <Helmet size={16} sw={1.6} />, tx: "Два шлема в цене" },
              { i: <Scooter size={16} sw={1.6} />, tx: `Привезём за ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} мин` },
            ].map((x) => (
              <div key={x.tx} className="flex items-center gap-2 px-2.5 py-2 text-[12.5px] font-500"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control, color: t.text }}>
                <span style={{ color: t.muted }}>{x.i}</span>{x.tx}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- right: results ---------- */}
        <div className={tab === "find" || tab === "fleet" ? "mt-8 block lg:mt-0" : "hidden lg:mt-0 lg:block"}>
          {/* one coherent toolbar: title, count+tariff, category — same row group */}
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pb-3"
            style={{ borderBottom: `1px solid ${t.border}` }}>
            <div>
              <h2 className="text-[19px] font-600 leading-tight">Подходящие {catLabel}</h2>
              <p className="mt-1 text-[13px]" style={{ color: t.muted }}>
                <SmoothNumber value={list.length} /> {list.length === 1 ? "вариант" : list.length < 5 ? "варианта" : "вариантов"}
                {" · тариф на "}<SmoothNumber value={days} /> {plural(days)}
              </p>
            </div>
            <div className="flex gap-1 p-1" style={{ background: t.surfaceSunken, borderRadius: r.control }}>
              <LayoutGroup id="c3-cat">
                {([["motorbike", "Байки"], ["auto", "Авто"], ["bicycle", "Вело"]] as const).map(([id, l]) => {
                  const on = cat === id;
                  return (
                    <button key={id} onClick={() => setCat(id)} aria-pressed={on}
                      className="relative rounded-[9px] px-3 py-1.5 text-[13px] font-500 transition-colors"
                      style={{ color: on ? t.text : t.muted, minHeight: 32 }}>
                      {on && <motion.span layoutId="c3-cat-pill" className="absolute inset-0 rounded-[9px]"
                        style={{ background: t.surface, boxShadow: "0 1px 2px rgba(17,17,17,.08)" }} transition={spring} />}
                      <span className="relative">{l}</span>
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="mt-4 px-5 py-8 text-center text-[14px]"
              style={{ background: t.surface, border: `1px dashed ${t.borderStrong}`, borderRadius: r.card, color: t.muted }}>
              На этот запрос в выбранной категории ничего нет.<br />Смените тип техники или сценарий.
            </div>
          ) : (
            <LayoutGroup id="c3-results">
              <motion.div layout className="mt-3 grid gap-2 xl:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {list.map((v, i) => (
                    <Row key={v.slug} v={v} days={days} selected={chosen?.slug === v.slug} onPreview={setPreview} eager={i < 4} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </div>

        {/* ---------- terms ---------- */}
        <section id="c3-terms" className={`${tab === "terms" ? "block" : "hidden"} mt-10 lg:col-span-2 lg:block`}>
          <h2 className="text-[19px] font-600">Условия аренды</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {rentalRules.slice(0, 6).map((rule) => (
              <Card key={rule.id} className="p-3.5">
                <div className="flex items-baseline gap-2">
                  <span className="tnum px-1.5 py-0.5 text-[11.5px] font-600"
                    style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}>{rule.n}</span>
                  <h3 className="text-[14.5px] font-600">{rule.title}</h3>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-[1.6]" style={{ color: t.muted }}>{rule.body}</p>
              </Card>
            ))}
          </div>
          <div className="mt-3 p-4" style={{ background: t.dark, borderRadius: r.container }}>
            <h3 className="text-[14.5px] font-600" style={{ color: t.yellow }}>Страховка покрывает не всё</h3>
            <p className="mt-1.5 text-[13.5px] leading-[1.65]" style={{ color: "rgba(255,255,255,.72)" }}>
              {insurance.covers} Не покрывает: {insurance.doesNotCover.join(", ").toLowerCase()}. {insurance.note}
            </p>
          </div>
          <h3 className="mt-6 text-[16px] font-600">Что может добавиться к счёту</h3>
          <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            {extraCharges.map((c) => (
              <li key={c.item} className="flex items-baseline justify-between gap-4 px-3.5 py-2.5 text-[13.5px]"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                <span>{c.item}</span>
                <span className="tnum shrink-0 text-[13px] font-500" style={{ color: t.muted }}>{c.amount}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- contact ---------- */}
        <section id="c3-contact" className={`${tab === "contact" ? "block" : "hidden"} mt-10 lg:col-span-2 lg:block`}>
          <h2 className="text-[19px] font-600">Офисы и доставка</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {offices.map((o) => (
              <Card key={o.id} className="p-4">
                <h3 className="flex items-center gap-2 text-[15px] font-600"><Pin size={16} sw={1.6} /> {o.name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.55]" style={{ color: t.muted }}>{o.address}</p>
                <p className="tnum mt-2 text-[14.5px] font-600">{o.phone}</p>
                <div className="mt-3 flex gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500"
                    style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}><WhatsApp size={14} /> WhatsApp</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500"
                    style={{ background: t.lineGreen, color: "#FFFFFF", borderRadius: r.button }}><LineApp size={14} /> LINE</span>
                </div>
              </Card>
            ))}
          </div>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {deliveryZones.map((z) => (
              <li key={z.zone} className="flex justify-between px-3.5 py-2.5 text-[13.5px]"
                style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                <span>{z.zone}</span><span className="tnum font-600">{z.price} ฿</span>
              </li>
            ))}
          </ul>
          <Card className="mt-3 p-4">
            <div className="flex items-baseline gap-2">
              <span className="tnum text-[26px] font-600">{googleRating.value}</span>
              <span className="text-[13px]" style={{ color: t.muted }}>Google Reviews</span>
            </div>
            <p className="mt-2 text-[13.5px] leading-[1.65]" style={{ color: t.muted }}>«{reviews[4].text}» — {reviews[4].author}</p>
          </Card>
        </section>
      </div>

      {/* ---------- mobile tab bar ---------- */}
      <nav className="sticky bottom-0 z-40 lg:hidden"
        style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderTop: `1px solid ${t.border}` }}>
        <LayoutGroup id="c3-tabs">
          <div className="grid grid-cols-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {([["find", "Подбор"], ["fleet", "Парк"], ["terms", "Условия"], ["contact", "Контакт"]] as [Tab, string][]).map(([id, l]) => {
              const on = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} aria-current={on ? "page" : undefined}
                  className="relative py-3 text-[12.5px] font-500 transition-colors"
                  style={{ color: on ? t.text : t.muted, minHeight: 48 }}>
                  {on && <motion.span layoutId="c3-tab-pill" className="absolute inset-x-3 inset-y-1.5"
                    style={{ background: t.surfaceSunken, borderRadius: r.control }} transition={spring} />}
                  <span className="relative">{l}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </nav>

      {/* ---------- search ---------- */}
      <CommandDialog open={search} onOpenChange={setSearch} title="Поиск модели" description="Найдите байк по названию">
        <CommandInput placeholder="Honda Click, Forza, PCX…" />
        <CommandList>
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          <CommandGroup heading={`Цены на ${days} ${plural(days)}`}>
            {[...motorbikes, ...cars, ...bicycles].map((v) => (
              <CommandItem key={v.slug} value={v.name} onSelect={() => { setPreview(v); setSearch(false); }}>
                <span className="flex-1">{v.name}</span>
                <span className="tnum text-[13px]" style={{ color: t.muted }}>
                  {quote(v, days) ? `${thb(quote(v, days)!.total)} ฿` : "—"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* ---------- quick preview ---------- */}
      <AnimatePresence>
        {preview && (
          <QuickPreview
            v={preview} days={days} zone={zone}
            onClose={() => setPreview(null)}
            onDetails={() => { setDetail(preview); setPreview(null); }}
            onSelect={() => { setChosen(preview); setPreview(null); }}
          />
        )}
      </AnimatePresence>

      {/* ---------- full detail ---------- */}
      <AnimatePresence>
        {detail && (
          <motion.div
            className="fixed inset-0 z-[55] flex items-end justify-center sm:items-stretch sm:justify-end"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: dur.control, ease: easeOut }}
            style={{ background: "rgba(17,17,17,0.32)" }}
            onClick={() => setDetail(null)} role="presentation"
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : enterFrom}
              animate={reduce ? { opacity: 1 } : { x: 0, y: 0 }}
              exit={reduce ? { opacity: 0 } : enterFrom}
              transition={panelSpring}
              onClick={(e) => e.stopPropagation()}
              role="dialog" aria-modal="true" aria-label={detail.name}
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-[20px] sm:h-full sm:max-h-none sm:max-w-[460px] sm:rounded-t-none sm:rounded-l-[20px]"
              style={{ background: t.page, boxShadow: "0 -1px 40px rgba(17,17,17,.16)" }}
            >
              <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
                style={{ background: "rgba(245,245,243,0.94)", backdropFilter: "blur(12px)" }}>
                <span className="truncate text-[15.5px] font-600">{detail.name}</span>
                <Pressable onClick={() => setDetail(null)} ariaLabel="Закрыть"
                  className="ml-auto grid h-9 w-9 place-items-center text-[15px]"
                  style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.text }}>✕</Pressable>
              </div>

              <div className="px-4 pb-8">
                <div className="relative aspect-[16/10] overflow-hidden"
                  style={{ background: t.plate, border: `1px solid ${t.border}`, borderRadius: r.card }}>
                  {detail.images[0]
                    ? <Image src={detail.images[0]} alt={detail.name} fill sizes="460px" className="object-contain p-3" />
                    : <NoPhoto tone="light" />}
                </div>
                {detail.images.length > 1 && (
                  <div className="rail mt-2 flex gap-2 overflow-x-auto pb-0.5">
                    {detail.images.slice(1).map((s) => (
                      <div key={s} className="relative h-14 w-[72px] shrink-0 overflow-hidden"
                        style={{ background: t.plate, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                        <Image src={s} alt="" fill sizes="72px" className="object-contain p-1" />
                      </div>
                    ))}
                  </div>
                )}

                <Card className="mt-4 p-4">
                  <Stepper days={days} setDays={setDays} />
                  <div className="mt-4">
                    <PriceBlock perDay={q?.perDay ?? 0} total={q?.total ?? 0} days={days}
                      saving={savingVsDaily(detail, days)?.pct ?? null} size="hero" />
                  </div>
                  <dl className="mt-3.5 space-y-2 text-[13.5px]">
                    {[
                      ["Доставка", zoneCost ? `${zoneCost} ฿` : "0 ฿ (офис)"],
                      ["Залог, возвращается", detail.depositLabel ?? "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4">
                        <dt style={{ color: t.muted }}>{k}</dt><dd className="tnum font-500">{v}</dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t pt-2.5 text-[16px] font-600" style={{ borderColor: t.border }}>
                      <dt>К оплате сейчас</dt>
                      <dd className="flex items-baseline gap-1"><SmoothNumber value={(q?.total ?? 0) + zoneCost} /><span>฿</span></dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <Pressable className="flex items-center justify-center gap-2 py-3 text-[14.5px] font-600"
                      style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}>
                      <WhatsApp size={17} /> Написать
                    </Pressable>
                    <Pressable className="px-4 py-3 text-[14.5px] font-600"
                      style={{ background: t.red, color: "#FFFFFF", borderRadius: r.button }}>Бронь</Pressable>
                  </div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap p-2.5 text-[11.5px] leading-[1.55]"
                    style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.muted, fontFamily: "inherit" }}>
{draftBookingMessage({ vehicle: detail, days, pickup: zone })}
                  </pre>
                  <p className="mt-1.5 text-[11.5px]" style={{ color: t.faint }}>Прототип — сообщение не отправляется</p>
                </Card>

                {detail.verdict && <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: t.muted }}>{detail.verdict}</p>}

                <dl className="mt-4">
                  {detail.specs.slice(0, 8).map((s) => (
                    <div key={s.label} className="flex gap-4 border-b py-2.5 text-[13.5px]" style={{ borderColor: t.border }}>
                      <dt className="w-[42%] shrink-0" style={{ color: t.muted }}>{s.label}</dt>
                      <dd className="leading-[1.5]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- chosen-bike bar ---------- */}
      <AnimatePresence>
        {chosen && !preview && !detail && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: 80 }} animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: 80 }} transition={panelSpring}
            className="fixed inset-x-0 bottom-0 z-40 lg:bottom-4 lg:left-auto lg:right-4 lg:w-[420px]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 lg:px-4"
              style={{
                background: t.dark, color: "#FFFFFF",
                borderTopLeftRadius: r.container, borderTopRightRadius: r.container,
                boxShadow: "0 -2px 32px rgba(17,17,17,.24)",
              }}>
              <div className="relative h-10 w-[54px] shrink-0 overflow-hidden" style={{ background: "rgba(255,255,255,.08)", borderRadius: 10 }}>
                {chosen.images[0] && <Image src={chosen.images[0]} alt="" fill sizes="54px" className="object-contain p-0.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-500">{chosen.name}</div>
                <div className="text-[12.5px]" style={{ color: "rgba(255,255,255,.6)" }}>
                  <SmoothNumber value={(quote(chosen, days)?.total ?? 0) + zoneCost} /> ฿ за {days} {plural(days)}
                </div>
              </div>
              <Pressable onClick={() => setDetail(chosen)} className="px-3 py-2 text-[13px] font-500"
                style={{ background: "rgba(255,255,255,.12)", color: "#FFFFFF", borderRadius: r.button }}>
                Детали
              </Pressable>
              <Pressable className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-600"
                style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}>
                <WhatsApp size={15} /><span className="hidden sm:inline">Написать</span>
              </Pressable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
