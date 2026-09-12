"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Calendar } from "@/components/ui/calendar";
import { Card, Chip } from "@/components/system/surfaces";
import { Pressable, PressableLink } from "@/components/system/pressable";
import { t, r, days as pluralDays } from "@/components/system/tokens";
import { quote } from "@/content/vehicles";
import type { VehicleListItem } from "@/content/vehicle-list";
import { path, vehiclePath, type Locale } from "@/content/routes";
import { bookingDemo, demoDepositIn, demoUnit } from "@/content/booking-demo";
import { offices } from "@/content/locations";
import { useRental } from "./use-rental";
import { buildWhatsAppLink } from "./whatsapp-link";
import { Passport, Deposit, WhatsApp } from "@/components/icons";
import { displayName } from "@/components/vehicle/vehicle-name";

type DepositKind = "Наличные" | "Карта" | "Паспорт";
type PaymentKind = "Наличные" | "Карта";
type Currency = "THB" | "EUR" | "RUB" | "USD" | "USDT";
type ClientData = {
  surname: string; name: string; passport: string; expiry: string; birth: string; citizenship: string;
  whatsapp: string; telegram: string; line: string; contact: string; hotel: string; room: string;
};

const steps = ["Правила", "Транспорт", "Срок", "Паспорт", "Контакты", "Залог", "Проверка"];
const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });
const dayMs = 86_400_000;

function toDateInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function dateFromInput(value: string) {
  return new Date(`${value}T12:00:00`);
}

