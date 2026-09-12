/**
 * Route map and SEO metadata. Locale is a path prefix from the start so additional
 * locales are a data change, not a restructure.
 */
export const LOCALES = ["ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

/** Locales the live site publishes today. Only `ru` is built in Phase 1. */
export const PLANNED_LOCALES = ["ru", "en", "cn", "th", "de", "fr", "it"] as const;

export const isLocale = (x: string): x is Locale => (LOCALES as readonly string[]).includes(x);

export const path = {
  home: (l: Locale = DEFAULT_LOCALE) => `/${l}`,
  bikes: (l: Locale = DEFAULT_LOCALE) => `/${l}/bikes`,
  bike: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/bikes/${slug}`,
  cars: (l: Locale = DEFAULT_LOCALE) => `/${l}/cars`,
  car: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/cars/${slug}`,
  bicycles: (l: Locale = DEFAULT_LOCALE) => `/${l}/bicycles`,
  bicycle: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/bicycles/${slug}`,
  /** A visual booking prototype. The actual reservation is confirmed with an operator. */
  booking: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/booking/${slug}`,
  prices: (l: Locale = DEFAULT_LOCALE) => `/${l}/prices`,
  howItWorks: (l: Locale = DEFAULT_LOCALE) => `/${l}/how-it-works`,
  delivery: (l: Locale = DEFAULT_LOCALE) => `/${l}/delivery`,
  contacts: (l: Locale = DEFAULT_LOCALE) => `/${l}/contacts`,
} as const;

/** Route for a vehicle by its category. */
export function vehiclePath(category: "motorbike" | "auto" | "bicycle", slug: string, l: Locale = DEFAULT_LOCALE) {
  if (category === "auto") return path.car(slug, l);
  if (category === "bicycle") return path.bicycle(slug, l);
  return path.bike(slug, l);
}

export function categoryPath(category: "motorbike" | "auto" | "bicycle", l: Locale = DEFAULT_LOCALE) {
  if (category === "auto") return path.cars(l);
  if (category === "bicycle") return path.bicycles(l);
  return path.bikes(l);
}

/**
 * Phase 2 surfaces — architecture reserved, not built yet.
 * Recorded here so the IA stays visible and the legacy map below can point at them.
 */
export const PHASE_2 = {
  longTerm: (l: Locale = DEFAULT_LOCALE) => `/${l}/long-term`,
  district: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/pattaya/${slug}`,
  help: (l: Locale = DEFAULT_LOCALE) => `/${l}/help`,
  article: (slug: string, l: Locale = DEFAULT_LOCALE) => `/${l}/help/${slug}`,
} as const;

/**
 * Legacy → new URL map. Data only. No redirects are implemented in this phase;
 * this exists so the migration is a configuration step later, not an archaeology project.
 */
export const legacyRouteMap: { from: string; to: string; phase: 1 | 2 }[] = [
  { from: "/ru/", to: "/ru", phase: 1 },
  { from: "/ru/motorbike/", to: "/ru/bikes", phase: 1 },
  { from: "/ru/auto/", to: "/ru/cars", phase: 1 },
  { from: "/ru/bicycle/", to: "/ru/bicycles", phase: 1 },
  { from: "/ru/pricing/", to: "/ru/prices", phase: 1 },
  { from: "/ru/rules/", to: "/ru/how-it-works", phase: 1 },
  { from: "/ru/faq/", to: "/ru/how-it-works", phase: 1 },
  { from: "/ru/about/", to: "/ru/how-it-works", phase: 1 },
  { from: "/ru/contacts/", to: "/ru/contacts", phase: 1 },
  { from: "/ru/monthly-motorbike-rental-pattaya/", to: "/ru/long-term", phase: 2 },
  { from: "/ru/motorbike-rental-jomtien/", to: "/ru/pattaya/jomtien", phase: 2 },
  { from: "/ru/motorbike-rental-pratumnak/", to: "/ru/pattaya/pratumnak", phase: 2 },
  { from: "/ru/motorbike-rental-naklua/", to: "/ru/pattaya/naklua", phase: 2 },
  { from: "/ru/motorbike-rental-central-pattaya/", to: "/ru/pattaya/central", phase: 2 },
  { from: "/ru/news/", to: "/ru/help", phase: 2 },
];
