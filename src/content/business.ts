// Business facts sourced from the live site. Anything the site states inconsistently
// is NOT asserted here — it is listed in content/source-conflicts.md instead.

export const business = {
  legalName: "Andrei Motorbike Rent Co., Ltd.",
  shortName: "Andrei Motorbike Rent",
  city: "Паттайя",
  country: "Таиланд",
  foundedYear: 2009,
  /** Stated on /ru/about/ as "17 лет на рынке"; 2009→2026 is consistent. */
  yearsOnMarket: 17,
  /** DISPUTED on the live site: 700+ / 800+ / 840. See source-conflicts.md#fleet-size */
  fleetSizeClaim: null as number | null,
  website: "https://rentmotorbike.org",
  email: "rentmotorbikecompanyltd@gmail.com",
  languages: ["Русский", "English", "ไทย", "فارسی"],
  hours: { open: "10:00", close: "20:00", note: "Ежедневно, без обеда и выходных" },
  sourceUrls: [
    "https://rentmotorbike.org/ru/",
    "https://rentmotorbike.org/ru/about/",
  ],
} as const;

/** What the site says is included in every rental. Source: /ru/ and /ru/about/. */
export const included = [
  { label: "Два шлема", detail: "Обрабатываются антисептиком после каждого клиента", source: "/ru/pricing/, /ru/faq/" },
  { label: "Замок от угона", detail: "Предоставляется бесплатно", source: "/ru/faq/" },
  { label: "Полный бак (АИ-95)", detail: "Возврат также с полным баком", source: "/ru/rules/" },
  { label: "Страховка до 30 000 ฿", detail: "Покрывает обращение в госпиталь при травме. Не покрывает аварию, угон и умышленные повреждения.", source: "/ru/faq/" },
  { label: "Замена при поломке", detail: "Оперативная замена транспорта", source: "/ru/about/" },
  { label: "Поддержка на связи", detail: "Весь срок аренды", source: "/ru/pricing/" },
] as const;

/** The company's headline differentiator, stated consistently across pages. */
export const passportPolicy = {
  claim: "Оригинал паспорта не остаётся в залоге",
  detail:
    "Для оформления нужен оригинал загранпаспорта — с него делают копию, проверяют визу и возвращают его вам. В залог принимаются деньги, а не документ.",
  sources: ["/ru/", "/ru/about/", "/ru/rules/", "/ru/faq/", "/ru/pricing/"],
} as const;

export const bookingChannels = [
  { kind: "whatsapp", label: "WhatsApp", value: "+66885205496" },
  { kind: "telegram", label: "Telegram", value: "+66885205496" },
  { kind: "line", label: "LINE", value: null },
  { kind: "phone", label: "Телефон", value: "+66885205496" },
  { kind: "form", label: "Форма на сайте", value: null },
] as const;

/** Exactly what a customer must send to order delivery. Source: /ru/faq/ */
export const deliveryRequestChecklist = [
  "Фото паспорта",
  "Название отеля / кондо и адрес",
  "Номер комнаты или дома, корпус",
  "Локация в Google Maps",
  "Модель мотобайка",
  "Срок аренды и время начала",
  "Количество шлемов (1 или 2)",
] as const;
