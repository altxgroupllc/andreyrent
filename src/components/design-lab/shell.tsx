"use client";

import * as React from "react";
import { directions, sharedBrand, type DirectionMeta } from "./meta";
import { DirectionA } from "./a";
import { DirectionB } from "./b";
import { DirectionC } from "./c";
import { DirectionC2 } from "./c2";
import { DirectionC3 } from "./c3";
import { brand } from "@/content/brand";

const FRAMES = [
  { id: "desktop", label: "Десктоп", w: null, h: null },
  { id: "laptop", label: "Ноутбук 1280", w: 1280, h: 800 },
  { id: "mobile", label: "Мобильный 390", w: 390, h: 844 },
] as const;

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-neutral-800 pt-2.5">
      <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-neutral-500">{k}</dt>
      <dd className="mt-1 text-[13px] leading-[1.6] text-neutral-300">{children}</dd>
    </div>
  );
}

function MetaPanel({ d }: { d: DirectionMeta }) {
  return (
    <section className="border-t border-neutral-800 bg-neutral-950 px-4 py-7 sm:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[19px] font-semibold text-neutral-100">{d.code} — {d.name}</h3>
          <span className="rounded px-2 py-0.5 font-mono text-[11px] font-semibold" style={{ background: brand.yellow, color: brand.black }}>
            {d.mix}
          </span>
        </div>
        <p className="mt-2 max-w-[80ch] text-[14px] leading-[1.65] text-neutral-300">{d.oneLine}</p>

        <dl className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
          <Row k="Стратегическая идея">{d.strategy}</Row>
          <Row k="UX-модель">{d.uxModel}</Row>
          <Row k="Герой">{d.hero}</Row>
          <Row k="Модель каталога">{d.discovery}</Row>
          <Row k="Навигация">{d.navigation}</Row>
          <Row k="Типографика">{d.typography}</Row>
          <Row k="Типографическая шкала">{d.typeScale}</Row>
          <Row k="Иконки">{d.icons}</Row>
          <Row k="Геометрия">{d.geometry}</Row>
          <Row k="Плотность">{d.density}</Row>
          <Row k="Изображения">{d.imagery}</Row>
          <Row k="Цена ↔ срок">{d.priceInteraction}</Row>
          <Row k="Модель брони">{d.bookingModel}</Row>
          <Row k="Мобильный">{d.mobile}</Row>
          <Row k="Движение">{d.motion}</Row>
          <Row k="Регистры">{d.registries.join(" · ")}</Row>
          <Row k="Компоненты">
            <ul className="space-y-0.5">{d.components.map((c) => <li key={c}>— {c}</li>)}</ul>
          </Row>
          <Row k="Зависимости">{d.deps.join(" · ")}</Row>
        </dl>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="border-l-2 px-3 py-2" style={{ borderColor: brand.yellow, background: "rgba(253,221,0,.06)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: brand.yellow }}>Главное преимущество</div>
            <p className="mt-1 text-[13px] leading-[1.6] text-neutral-200">{d.advantage}</p>
          </div>
          <div className="border-l-2 px-3 py-2" style={{ borderColor: brand.red, background: "rgba(226,35,26,.07)" }}>
            <div className="font-mono text-[10px] uppercase tracking-[.14em] text-rose-400">Главный риск</div>
            <p className="mt-1 text-[13px] leading-[1.6] text-neutral-200">{d.risk}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DesignLab() {
  const [active, setActive] = React.useState<"a" | "b" | "c" | "c2" | "c3">("c3");
  const [frame, setFrame] = React.useState<(typeof FRAMES)[number]["id"]>("desktop");
  const d = directions.find((x) => x.id === active)!;
  const f = FRAMES.find((x) => x.id === frame)!;

  return (
    <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200" style={{ ["--lab-top" as string]: "53px" }}>
      <header className="sticky top-0 z-[60] border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-2.5 sm:px-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-neutral-500">Design Lab · не публичный сайт</div>
            <div className="text-[14px] font-semibold">Andrei Motorbike Rent — один бренд, три продуктовых направления</div>
          </div>

          <div className="ml-auto flex overflow-hidden rounded-md border border-neutral-700">
            {directions.map((x) => (
              <button key={x.id} onClick={() => setActive(x.id)} aria-pressed={active === x.id}
                className="px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                style={active === x.id ? { background: brand.yellow, color: brand.black } : { color: "#a3a3a3" }}>
                {x.code} · {x.name}
              </button>
            ))}
          </div>

          <div className="flex overflow-hidden rounded-md border border-neutral-700">
            {FRAMES.map((x) => (
              <button key={x.id} onClick={() => setFrame(x.id)} aria-pressed={frame === x.id}
                className={`px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  frame === x.id ? "bg-neutral-700 text-neutral-50" : "text-neutral-400 hover:text-neutral-100"
                }`}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* shared brand bar — makes it obvious the three differ by product, not palette */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-neutral-500">Общий бренд</span>
          <div className="flex items-center gap-1.5">
            {[["Чёрный", brand.black], ["Жёлтый", brand.yellow], ["Белый", brand.white]].map(([n, c]) => (
              <span key={n} className="flex items-center gap-1.5 text-[11.5px] text-neutral-400">
                <span className="h-4 w-6 rounded-sm border border-neutral-700" style={{ background: c }} />{n}
              </span>
            ))}
            <span className="ml-2 flex items-center gap-1.5 text-[11.5px] text-neutral-500">
              <span className="h-4 w-6 rounded-sm border border-neutral-700" style={{ background: brand.red }} />красный — только бронь
            </span>
            <span className="flex items-center gap-1.5 text-[11.5px] text-neutral-500">
              <span className="h-4 w-6 rounded-sm border border-neutral-700" style={{ background: brand.green }} />зелёный — только мессенджеры
            </span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">логотип: без изменений</span>
        </div>
      </div>

      {f.w ? (
        <div className="flex justify-center bg-neutral-900 px-2 py-6 sm:px-4">
          <iframe
            key={`${active}-${frame}`}
            src={`/design-lab/frame/${active}`}
            title={`${d.code} — ${d.name} — ${f.label}`}
            className="rounded-lg border border-neutral-700 bg-white shadow-2xl"
            style={{ width: f.w, maxWidth: "100%", height: f.h ?? 800 }}
          />
        </div>
      ) : (
        <div>
          {active === "a" && <DirectionA />}
          {active === "b" && <DirectionB />}
          {active === "c" && <DirectionC />}
          {active === "c2" && <DirectionC2 />}
          {active === "c3" && <DirectionC3 />}
        </div>
      )}

      <MetaPanel d={d} />

      <section className="border-t border-neutral-800 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h3 className="font-mono text-[10px] uppercase tracking-[.2em] text-neutral-500">Зафиксировано брифом для всех трёх</h3>
          <dl className="mt-3 grid gap-x-10 gap-y-3 md:grid-cols-3">
            <Row k="Логотип">{sharedBrand.logo}</Row>
            <Row k="Палитра">{sharedBrand.palette}</Row>
            <Row k="Контраст">{sharedBrand.contrast}</Row>
          </dl>
        </div>
      </section>

      <footer className="border-t border-neutral-800 px-4 py-6 text-[12px] leading-[1.7] text-neutral-500 sm:px-8">
        <div className="mx-auto max-w-[1180px] space-y-1.5">
          <p>
            Модели, цены, залоги, зоны доставки, правила и отзывы взяты с публичных страниц
            rentmotorbike.org (аудит 2026-09-12) и лежат в <code className="text-neutral-400">src/content/</code>.
            Выдуманных метрик, отзывов, наличия и размера парка нет.
          </p>
          <p>
            Противоречия источника — в <code className="text-neutral-400">content/source-conflicts.md</code>,
            в одностороннем порядке не разрешены. Ни одна форма здесь ничего не отправляет.
          </p>
        </div>
      </footer>
    </div>
  );
}
