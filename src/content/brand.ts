/**
 * Approved brand core. Source of truth: .altx/brand-brief.yaml (brand_mode: evolve, locked).
 * Yellow is sampled directly from the official logo asset (public/brand/logo2.png):
 * #FDDD00 is the dominant opaque colour, 11 209 px.
 *
 * Do not add palette entries here to differentiate design directions — the brief forbids it.
 * Directions differ by architecture, type, density, geometry and motion, not colour.
 */
export const brand = {
  black: "#0A0A0A",
  /** Ink shades derived from black — the same hue family, not new brand colours. */
  ink900: "#121212",
  ink800: "#1A1A1A",
  ink700: "#242424",
  ink600: "#333333",

  /** Locked brand accent, sampled from the logo. */
  yellow: "#FDDD00",
  yellowDim: "#D9BE00",

  white: "#FFFFFF",
  paper: "#F6F6F4",

  /** Secondary — selective high-priority booking emphasis only. Must not rival yellow. */
  red: "#E2231A",

  /** Secondary — messaging channels only (WhatsApp / LINE). Never a UI accent. */
  green: "#25D366",
  lineGreen: "#06C755",
} as const;

/**
 * Contrast rules forced by the locked palette. Yellow on white is ~1.2:1 and unusable
 * for text; black on yellow is ~13:1. The logo itself carries white knockout text, so it
 * must always sit on a dark plate.
 */
export const brandRules = {
  yellowFillTextColor: brand.black,
  neverYellowTextOnWhite: true,
  logoRequiresDarkPlate: true,
} as const;

export const logo = {
  src: "/brand/logo2.png",
  width: 640,
  height: 210,
  alt: "Andrei Motorbike Rent — Motorcycle for rent, Pattaya",
  sourceUrl: "https://rentmotorbike.org/static/img/template/logo2.png",
  note: "Existing brand asset, used as-is. Not redrawn, recoloured or reinterpreted.",
} as const;
