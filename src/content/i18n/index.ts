import type { Locale } from "@/content/routes";
import { ru, type Dictionary } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { ru };

/** Server-side dictionary lookup. Adding a locale = adding a file and a map entry. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? ru;
}

export type { Dictionary };
