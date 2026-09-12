"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motorbikes, cars, bicycles, quote, type Vehicle } from "@/content/vehicles";
import { deposit, extraCharges } from "@/content/pricing";
import { deliveryZones, offices, deliveryEta } from "@/content/locations";
import { rentalRules, insurance } from "@/content/rules";
import { googleRating, reviews } from "@/content/reviews";
import { Logo } from "@/components/brand/logo";
import { thb, useCases, savingVsDaily, draftBookingMessage } from "@/lib/rental";
import { Passport, Deposit as DepositIcon, Helmet, Scooter, Pin, Clock, WhatsApp, LineApp } from "../icons";
import { NoPhoto } from "../no-photo";
import { t, r, dur, easeOut, spring, panelSpring, SmoothNumber, Pressable, Label, Card } from "./system";

/* ================================================================== *
 * C2 — PRECISION RENTAL
 *
 * Product logic is deliberately identical to C: the same three-step chooser,
 * the same day stepper, the same matching list, the same delivery choice and
 * booking path. Only the visual and motion system differs, so the comparison
 * isolates craft rather than architecture.
 * ================================================================== */

type Need = "city" | "two" | "highway" | "cheap";
type Tab = "find" | "fleet" | "terms" | "contact";

const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "cheap", label: "Подешевле", hint: "самый дешёвый день" },
  { id: "city", label: "По городу", hint: "110–125 см³" },
  { id: "two", label: "Вдвоём", hint: "от 150 см³" },
  { id: "highway", label: "Подальше", hint: "от 300 см³" },
];

function matches(v: Vehicle, need: Need) {
  const cc = v.engineCc ?? 0;
  if (need === "city") return cc > 0 && cc <= 125;
  if (need === "two") return cc >= 150;
  if (need === "highway") return cc >= 300;
  return true;
}

const plural = (n: number) => (n === 1 ? "день" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "дня" : "дней");

/* ---------------- duration stepper ---------------- */

