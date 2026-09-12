import { brand } from "@/content/brand";

/**
 * Production design tokens — the approved C3 / Precision Rental system.
 * Source of truth: .altx/design-profile.yaml (approved 2026-09-12).
 *
 * Directions must not diverge from this file. Anything not expressible here
 * (a new surface, a new radius) is a change to the Design DNA, not a local override.
 */
export const t = {
  page: "#F5F5F3",
  surface: brand.white,
  surfaceSunken: "#F0F0ED",
  plate: "#EEEEEA",
  dark: "#151515",
  darkElevated: "#1F1F1F",
  text: "#171717",
  muted: "#6B6B68",
  faint: "#9A9A96",
  border: "rgba(17,17,17,0.08)",
  borderStrong: "rgba(17,17,17,0.16)",
  borderSelected: "rgba(17,17,17,0.55)",
  yellow: brand.yellow,
  red: brand.red,
  green: brand.green,
  lineGreen: brand.lineGreen,
} as const;

/** One radius scale, applied by role. Pills only where the shape carries meaning. */
export const r = { container: 20, card: 16, control: 12, button: 12, badge: 8 } as const;

/** Motion bands. Controls report state; nothing here is decorative. */
export const dur = { control: 0.2, card: 0.24, panel: 0.42 } as const;
export const easeOut = [0.22, 0.61, 0.36, 1] as const;
export const spring = { type: "spring", stiffness: 420, damping: 40, mass: 0.8 } as const;
export const panelSpring = { type: "spring", stiffness: 260, damping: 34, mass: 0.9 } as const;
export const numericSpring = { stiffness: 320, damping: 38, mass: 0.6 } as const;

export const plural = (n: number, forms: [string, string, string]) =>
  n % 10 === 1 && n % 100 !== 11
    ? forms[0]
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? forms[1]
      : forms[2];

export const days = (n: number) => plural(n, ["день", "дня", "дней"]);
export const variants = (n: number) => plural(n, ["вариант", "варианта", "вариантов"]);