function Selection({ options, value, onChange, columns = 3 }: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 5;
}) {
  return (
    <div className={`grid gap-2 ${columns === 5 ? "grid-cols-5" : columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onClick={() => onChange(option)}
            ariaPressed={selected}
            className="min-h-10 px-2 text-[13px] font-500"
            style={{
              borderRadius: r.button,
              border: `1px solid ${selected ? t.borderSelected : t.border}`,
              background: selected ? t.dark : t.surface,
              color: selected ? "#fff" : t.text,
            }}
          >
            {option}
          </Pressable>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-500" style={{ color: t.muted }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full px-3 text-[14px] outline-none transition focus-visible:ring-2"
        style={{ background: t.surface, border: `1px solid ${t.borderStrong}`, borderRadius: r.button, color: t.text }}
      />
    </label>
  );
}

function Summary({ vehicle, days, startDate, total, deposit, currency }: {
  vehicle: VehicleListItem;
  days: number;
  startDate: Date;
  total: number;
  deposit: DepositKind;
  currency: Currency;
}) {
  const end = new Date(startDate.getTime() + (days - 1) * dayMs);
  const rows = [
    ["Транспорт", displayName(vehicle)],
    ["Начало", dateFormatter.format(startDate)],
    ["Срок", `${days} ${pluralDays(days)}`],
    ["Аренда", `${total.toLocaleString("ru-RU")} ฿`],
    ["Залог", `${demoDepositIn(currency).toLocaleString("ru-RU")} ${currency} · ${deposit.toLowerCase()}`],
    ["Возврат", dateFormatter.format(end)],
  ];
  return (
    <dl className="divide-y" style={{ borderColor: t.border }}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-5 py-3 text-[13.5px]">
          <dt style={{ color: t.muted }}>{label}</dt>
          <dd className="max-w-[58%] text-right font-500">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Browser-only, complete visual path for a rental request. */
export function BookingExperience({ vehicle, locale }: { vehicle: VehicleListItem; locale: Locale }) {
  const [rental, setRental] = useRental();
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [rulesAccepted, setRulesAccepted] = React.useState(false);
  const [startKey, setStartKey] = React.useState(() => toDateInput(new Date()));
  const [passportState, setPassportState] = React.useState<"idle" | "scanning" | "ready">("idle");
  const [payment, setPayment] = React.useState<PaymentKind>("Наличные");
  const [deposit, setDeposit] = React.useState<DepositKind>("Наличные");
  const [currency, setCurrency] = React.useState<Currency>("THB");
  const [depositAccepted, setDepositAccepted] = React.useState(false);
  const [contract, setContract] = React.useState(false);
  const [client, setClient] = React.useState({
    surname: "", name: "", passport: "", expiry: "", birth: "", citizenship: "", whatsapp: "", telegram: "", line: "", contact: "WhatsApp", hotel: "", room: "",
  });
  const bookingAnchorRef = React.useRef<HTMLDivElement>(null);
  const previousStepRef = React.useRef(step);
  const reduceMotion = useReducedMotion();

  const q = quote(vehicle, rental.days);
  const total = q?.total ?? 0;
  const perDay = q?.perDay ?? 0;
  const startDate = dateFromInput(startKey);
  const endDate = new Date(startDate.getTime() + (rental.days - 1) * dayMs);
  const unit = demoUnit(vehicle);
  const bookingNumber = `AMR-${vehicle.slug.slice(0, 3).toUpperCase()}-${String(2600 + (rental.days * 17) % 700)}`;

  const canContinue = [rulesAccepted, true, Boolean(startKey), passportState === "ready", true, depositAccepted, true][step] ?? true;
  const next = () => {
    if (!canContinue) return;
    if (step < steps.length - 1) {
      setDirection(1);
      setStep((current) => current + 1);
    } else setContract(true);
  };
  const previous = () => {
    setDirection(-1);
    setStep((current) => Math.max(0, current - 1));
  };
  const updateClient = (key: keyof typeof client) => (value: string) => setClient((current) => ({ ...current, [key]: value }));
  const startPassportDemo = () => {
    setPassportState("scanning");
    window.setTimeout(() => setPassportState("ready"), 800);
  };

  React.useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const anchor = bookingAnchorRef.current;
    if (!anchor) return;
    const top = anchor.getBoundingClientRect().top + window.scrollY - 64;
    const reduceScrollMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceScrollMotion ? "auto" : "smooth" });
  }, [step]);

  if (contract) {
    return (
      <div className="mx-auto max-w-[720px] px-4 py-10 sm:py-16">
        <FinalScreen vehicle={vehicle} days={rental.days} total={total} bookingNumber={bookingNumber} locale={locale} />
      </div>
    );
  }

  const content = [
    <RulesStep key="rules" accepted={rulesAccepted} onAccepted={setRulesAccepted} />,
    <VehicleStep key="vehicle" vehicle={vehicle} unit={unit} />,
    <DurationStep key="duration" days={rental.days} onDays={(days) => setRental({ days })} startKey={startKey} onStart={setStartKey} endDate={endDate} total={total} perDay={perDay} />,
    <PassportStep key="passport" state={passportState} onStart={startPassportDemo} />,
    <ClientStep key="client" client={client} update={updateClient} />,
    <DepositStep key="deposit" payment={payment} setPayment={setPayment} deposit={deposit} setDeposit={setDeposit} currency={currency} setCurrency={setCurrency} accepted={depositAccepted} setAccepted={setDepositAccepted} />,
    <ReviewStep key="review" vehicle={vehicle} days={rental.days} startDate={startDate} total={total} deposit={deposit} currency={currency} />,
  ][step];

  const enterX = reduceMotion ? 0 : direction * 18;
  const exitX = reduceMotion ? 0 : direction * -12;
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="mx-auto max-w-[1080px] px-4 pb-16 pt-6 sm:pt-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href={vehiclePath(vehicle.category, vehicle.slug, locale)} className="text-[13px] font-500" style={{ color: t.muted }}>← К карточке транспорта</Link>
        <Chip tone="outline">Прототип оформления</Chip>
      </div>
      <div ref={bookingAnchorRef} className="mb-7 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[12px] font-600 uppercase tracking-[.1em]" style={{ color: t.faint }}>Что бронируем?</span>
        <Link href={path.bikes(locale)} className="min-h-9 px-3 py-2 text-[13px] font-500" style={{ background: vehicle.category === "motorbike" ? t.dark : t.surface, color: vehicle.category === "motorbike" ? "#fff" : t.text, border: `1px solid ${vehicle.category === "motorbike" ? t.dark : t.border}`, borderRadius: r.button }}>Байк</Link>
        <Link href={path.cars(locale)} className="min-h-9 px-3 py-2 text-[13px] font-500" style={{ background: vehicle.category === "auto" ? t.dark : t.surface, color: vehicle.category === "auto" ? "#fff" : t.text, border: `1px solid ${vehicle.category === "auto" ? t.dark : t.border}`, borderRadius: r.button }}>Автомобиль</Link>
      </div>
      <div className="grid gap-7 xl:grid-cols-[220px_minmax(0,1fr)] xl:gap-12">
        <aside className="hidden xl:block xl:pt-2">
          <p className="text-[12px] font-600 uppercase tracking-[.12em]" style={{ color: t.faint }}>Заявка на аренду</p>
          <ol className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1">
            {steps.map((title, index) => {
              const active = index === step;
              const complete = index < step;
              return <li key={title} className="shrink-0 lg:flex lg:items-center lg:gap-2.5"><span className="inline-flex h-7 w-7 items-center justify-center text-[12px] font-600 transition-colors duration-200" style={{ borderRadius: 999, background: active ? t.dark : complete ? t.yellow : t.surfaceSunken, color: active ? "#fff" : t.text }}>{complete ? "✓" : index + 1}</span><span className="ml-1.5 text-[13px] transition-colors duration-200 lg:ml-0" style={{ color: active ? t.text : t.muted }}>{title}</span></li>;
            })}
          </ol>
        </aside>
        <main>
          <motion.div layout transition={{ layout: { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] } }}>
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: reduceMotion ? 1 : 0, x: enterX, filter: reduceMotion ? "none" : "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: reduceMotion ? 1 : 0, x: exitX, filter: reduceMotion ? "none" : "blur(1.5px)" }}
                transition={transition}
              >
                <div className="mb-5 flex items-center justify-between"><div><p className="text-[12px] font-600 uppercase tracking-[.1em]" style={{ color: t.faint }}>Шаг {step + 1} из {steps.length}</p><h1 className="mt-1 text-[28px] font-600 tracking-[-.025em]">{steps[step]}</h1></div><span className="text-[13px]" style={{ color: t.muted }}>{displayName(vehicle)}</span></div>
                <Card className="p-4 sm:p-6">{content}</Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div className="mt-4 flex items-center justify-between gap-3">
            {step > 0 ? <Pressable onClick={previous} className="min-h-11 px-4 text-[14px] font-500" style={{ border: `1px solid ${t.borderStrong}`, borderRadius: r.button }}>Назад</Pressable> : <span />}
            <Pressable onClick={next} disabled={!canContinue} className="min-h-11 px-5 text-[14px] font-600 disabled:cursor-not-allowed disabled:opacity-40" style={{ background: t.yellow, color: t.text, borderRadius: r.button }}>{step === steps.length - 1 ? "Оформить договор" : "Далее"}</Pressable>
          </div>
          {!canContinue && <p className="mt-3 text-right text-[12px]" style={{ color: t.muted }}>Чтобы продолжить, завершите этот шаг.</p>}
        </main>
      </div>
    </div>
  );
}

function RulesStep({ accepted, onAccepted }: { accepted: boolean; onAccepted: (value: boolean) => void }) {
  return <><p className="text-[15px] leading-6" style={{ color: t.muted }}>Перед выбором экземпляра прочитайте основные условия аренды.</p><ul className="mt-5 space-y-3">{bookingDemo.rules.map((rule) => <li key={rule} className="flex gap-3 text-[14px] leading-5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0" style={{ background: t.yellow, borderRadius: 999 }} />{rule}</li>)}</ul><label className="mt-6 flex cursor-pointer items-start gap-3 border-t pt-5 text-[13.5px]" style={{ borderColor: t.border }}><input type="checkbox" checked={accepted} onChange={(event) => onAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#151515]" /><span>Я ознакомился с условиями аренды и понимаю, что это демонстрационная заявка.</span></label></>;
}

function VehicleStep({ vehicle, unit }: { vehicle: VehicleListItem; unit: ReturnType<typeof demoUnit> }) {
  const kind = vehicle.category === "auto" ? "автомобиль" : "байк";
  return <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_240px]"><div><p className="text-[15px] leading-6" style={{ color: t.muted }}>Вы выбрали {kind}. Ниже — предварительные данные экземпляра; оператор подтвердит их перед выдачей.</p><dl className="mt-5 grid grid-cols-3 gap-2">{[["Цвет", unit.color], ["Номер", unit.plate], ["Пробег", unit.mileage]].map(([label, value]) => <div key={label} className="p-3" style={{ background: t.surfaceSunken, borderRadius: r.button }}><dt className="text-[11px]" style={{ color: t.muted }}>{label}</dt><dd className="mt-1 text-[13px] font-600">{value}</dd></div>)}</dl></div><div className="relative min-h-44 overflow-hidden" style={{ background: t.surfaceSunken, borderRadius: r.card }}>{vehicle.images[0] && <Image src={vehicle.images[0]} alt={displayName(vehicle)} fill sizes="240px" className="object-contain p-3" />}</div></div>;
}

function DurationStep({ days, onDays, startKey, onStart, endDate, total, perDay }: { days: number; onDays: (value: number) => void; startKey: string; onStart: (value: string) => void; endDate: Date; total: number; perDay: number }) {
  const today = new Date();
  const [choosingEnd, setChoosingEnd] = React.useState(false);
  return <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]"><div><p className="text-[15px] leading-6" style={{ color: t.muted }}>Выберите даты на календаре: первый клик — начало, второй — возврат. Один клик означает один день аренды.</p><label className="mt-4 block"><span className="mb-1.5 block text-[12px] font-500" style={{ color: t.muted }}>Начало аренды</span><input type="date" min={toDateInput(today)} value={startKey} onChange={(event) => onStart(event.target.value)} className="h-11 w-full px-3 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2" style={{ border: `1px solid ${t.borderStrong}`, borderRadius: r.button, background: t.surface }} /></label><div className="mt-4 flex flex-wrap gap-2">{[7, 14, 30, 60, 90].map((value) => <Pressable key={value} onClick={() => onDays(value)} ariaPressed={value === days} className="min-h-10 px-3 text-[13px] font-500" style={{ border: `1px solid ${value === days ? t.borderSelected : t.border}`, background: value === days ? t.dark : t.surface, color: value === days ? "#fff" : t.text, borderRadius: r.button }}>{value} дн.</Pressable>)}</div><div className="mt-3 flex items-center gap-3"><Pressable onClick={() => onDays(Math.max(1, days - 1))} className="h-10 w-10 text-[18px]" style={{ background: t.surfaceSunken, borderRadius: r.button }}>−</Pressable><span className="min-w-20 text-center text-[17px] font-600">{days} {pluralDays(days)}</span><Pressable onClick={() => onDays(Math.min(120, days + 1))} className="h-10 w-10 text-[18px]" style={{ background: t.surfaceSunken, borderRadius: r.button }}>+</Pressable></div></div><div><Calendar mode="range" selected={{ from: dateFromInput(startKey), to: endDate }} onDayClick={(day) => { const clicked = day; const currentStart = dateFromInput(startKey); if (!choosingEnd) { onStart(toDateInput(clicked)); onDays(1); setChoosingEnd(true); return; } const from = clicked < currentStart ? clicked : currentStart; const to = clicked < currentStart ? currentStart : clicked; onStart(toDateInput(from)); onDays(Math.max(1, Math.round((to.getTime() - from.getTime()) / dayMs) + 1)); setChoosingEnd(false); }} disabled={{ before: today }} className="border p-2" style={{ borderColor: t.border, borderRadius: r.card }} /><div className="mt-3 p-3" style={{ background: t.surfaceSunken, borderRadius: r.button }}><p className="text-[12px]" style={{ color: t.muted }}>Возврат</p><p className="mt-1 text-[14px] font-600">{dateFormatter.format(endDate)}</p><p className="mt-3 text-[12px]" style={{ color: t.muted }}>Стоимость аренды</p><p className="mt-1 text-[18px] font-600">{total.toLocaleString("ru-RU")} ฿</p><p className="text-[12px]" style={{ color: t.muted }}>≈ {perDay.toLocaleString("ru-RU")} ฿ / день</p></div></div></div>;
}

function PassportStep({ state, onStart }: { state: "idle" | "scanning" | "ready"; onStart: () => void }) {
  return <><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center" style={{ background: t.surfaceSunken, borderRadius: r.button }}><Passport size={21} /></div><p className="text-[14px] leading-6" style={{ color: t.muted }}>Фото нужно только для формирования заявки. В этом прототипе файл не загружается и данные никуда не отправляются.</p></div><div className="mt-5 grid gap-2 sm:grid-cols-3"><Pressable onClick={onStart} className="min-h-24 p-3 text-left" style={{ border: `1px solid ${t.border}`, borderRadius: r.button }}><strong className="block text-[13px]">Сфотографировать</strong><span className="mt-1 block text-[12px]" style={{ color: t.muted }}>Открыть камеру</span></Pressable><Pressable onClick={onStart} className="min-h-24 p-3 text-left" style={{ border: `1px solid ${t.border}`, borderRadius: r.button }}><strong className="block text-[13px]">Из галереи</strong><span className="mt-1 block text-[12px]" style={{ color: t.muted }}>Выбрать файл</span></Pressable><Pressable onClick={onStart} className="min-h-24 p-3 text-left" style={{ border: `1px solid ${t.border}`, borderRadius: r.button }}><strong className="block text-[13px]">Вручную</strong><span className="mt-1 block text-[12px]" style={{ color: t.muted }}>Перейти к данным</span></Pressable></div>{state !== "idle" && <div className="mt-5 flex items-center gap-3 p-3" style={{ background: t.surfaceSunken, borderRadius: r.button }}><span className="flex h-7 w-7 items-center justify-center font-600" style={{ background: state === "ready" ? t.yellow : t.surface, borderRadius: 999 }}>{state === "ready" ? "✓" : "…"}</span><span className="text-[13px] font-500">{state === "ready" ? "Данные паспорта распознаны — проверьте их на следующем шаге." : "Распознаём паспорт…"}</span></div>}</>;
}

function ClientStep({ client, update }: { client: ClientData; update: (key: keyof ClientData) => (value: string) => void }) {
  return <><p className="text-[14px] leading-6" style={{ color: t.muted }}>Проверьте данные. В демонстрации они остаются только в этом браузере.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Фамилия" value={client.surname} onChange={update("surname")} placeholder="Иванов" /><Field label="Имя" value={client.name} onChange={update("name")} placeholder="Иван" /><Field label="Номер паспорта" value={client.passport} onChange={update("passport")} placeholder="AB1234567" /><Field label="Действителен до" value={client.expiry} onChange={update("expiry")} placeholder="01.01.2032" /><Field label="Дата рождения" value={client.birth} onChange={update("birth")} placeholder="01.01.1990" /><Field label="Гражданство" value={client.citizenship} onChange={update("citizenship")} placeholder="Россия" /><Field label="WhatsApp" value={client.whatsapp} onChange={update("whatsapp")} placeholder="+7…" /><Field label="Telegram" value={client.telegram} onChange={update("telegram")} placeholder="@username" /><Field label="LINE" value={client.line} onChange={update("line")} placeholder="ID в LINE" /><Field label="Отель / кондо" value={client.hotel} onChange={update("hotel")} placeholder="Название" /><Field label="Номер комнаты" value={client.room} onChange={update("room")} placeholder="Номер" /></div><div className="mt-4"><p className="mb-2 text-[12px] font-500" style={{ color: t.muted }}>Предпочтительный способ связи</p><Selection options={["WhatsApp", "Telegram", "LINE"]} value={client.contact} onChange={update("contact")} /></div></>;
}

function DepositStep({ payment, setPayment, deposit, setDeposit, currency, setCurrency, accepted, setAccepted }: { payment: PaymentKind; setPayment: (value: PaymentKind) => void; deposit: DepositKind; setDeposit: (value: DepositKind) => void; currency: Currency; setCurrency: (value: Currency) => void; accepted: boolean; setAccepted: (value: boolean) => void }) {
  const amount = demoDepositIn(currency);
  return <><p className="text-[14px] leading-6" style={{ color: t.muted }}>Выберите, как оплатить аренду и оставить залог. В прототипе оплата не списывается.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><p className="mb-2 text-[12px] font-500" style={{ color: t.muted }}>Способ оплаты</p><Selection options={["Наличные", "Карта"]} value={payment} onChange={(value) => setPayment(value as PaymentKind)} columns={2} /></div><div><p className="mb-2 text-[12px] font-500" style={{ color: t.muted }}>Тип залога</p><Selection options={["Наличные", "Карта", "Паспорт"]} value={deposit} onChange={(value) => setDeposit(value as DepositKind)} /></div></div><div className="mt-5"><p className="mb-2 text-[12px] font-500" style={{ color: t.muted }}>Валюта залога</p><Selection options={["THB", "EUR", "RUB", "USD", "USDT"]} value={currency} onChange={(value) => setCurrency(value as Currency)} columns={5} /></div><div className="mt-5 flex items-center justify-between gap-4 p-4" style={{ background: t.surfaceSunken, borderRadius: r.card }}><div><p className="text-[12px]" style={{ color: t.muted }}>Сумма залога в прототипе</p><p className="mt-1 text-[22px] font-600">{amount.toLocaleString("ru-RU")} {currency}</p><p className="mt-1 text-[11.5px]" style={{ color: t.muted }}>Эквивалент {bookingDemo.deposit.toLocaleString("ru-RU")} ฿ по демонстрационному курсу.</p></div><Deposit size={28} /></div><label className="mt-5 flex cursor-pointer items-start gap-3 text-[13.5px]"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#151515]" /><span>Я прочитал условия аренды и согласен с выбранным способом оплаты и залога.</span></label></>;
}

function ReviewStep({ vehicle, days, startDate, total, deposit, currency }: Parameters<typeof Summary>[0]) {
  return <><p className="text-[14px] leading-6" style={{ color: t.muted }}>Проверьте заявку перед созданием демонстрационного договора.</p><div className="mt-5"><Summary vehicle={vehicle} days={days} startDate={startDate} total={total} deposit={deposit} currency={currency} /></div></>;
}

function DemoQr({ bookingNumber }: { bookingNumber: string }) {
  const finder = (row: number, column: number, startRow: number, startColumn: number) => {
    const y = row - startRow;
    const x = column - startColumn;
    if (x < 0 || x > 6 || y < 0 || y > 6) return null;
    return x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
  };
  return <div className="grid h-44 w-44 grid-cols-[repeat(21,minmax(0,1fr))] gap-px bg-white p-3" style={{ border: `1px solid ${t.border}`, borderRadius: r.card }} aria-label={`QR-код заявки ${bookingNumber}`}>
    {Array.from({ length: 441 }, (_, index) => {
      const row = Math.floor(index / 21);
      const column = index % 21;
      const mark = finder(row, column, 0, 0) ?? finder(row, column, 0, 14) ?? finder(row, column, 14, 0);
      const data = ((row * 17 + column * 11 + bookingNumber.length * 7) % 7 === 0) || ((row + column * 3) % 13 === 0);
      return <span key={index} style={{ background: mark ?? data ? t.dark : "#fff" }} />;
    })}
  </div>;
}

function FinalScreen({ vehicle, days, total, bookingNumber, locale }: { vehicle: VehicleListItem; days: number; total: number; bookingNumber: string; locale: Locale }) {
  const whatsapp = buildWhatsAppLink({ vehicle, days, zone: "office" });
  const kind = vehicle.category === "auto" ? "автомобиля" : "байка";
  const maps = offices[0].mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${offices[0].address} Pattaya`)}`;
  return (
    <Card className="overflow-hidden">
      <div className="p-6 sm:p-8">
        <Chip>Заявка создана</Chip>
        <h1 className="mt-4 text-center text-[29px] font-600 tracking-[-.025em]">Заявка готова</h1>
        <p className="mx-auto mt-2 max-w-[50ch] text-center text-[14px] leading-6" style={{ color: t.muted }}>Покажите QR-код менеджеру при выдаче {kind}, либо отправьте заявку в WhatsApp для подтверждения.</p>
        <div className="mt-6 flex justify-center"><DemoQr bookingNumber={bookingNumber} /></div>
        <p className="mt-3 text-center text-[13px]">Номер заявки: <strong>{bookingNumber}</strong></p>
        <div className="mx-auto mt-5 max-w-[360px] p-4 text-center" style={{ background: t.surfaceSunken, borderRadius: r.card }}>
          <p className="text-[12px]" style={{ color: t.muted }}>К оплате за аренду</p>
          <p className="mt-1 text-[28px] font-600">{total.toLocaleString("ru-RU")} ฿</p>
        </div>
      </div>

      <section className="border-t p-5 sm:p-6" style={{ borderColor: t.border, background: t.surfaceSunken }} aria-labelledby="next-actions">
        <h2 id="next-actions" className="text-[18px] font-600">Что сделать дальше</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <PressableLink href={whatsapp} target="_blank" rel="noopener noreferrer" className="block min-h-[138px] p-4" style={{ background: t.green, color: "#fff", borderRadius: r.card }}>
            <WhatsApp size={20} />
            <strong className="mt-5 block text-[15px]">Отправить в WhatsApp</strong>
            <span className="mt-1 block text-[12px] leading-4" style={{ color: "rgba(255,255,255,.78)" }}>Главное действие: заявка и модель уже будут в сообщении.</span>
          </PressableLink>
          <PressableLink href={maps} target="_blank" rel="noopener noreferrer" className="block min-h-[138px] p-4" style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: r.card }}>
            <span className="text-[18px]" aria-hidden>↗</span>
            <strong className="mt-5 block text-[15px]">Открыть Google Maps</strong>
            <span className="mt-1 block text-[12px] leading-4" style={{ color: t.muted }}>Построить маршрут до офиса выдачи. Все контакты — на отдельной странице.</span>
          </PressableLink>
          <button disabled className="min-h-[138px] p-4 text-left" style={{ background: t.plate, color: t.text, borderRadius: r.card }}>
            <span className="text-[12px] font-600" style={{ color: t.faint }}>СКОРО</span>
            <strong className="mt-5 block text-[15px]">Личный кабинет</strong>
            <span className="mt-1 block text-[12px] leading-4" style={{ color: t.muted }}>Сохраните данные, чтобы не заполнять паспорт и способ оплаты заново.</span>
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: t.muted }}>
          <span>Другие каналы:</span>
          <button disabled className="min-h-8 px-2.5 opacity-45" style={{ border: `1px solid ${t.borderStrong}`, borderRadius: r.button }}>Telegram</button>
          <button disabled className="min-h-8 px-2.5 opacity-45" style={{ border: `1px solid ${t.borderStrong}`, borderRadius: r.button }}>LINE</button>
        </div>
      </section>
    </Card>
  );
}
