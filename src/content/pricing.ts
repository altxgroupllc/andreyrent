// Source: /ru/pricing/ plus every vehicle detail page (they agree on the ladder).

export interface DurationTier {
  id: string;
  days: number;
  label: string;
  shortLabel: string;
  /** How the total is computed for this tier. */
  billing: "per-day" | "whole-period";
  blurb: string;
}

/** The six published tiers, in the order a customer actually thinks about them. */
export const durationTiers: DurationTier[] = [
  { id: "d1", days: 1, label: "1 день", shortLabel: "1 д", billing: "per-day", blurb: "Короткая поездка, максимальный дневной тариф." },
  { id: "d3", days: 3, label: "3 дня", shortLabel: "3 д", billing: "per-day", blurb: "Цена за день ниже — удобно на выходные." },
  { id: "d7", days: 7, label: "Неделя", shortLabel: "7 д", billing: "per-day", blurb: "Популярный формат на отпуск." },
  { id: "m1", days: 30, label: "Месяц", shortLabel: "1 мес", billing: "whole-period", blurb: "Фиксированная цена целого месяца — самый частый выбор." },
  { id: "m2", days: 60, label: "2 месяца", shortLabel: "2 мес", billing: "whole-period", blurb: "Ниже цена за день для долгой аренды." },
  { id: "m3", days: 90, label: "3 месяца", shortLabel: "3 мес", billing: "whole-period", blurb: "Минимальная цена за день." },
];

export const pricingRules = [
  {
    id: "period-billing",
    title: "30, 60 и 90 дней считаются целым периодом",
    body: "Стоимость месяца — это фиксированная цена, а не «дни × дневной тариф». Поэтому месяц дешевле, чем четыре недели подряд.",
    source: "/ru/pricing/",
  },
  {
    id: "longer-cheaper",
    title: "Чем дольше срок — тем дешевле день",
    body: "Помесячная ставка выходит примерно в 3 раза дешевле посуточной.",
    source: "/ru/pricing/, страницы моделей",
  },
  {
    id: "season",
    title: "Цены зависят от сезона и наличия",
    body: "В высокий сезон стоимость и наличие моделей могут отличаться. Точную цену на ваши даты подтверждает менеджер при бронировании.",
    source: "/ru/pricing/",
  },
  {
    id: "early-return",
    title: "Досрочный возврат не пересчитывается",
    body: "При досрочном возврате деньги за неиспользованные дни не возвращаются. Замена на более дешёвую модель тоже не пересчитывается; замена на более дорогую — доплата разницы плюс 100 ฿ за мойку.",
    source: "/ru/faq/",
  },
  {
    id: "extension",
    title: "Продление считается по тарифу выбранного срока",
    body: "Напишите заранее — продление оформят по соответствующему сроку тарифу.",
    source: "/ru/pricing/",
  },
] as const;

/** Charges a customer can incur beyond the rental rate. Source: /ru/faq/, /ru/rules/. */
export const extraCharges = [
  { item: "Недостающее топливо", amount: "50 ฿ за литр", source: "/ru/faq/" },
  { item: "Потеря обычного шлема", amount: "100 ฿", source: "/ru/faq/" },
  { item: "Потеря шлема со стеклом", amount: "500 ฿", source: "/ru/faq/" },
  { item: "Ремонт прокола (в шиномонтаже)", amount: "200–300 ฿", source: "/ru/faq/" },
  { item: "Сдача байка с пробитым колесом / замена байка", amount: "от 500 ฿", source: "/ru/faq/" },
  { item: "Мойка при замене модели", amount: "100 ฿", source: "/ru/faq/" },
  { item: "Штраф за езду без прав категории A", amount: "500–1 000 ฿ (платит арендатор)", source: "/ru/rules/, /ru/faq/" },
] as const;

export const deposit = {
  label: "Денежный залог",
  min: 2000,
  max: 5000,
  currency: "฿",
  note: "Размер зависит от модели байка. Возможен эквивалент в другой валюте на усмотрение компании.",
  passportNote: "Оригинал паспорта в залог не остаётся.",
  source: "/ru/rules/, страницы моделей",
} as const;
