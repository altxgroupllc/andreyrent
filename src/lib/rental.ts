import { type Vehicle, quote } from "@/content/vehicles";
import { durationTiers } from "@/content/pricing";

export const thb = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");

/** "350 ฿/день" — always paired with the duration that earns it. Never emit a bare "от X". */
export function perDayLabel(v: Pick<Vehicle, "prices">, days: number) {
  const q = quote(v, days);
  if (!q) return null;
  return { perDay: q.perDay, total: q.total, tier: q.tier, days };
}

export const tierForDays = (days: number) =>
  [...durationTiers].reverse().find((t) => days >= t.days) ?? durationTiers[0];

/** Human label for the saving vs renting the same bike one day at a time. */
export function savingVsDaily(v: Pick<Vehicle, "prices">, days: number) {
  const q = quote(v, days);
  const base = v.prices.day1 ?? v.prices.day3;
  if (!q || !base || days < 3) return null;
  const naive = base * days;
  if (naive <= q.total) return null;
  return { saved: naive - q.total, pct: Math.round((1 - q.total / naive) * 100) };
}

/** Plain-language use-case tags derived from published specs — not invented marketing. */
export function useCases(v: Pick<Vehicle, "engineCc" | "category" | "segment" | "keyless" | "abs">): string[] {
  const tags: string[] = [];
  const cc = v.engineCc ?? 0;
  if (v.category === "motorbike") {
    if (cc <= 125) tags.push("Город");
    if (cc >= 150) tags.push("Вдвоём");
    if (cc >= 300) tags.push("Трасса");
    if (v.segment === "motorcycle") tags.push("Механика");
    if (v.keyless) tags.push("Keyless");
    if (v.abs) tags.push("ABS");
  }
  if (v.category === "auto") tags.push("Авто");
  if (v.category === "bicycle") tags.push("Велосипед");
  return tags;
}

/**
 * Prototype only. Composes the message a customer would send — it is NEVER sent,
 * submitted, or transmitted anywhere. The Design Lab shows the text and nothing else.
 */
export function draftBookingMessage(opts: {
  vehicle: Vehicle | null;
  days: number;
  pickup: string;
}) {
  const q = opts.vehicle ? quote(opts.vehicle, opts.days) : null;
  return [
    "Здравствуйте! Хочу арендовать байк.",
    opts.vehicle ? `Модель: ${opts.vehicle.name}` : null,
    `Срок: ${opts.days} дн.`,
    q ? `Тариф: ${thb(q.perDay)} ฿/день · итого ${thb(q.total)} ฿` : null,
    `Получение: ${opts.pickup}`,
  ]
    .filter(Boolean)
    .join("\n");
}
