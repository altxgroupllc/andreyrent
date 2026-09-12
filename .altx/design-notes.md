# Design notes

## Business objective

Andrei Motorbike Rent Co., Ltd. — vehicle rental in Pattaya since 2009. Two offices
(Pratumnak, Naklua), 37 vehicles with real detail pages (28 motorbikes, 8 cars, 1 bicycle).
The commercial goal of the redesign is to get a tourist from "I need a bike" to a WhatsApp
message with the right model, an honest price and understood conditions.

## Primary user journey

Choose a rental length → see real prices for that length → compare a few models →
understand deposit, documents and delivery → message on WhatsApp.

The defining fact of the business: the monthly tariff is ~3× cheaper per day than the daily
one. The old site advertises the monthly rate ÷ 30 under every card as "от X ฿/день", so the
advertised price is unbuyable for a short rental. Every direction is built so that a price can
never appear without the duration that earns it. See `content/source-conflicts.md` C-01.

## Brand constraint (locked)

`.altx/brand-brief.yaml`, brand_mode: evolve. Existing logo used as-is; black / #FDDD00 /
white core; red only for selective booking emphasis; green only for WhatsApp and LINE.
Yellow was sampled from the logo file itself, not chosen.

The three directions therefore differ by product architecture, not palette — the brief
explicitly forbids palette-led differentiation.

## Direction A — Inventory First

Booking bar + live inventory as the first screen; real date-range picker; comparison tray for
up to three bikes; light surface, black chrome. Commissioner + IBM Plex Mono. Radius 0.
~80% utility / 20% expression. Sources: @shadcn (calendar, popover), @react-bits (CountUp).

## Direction B — Moto Discovery

The shopfront on screen: black ground, yellow sign plates, Oswald condensed uppercase echoing
the real "MOTORCYCLE FOR RENT" lettering. Discovery is three horizontal garage rails by riding
character. Yellow price tag on every card, bound to the duration chips. ~70/30 — the briefed
balance. Sources: @animate-ui (scroll-progress), motion.

## Direction C — Fast Local Rental

Mobile-first utility: a three-question chooser (зачем / на сколько / куда) resolving straight
to matches; ± day stepper instead of tariff tiles; bottom tab bar; ⌘K model search; total
"к оплате сейчас" including delivery. Golos Text + JetBrains Mono. Sources: @shadcn (drawer,
command), @animate-ui (toggle-group).

## Rejected patterns

- Palette-led differentiation between directions (forbidden by the brief).
- Centred SaaS hero with headline + paragraph + two buttons — none of the three has one.
- Red used for discounts or availability status; red is reserved for booking emphasis.
- Green as a UI accent; it marks messaging channels only.
- Yellow text on white (≈1.2:1) anywhere.
- Default shadcn identity: borrowed primitives inherit brand tokens defined in `globals.css`.
- `@bundui` items — several ship `registryDependencies` pointing at `http://localhost:3000/r/…`.
- `@kokonutui/card-stack` — inspected for Direction B's spec presentation, rejected: fintech
  demo content and external Unsplash image references.
- `@react-bits/CardSwap` — would have pulled GSAP for a decorative effect with no product job.
- AI-generated fleet photography; the model with no photos shows a labelled gap instead.

## Approved direction

**C3 — Precision Rental**, approved 2026-09-12.

Lineage: C (Fast Local Rental) established the product logic — intent-first chooser, day
stepper, live re-priced list, delivery choice, fast booking path. C2 kept that logic byte for
byte and replaced the industrial control-panel surface with a calm, precise one. C3 kept C2's
system and refined three things only: vehicle presence in the list, a price hierarchy that
follows the chosen duration, and a quick preview between row and full detail.

A and B are not carried forward. B's condensed sign typography and full-bleed photography
remain the reference for any future campaign or editorial surface, not for the product UI.

Design DNA is recorded in `.altx/design-profile.yaml` (`approved: true`) and
`.altx/design-history.json`.