function Stepper({ days, setDays, tone = "light" }: { days: number; setDays: (n: number) => void; tone?: "light" | "dark" }) {
  const clamp = (n: number) => Math.min(120, Math.max(1, n));
  const dark = tone === "dark";
  const tier = quote(motorbikes[0], days)?.tier ?? "—";

  const btn: React.CSSProperties = {
    width: 44, height: 44, borderRadius: r.control,
    background: dark ? "rgba(255,255,255,0.08)" : t.surfaceSunken,
    color: dark ? "#FFFFFF" : t.text,
    display: "grid", placeItems: "center",
    fontSize: 20, fontWeight: 400, lineHeight: 1,
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Pressable onClick={() => setDays(clamp(days - 1))} ariaLabel="На день меньше" style={btn} disabled={days <= 1}>
          −
        </Pressable>

        <div className="flex-1 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <SmoothNumber value={days} className="text-[26px] font-600 leading-none" />
            <span className="text-[15px] font-500" style={{ color: dark ? "rgba(255,255,255,.65)" : t.muted }}>
              {plural(days)}
            </span>
          </div>
          <div className="mt-1 text-[12.5px]" style={{ color: dark ? "rgba(255,255,255,.5)" : t.faint }}>
            тариф «{tier}»
          </div>
        </div>

        <Pressable onClick={() => setDays(clamp(days + 1))} ariaLabel="На день больше" style={btn}>
          +
        </Pressable>
      </div>

      {/* presets: a segmented control, selected state carried by the sliding yellow chip */}
      <LayoutGroup id={`c2-presets-${tone}`}>
        <div
          className="mt-2.5 grid grid-cols-5 gap-1 p-1"
          style={{ background: dark ? "rgba(255,255,255,0.06)" : t.surfaceSunken, borderRadius: r.control }}
          role="group"
          aria-label="Быстрый выбор срока"
        >
          {[1, 3, 7, 30, 90].map((d) => {
            const on = days === d;
            return (
              <button
                key={d}
                onClick={() => setDays(d)}
                aria-pressed={on}
                className="relative h-8 rounded-[9px] text-[12.5px] font-500 transition-colors"
                style={{ color: on ? t.text : dark ? "rgba(255,255,255,.7)" : t.muted }}
              >
                {on && (
                  <motion.span
                    layoutId={`c2-preset-${tone}`}
                    className="absolute inset-0 rounded-[9px]"
                    style={{ background: t.yellow }}
                    transition={spring}
                  />
                )}
                <span className="relative">{d < 30 ? `${d} дн.` : `${d / 30} мес.`}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* ---------------- result row ---------------- */

function Row({ v, days, onOpen }: { v: Vehicle; days: number; onOpen: (v: Vehicle) => void }) {
  const q = quote(v, days);
  const save = savingVsDaily(v, days);
  const reduce = useReducedMotion();

  return (
    <motion.button
      layout
      layoutId={`c2-row-${v.slug}`}
      onClick={() => onOpen(v)}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: dur.card, ease: easeOut }}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      className="group flex w-full items-center gap-3 p-2.5 text-left"
      style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card, minHeight: 76 }}
    >
      <div
        className="relative h-[60px] w-[60px] shrink-0 overflow-hidden"
        style={{ background: t.surfaceSunken, borderRadius: r.control }}
      >
        {v.images[0] ? (
          <Image src={v.images[0]} alt="" fill sizes="60px" className="object-contain p-1" />
        ) : (
          <NoPhoto tone="light" label="" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {/* The title owns its line. Availability moves to the metadata row so names
            never lose characters to a status chip. */}
        <span className="block text-[15px] font-500 leading-[1.25] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden" style={{ color: t.text }}>
          {v.name}
        </span>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="truncate text-[12.5px]" style={{ color: t.muted }}>
            {useCases(v).slice(0, 3).join(" · ")}
          </span>
          {!v.available && (
            <span
              className="shrink-0 px-1.5 py-0.5 text-[11px] font-500"
              style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}
            >
              {v.availabilityLabel}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-baseline justify-end gap-1">
          <SmoothNumber value={q?.perDay ?? 0} className="text-[20px] font-600 leading-none" />
          <span className="text-[13px] font-400" style={{ color: t.muted }}>฿/день</span>
        </div>
        <div className="mt-1 flex items-center justify-end gap-1.5">
          <span className="text-[12.5px]" style={{ color: t.faint }}>
            {q ? <><SmoothNumber value={q.total} /> ฿</> : ""}
          </span>
          {save && (
            <span
              className="px-1.5 py-0.5 text-[11px] font-500"
              style={{ background: t.surfaceSunken, color: t.muted, borderRadius: r.badge }}
            >
              −{save.pct}%
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ---------------- direction ---------------- */

export function DirectionC2() {
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

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const zoneCost = deliveryZones.find((z) => z.zone === zone)?.price ?? 0;
  const q = open ? quote(open, days) : null;

  /* Direction of travel matches where the panel lives: up from the bottom on a phone,
     in from the right on a desktop. Measured once per open, not on every render. */
  const [enterFrom, setEnterFrom] = React.useState<{ x?: string; y?: string }>({ y: "100%" });
  React.useEffect(() => {
    if (!open) return;
    setEnterFrom(window.matchMedia("(min-width: 640px)").matches ? { x: "100%" } : { y: "100%" });
  }, [open]);
  const cheapest = list.length ? quote(list[0], days)?.perDay ?? 0 : 0;

  /* ---------- step 1–3 chooser ---------- */
  const Chooser = (
    <div className="space-y-5">
      <section>
        <Label>Шаг 1 · Что нужно</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {NEEDS.map((n) => {
            const on = need === n.id;
            return (
              <Pressable
                key={n.id}
                onClick={() => setNeed(n.id)}
                ariaPressed={on}
                className="px-3 py-2.5 text-left"
                style={{
                  borderRadius: r.control,
                  background: on ? t.yellow : t.surface,
                  border: `1px solid ${on ? "transparent" : t.border}`,
                  boxShadow: on ? "0 1px 2px rgba(17,17,17,.06)" : "none",
                  transition: `background ${dur.control}s, border-color ${dur.control}s`,
                }}
              >
                <span className="block text-[14.5px] font-500" style={{ color: t.text }}>{n.label}</span>
                <span className="mt-0.5 block text-[12.5px]" style={{ color: on ? "rgba(23,23,23,.6)" : t.muted }}>{n.hint}</span>
              </Pressable>
            );
          })}
        </div>
      </section>

      <section>
        <Label>Шаг 2 · На сколько</Label>
        <Card className="mt-2 p-3">
          <Stepper days={days} setDays={setDays} />
        </Card>
      </section>

      <section>
        <Label>Шаг 3 · Куда привезти</Label>
        <div className="mt-2">
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            aria-label="Точка получения"
            className="w-full px-3 py-3 text-[14.5px] font-500 outline-none"
            style={{
              borderRadius: r.control, background: t.surface,
              border: `1px solid ${t.border}`, color: t.text, appearance: "none",
            }}
          >
            <option>Забрать в офисе</option>
            {deliveryZones.map((z) => <option key={z.zone} value={z.zone}>{z.zone} — {z.price} ฿</option>)}
          </select>
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px]" style={{ color: t.muted }}>
            <Clock size={14} sw={1.6} />
            {zoneCost
              ? `Доставка ${zoneCost} ฿ · ${deliveryEta.minMinutes}–${deliveryEta.maxMinutes} минут`
              : "Два офиса · 10:00–20:00 · бесплатно"}
          </p>
        </div>
      </section>

      {/* live result summary — the one place a large yellow surface is earned */}
      <motion.div
        layout
        transition={{ duration: dur.card, ease: easeOut }}
        className="flex items-center gap-3 px-3.5 py-3"
        style={{ background: t.yellow, borderRadius: r.control }}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[14.5px] font-600" style={{ color: t.text }}>
            Подходит <SmoothNumber value={list.length} /> из {pool.length}
          </div>
          <div className="mt-0.5 text-[12.5px]" style={{ color: "rgba(23,23,23,.65)" }}>
            от <SmoothNumber value={cheapest} /> ฿ в день на {days} {plural(days)}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
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
  );

  return (
    <div className="font-[family-name:var(--font-c2)]" style={{ background: t.page, color: t.text }}>
      {/* ---------- header ---------- */}
      <header
        className="sticky z-30"
        style={{
          top: "var(--lab-top, 0px)",
          background: "rgba(21,21,21,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3">
          <Logo height={30} />
          <Pressable
            onClick={() => setSearch(true)}
            className="ml-auto flex items-center gap-2 px-3 py-2 text-[13.5px] font-400"
            style={{ background: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,.78)", borderRadius: r.control }}
          >
            Поиск модели
            <kbd className="hidden text-[11.5px] sm:inline" style={{ color: "rgba(255,255,255,.45)" }}>⌘K</kbd>
          </Pressable>
          <Pressable
            as="a"
            ariaLabel="Написать в WhatsApp"
            className="flex items-center gap-2 px-3 py-2 text-[13.5px] font-500"
            style={{ background: t.green, color: "#FFFFFF", borderRadius: r.control }}
          >
            <WhatsApp size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </Pressable>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 pb-28 pt-6 lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-8 lg:pb-12">
        {/* ---------- left: chooser ---------- */}
        <div className={tab === "find" ? "block" : "hidden lg:block"}>
          <h1 className="text-[31px] font-600 leading-[1.15] tracking-[-.015em]">
            Байк в Паттайе<br />за три шага
          </h1>
          <p className="mt-2.5 max-w-[42ch] text-[15px] leading-[1.55]" style={{ color: t.muted }}>
            Ответьте на три вопроса — увидите подходящие модели с реальной ценой за ваш срок,
            залогом и доставкой.
          </p>
          <div className="mt-6">{Chooser}</div>
        </div>

        {/* ---------- right: results ---------- */}
        <div className={tab === "find" || tab === "fleet" ? "mt-8 block lg:mt-0" : "hidden lg:mt-0 lg:block"}>
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] font-600">Подходит на {days} {plural(days)}</h2>
            <div className="ml-auto flex gap-1.5">
              {([["motorbike", "Байки"], ["auto", "Авто"], ["bicycle", "Вело"]] as const).map(([id, l]) => {
                const on = cat === id;
                return (
                  <Pressable key={id} onClick={() => setCat(id)} ariaPressed={on}
                    className="px-3 py-1.5 text-[13px] font-500"
                    style={{
                      borderRadius: r.control,
                      background: on ? t.yellow : t.surface,
                      border: `1px solid ${on ? "transparent" : t.border}`,
                      color: t.text,
                      minHeight: 32,
                    }}>
                    {l}
                  </Pressable>
                );
              })}
            </div>
          </div>

          {list.length === 0 ? (
            <div className="mt-4 px-5 py-8 text-center text-[14px]"
              style={{ background: t.surface, border: `1px dashed ${t.borderStrong}`, borderRadius: r.card, color: t.muted }}>
              На этот запрос в выбранной категории ничего нет.<br />Смените тип техники или сценарий.
            </div>
          ) : (
            <LayoutGroup id="c2-results">
              <motion.div layout className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  {list.map((v) => <Row key={v.slug} v={v} days={days} onOpen={setOpen} />)}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </div>

        {/* ---------- terms ---------- */}
        <section id="c2-terms" className={`${tab === "terms" ? "block" : "hidden"} mt-10 lg:col-span-2 lg:block`}>
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
                <span style={{ color: t.text }}>{c.item}</span>
                <span className="tnum shrink-0 text-[13px] font-500" style={{ color: t.muted }}>{c.amount}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- contact ---------- */}
        <section id="c2-contact" className={`${tab === "contact" ? "block" : "hidden"} mt-10 lg:col-span-2 lg:block`}>
          <h2 className="text-[19px] font-600">Офисы и доставка</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {offices.map((o) => (
              <Card key={o.id} className="p-4">
                <h3 className="flex items-center gap-2 text-[15px] font-600"><Pin size={16} sw={1.6} /> {o.name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.55]" style={{ color: t.muted }}>{o.address}</p>
                <p className="tnum mt-2 text-[14.5px] font-600">{o.phone}</p>
                <div className="mt-3 flex gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500"
                    style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}>
                    <WhatsApp size={14} /> WhatsApp
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] font-500"
                    style={{ background: t.lineGreen, color: "#FFFFFF", borderRadius: r.button }}>
                    <LineApp size={14} /> LINE
                  </span>
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
            <p className="mt-2 text-[13.5px] leading-[1.65]" style={{ color: t.muted }}>
              «{reviews[4].text}» — {reviews[4].author}
            </p>
          </Card>

          {/* specimen */}
          <div className="mt-8 grid gap-6 border-t pt-6 md:grid-cols-3" style={{ borderColor: t.border }}>
            <div>
              <div className="text-[30px] font-600 leading-[1.15] tracking-[-.015em]">Onest 600</div>
              <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ color: t.muted }}>
                Onest 400/500 — современный интерфейсный шрифт с настоящей кириллицей.
                Моноширинный не используется: точность держится на табличных цифрах.
              </p>
              <p className="tnum mt-2 text-[20px] font-600">0 1 2 3 4 5 6 7 8 9 ฿</p>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              {[Passport, DepositIcon, Helmet, Scooter, Pin, Clock].map((I, i) => (
                <div key={i} className="p-2.5"
                  style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control, color: t.text }}>
                  <I size={18} sw={1.6} />
                </div>
              ))}
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {[["Страница", t.page], ["Поверхность", t.surface], ["Тёмный", t.dark], ["Жёлтый", t.yellow], ["Приглушённый", t.muted]].map(([n, c]) => (
                  <div key={n}>
                    <div className="h-10 w-[68px]" style={{ background: c, border: `1px solid ${t.border}`, borderRadius: r.badge }} />
                    <div className="mt-1 text-[11.5px]" style={{ color: t.muted }}>{n}</div>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[12.5px] leading-[1.5]" style={{ color: t.muted }}>
                Радиусы: контейнер {r.container} · карточка {r.card} · контрол {r.control} · бейдж {r.badge}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- mobile tab bar ---------- */}
      <nav className="sticky bottom-0 z-40 lg:hidden"
        style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderTop: `1px solid ${t.border}` }}>
        <LayoutGroup id="c2-tabs">
          <div className="grid grid-cols-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {([["find", "Подбор"], ["fleet", "Парк"], ["terms", "Условия"], ["contact", "Контакт"]] as [Tab, string][]).map(([id, l]) => {
              const on = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} aria-current={on ? "page" : undefined}
                  className="relative py-3 text-[12.5px] font-500 transition-colors"
                  style={{ color: on ? t.text : t.muted, minHeight: 48 }}>
                  {on && (
                    <motion.span layoutId="c2-tab-pill" className="absolute inset-x-3 inset-y-1.5 -z-0"
                      style={{ background: t.surfaceSunken, borderRadius: r.control }} transition={spring} />
                  )}
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
              <CommandItem key={v.slug} value={v.name} onSelect={() => { setOpen(v); setSearch(false); }}>
                <span className="flex-1">{v.name}</span>
                <span className="tnum text-[13px]" style={{ color: t.muted }}>
                  {quote(v, days) ? `${thb(quote(v, days)!.perDay)} ฿/день` : "—"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* ---------- model detail: sheet on mobile, side panel on desktop ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: dur.control, ease: easeOut }}
            style={{ background: "rgba(17,17,17,0.32)" }}
            onClick={() => setOpen(null)}
            role="presentation"
          >
            <motion.div
              initial={reduce ? { opacity: 0 } : enterFrom}
              animate={reduce ? { opacity: 1 } : { x: 0, y: 0 }}
              exit={reduce ? { opacity: 0 } : enterFrom}
              transition={panelSpring}
              onClick={(e) => e.stopPropagation()}
              role="dialog" aria-modal="true" aria-label={open.name}
              /* Mobile: a sheet rising from the bottom, rounded on top.
                 Desktop: a panel entering from the right, rounded only on the edge that
                 faces the page — a rounded corner against the viewport edge reads as a bug. */
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-[20px] sm:h-full sm:max-h-none sm:max-w-[460px] sm:rounded-t-none sm:rounded-l-[20px]"
              style={{ background: t.page, boxShadow: "0 -1px 40px rgba(17,17,17,.16)" }}
            >
              <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
                style={{ background: "rgba(245,245,243,0.94)", backdropFilter: "blur(12px)" }}>
                <div className="mx-auto absolute left-1/2 top-1.5 h-1 w-9 -translate-x-1/2 sm:hidden"
                  style={{ background: t.borderStrong, borderRadius: 999 }} />
                <span className="truncate text-[15.5px] font-600">{open.name}</span>
                <Pressable onClick={() => setOpen(null)} ariaLabel="Закрыть"
                  className="ml-auto grid h-9 w-9 place-items-center text-[15px]"
                  style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.text }}>
                  ✕
                </Pressable>
              </div>

              <div className="px-4 pb-8">
                <div className="relative aspect-[16/10] overflow-hidden"
                  style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card }}>
                  {open.images[0]
                    ? <Image src={open.images[0]} alt={open.name} fill sizes="460px" className="object-contain p-3" />
                    : <NoPhoto tone="light" />}
                </div>

                {open.images.length > 1 && (
                  <div className="rail mt-2 flex gap-2 overflow-x-auto pb-0.5">
                    {open.images.slice(1).map((s) => (
                      <div key={s} className="relative h-14 w-[72px] shrink-0 overflow-hidden"
                        style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
                        <Image src={s} alt="" fill sizes="72px" className="object-contain p-1" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {useCases(open).map((tag) => (
                    <span key={tag} className="px-2.5 py-1 text-[12.5px] font-500"
                      style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.badge, color: t.muted }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <Card className="mt-4 p-4">
                  <Stepper days={days} setDays={setDays} />

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <SmoothNumber value={q?.perDay ?? 0} className="text-[34px] font-600 leading-none" />
                    <span className="text-[16px] font-500" style={{ color: t.muted }}>฿ в день</span>
                  </div>

                  <dl className="mt-3.5 space-y-2 text-[13.5px]">
                    {[
                      [`Аренда × ${days} ${plural(days)}`, q ? `${thb(q.total)} ฿` : "—"],
                      ["Доставка", zoneCost ? `${zoneCost} ฿` : "0 ฿ (офис)"],
                      ["Залог, возвращается", open.depositLabel ?? "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4">
                        <dt style={{ color: t.muted }}>{k}</dt>
                        <dd className="tnum font-500">{v}</dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t pt-2.5 text-[16px] font-600"
                      style={{ borderColor: t.border }}>
                      <dt>К оплате сейчас</dt>
                      <dd className="flex items-baseline gap-1">
                        <SmoothNumber value={(q?.total ?? 0) + zoneCost} /><span>฿</span>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <Pressable className="flex items-center justify-center gap-2 py-3 text-[14.5px] font-600"
                      style={{ background: t.green, color: "#FFFFFF", borderRadius: r.button }}>
                      <WhatsApp size={17} /> Написать
                    </Pressable>
                    <Pressable className="px-4 py-3 text-[14.5px] font-600"
                      style={{ background: t.red, color: "#FFFFFF", borderRadius: r.button }}>
                      Бронь
                    </Pressable>
                  </div>

                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap p-2.5 text-[11.5px] leading-[1.55]"
                    style={{ background: t.surfaceSunken, borderRadius: r.control, color: t.muted, fontFamily: "inherit" }}>
{draftBookingMessage({ vehicle: open, days, pickup: zone })}
                  </pre>
                  <p className="mt-1.5 text-[11.5px]" style={{ color: t.faint }}>
                    Прототип — сообщение не отправляется
                  </p>
                </Card>

                {open.verdict && (
                  <p className="mt-4 text-[14px] leading-[1.65]" style={{ color: t.muted }}>{open.verdict}</p>
                )}

                <dl className="mt-4">
                  {open.specs.slice(0, 8).map((s) => (
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
    </div>
  );
}

/** Mobile filter affordance, kept identical in logic to C. */
export function C2FilterDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="px-3 py-2 text-[13px] font-500"
          style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.control }}>
          Подбор
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md px-4 pt-2" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
          <DrawerTitle className="mb-3 text-[16px] font-600">Подбор</DrawerTitle>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
