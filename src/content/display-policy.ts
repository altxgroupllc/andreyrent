/**
 * Display policy for facts the live site states inconsistently.
 *
 * Every entry maps to a conflict in content/source-conflicts.md and encodes the agreed
 * conservative production behaviour. Nothing here resolves a conflict — it decides what we
 * are willing to SAY while the conflict is open.
 *
 * Rule: if a number is disputed, we do not print the number.
 */
export const displayPolicy = {
  /** C-04 — Jomtien delivery is 250 ฿ on model pages and 100–200 ฿ on its landing page. */
  deliveryPrices: {
    show: false,
    conflict: "C-04",
    copy: "Стоимость доставки зависит от района. Точную сумму подтвердит менеджер при бронировании.",
    note: "Zone NAMES may be listed; zone PRICES may not, until the Jomtien figure is confirmed.",
  },

  /** C-05 — the site simultaneously says a licence is and is not required by the company. */
  licence: {
    conflict: "C-05",
    /** Legally conservative. Thai law is not in dispute; company handover policy is. */
    copy:
      "Для управления мотоциклом в Таиланде нужно действующее водительское удостоверение соответствующей категории: международное (МВУ) категории A или A1, либо тайские права категории A.",
    companyHandoverPolicy: null as string | null,
    note: "Company policy on handing over without a licence stays NEEDS_OWNER_CONFIRMATION and is not published.",
  },

  /** C-10 — cars have no published 1-day price and no stated minimum term. */
  carMinimumTerm: {
    enforce: false,
    show: false,
    conflict: "C-10",
    note: "Do not claim a 3-day minimum. Simply offer the tiers that have published prices.",
  },

  /** C-13 — «Под заказ» is shown but never defined. */
  nonInstantAvailability: {
    conflict: "C-13",
    label: "Под заказ",
    cta: "Уточнить наличие",
    copy: "Эта модель доступна не всегда — уточните наличие на ваши даты.",
    note: "Treat as non-instant availability. Never invent lead time or a booking guarantee.",
  },

  /** C-15 — fuel shortfall is 'cost of missing fuel' on one page, 50 ฿/litre on another. */
  fuelShortfall: {
    showRate: false,
    conflict: "C-15",
    copy: "Байк выдаётся с полным баком и возвращается с полным. Недостающее топливо оплачивается согласно условиям аренды.",
  },

  /** C-02 / C-03 / C-16 — fleet size, the "от 80 ฿" claim and the statistics counter. */
  unverifiedClaims: {
    showFleetSize: false,
    showFromPrice: false,
    showStatistics: false,
    conflicts: ["C-02", "C-03", "C-16"],
    note: "700+ / 800+ / 840 all appear on one page; «от 80 ฿» matches no published tariff; «17 677 клиентов» has no basis.",
  },

  /** C-07 — the bicycle is M600 in one place and M007 in another. */
  bicycleNaming: {
    conflict: "C-07",
    /** Use the brand alone wherever the model number would expose the conflict. */
    displayName: "Велосипед Trinx",
    note: "Do not print M600 or M007 until confirmed.",
  },

  /** C-14 — the Pratumnak address is printed four different ways. */
  officeAddress: {
    showStreetAddress: false,
    conflict: "C-14",
    copy: "Точный адрес и маршрут — по ссылке на карту.",
    note: "Do not invent a canonical variant. Prefer office name + map link.",
  },
} as const;
