// Source: /ru/contacts/ (primary), site header and footer (cross-checked).

export interface Office {
  id: string;
  name: string;
  district: string;
  address: string;
  addressVariants: string[];
  /** Verified Google Maps route, preferred over a text-address search when available. */
  mapUrl?: string;
  phone: string;
  hours: string;
  messengers: ("telegram" | "whatsapp" | "line")[];
  sourceUrl: string;
}

export const offices: Office[] = [
  {
    id: "pratumnak",
    name: "Пратумнак",
    district: "Пратумнак / Тапрайя",
    address: "354/101 Thappraya Rd, The Ocean Pearl, Pattaya 20150",
    // The site prints this address three different ways — recorded, not silently merged.
    addressVariants: [
      "354/101 Thappraya Rd, The Ocean Pearl, Pattaya 20150 (/ru/contacts/)",
      "20150 Pattaya, Thappraya rd. Soi 12, The Ocean Pearl, 354/101 (футер)",
      "Пратумнак (Pattaya Park Rd.) (хедер)",
      "354/101 Thap Phraya Road, Pattaya City, Bang Lamung, Chon Buri 20150 (/ru/about/)",
    ],
    mapUrl: "https://maps.app.goo.gl/rxZLHkraxkNMGwmS7",
    phone: "+66-88-520-5496",
    hours: "Ежедневно 10:00 – 20:00",
    messengers: ["telegram", "whatsapp", "line"],
    sourceUrl: "https://rentmotorbike.org/ru/contacts/",
  },
  {
    id: "naklua",
    name: "Северная Паттайя (Наклуа)",
    district: "Наклуа",
    address: "285/106 Moo 5, Naklua Soi 16 (рядом с прачечной Wash Express)",
    addressVariants: [
      "285/106 Moo 5, Naklua Soi 16 (/ru/contacts/)",
      "20150 Pattaya, Naklua 16 Alley, 285/106 (футер)",
    ],
    phone: "+66 65 067 4927",
    hours: "Ежедневно 10:00 – 20:00",
    messengers: ["telegram", "whatsapp", "line"],
    sourceUrl: "https://rentmotorbike.org/ru/contacts/",
  },
];

/**
 * Delivery zones as printed on every vehicle detail page and on /ru/faq/.
 * These two sources agree. A THIRD source (/ru/motorbike-rental-jomtien/)
 * disagrees — see source-conflicts.md#delivery-price.
 */
export interface DeliveryZone { zone: string; price: number; sourceUrls: string[] }

export const deliveryZones: DeliveryZone[] = [
  { zone: "Пратумнак", price: 150, sourceUrls: ["/ru/faq/", "vehicle detail pages"] },
  { zone: "Центр Паттайи и Джомтьен", price: 250, sourceUrls: ["/ru/faq/", "vehicle detail pages"] },
  { zone: "На-Джомтьен и Наклуа", price: 400, sourceUrls: ["/ru/faq/", "vehicle detail pages"] },
  { zone: "Амбассадор и Сукхумвит", price: 500, sourceUrls: ["/ru/faq/", "vehicle detail pages"] },
];

export const deliveryEta = { minMinutes: 30, maxMinutes: 90, source: "/ru/about/" };

/** SEO landing pages that exist today and carry real local search intent. */
export const districtPages = [
  { slug: "motorbike-rental-jomtien", title: "Аренда байка в Джомтьене", district: "Джомтьен" },
  { slug: "motorbike-rental-pratumnak", title: "Аренда байка на Пратумнаке", district: "Пратумнак" },
  { slug: "motorbike-rental-naklua", title: "Аренда байка в Наклуа", district: "Наклуа" },
  { slug: "motorbike-rental-central-pattaya", title: "Аренда байка в центре Паттайи", district: "Центр Паттайи" },
  { slug: "monthly-motorbike-rental-pattaya", title: "Аренда байка на месяц", district: null },
];
