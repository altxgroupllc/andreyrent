# Proposed information architecture

Derived from the audit, not from the old site's structure. Phase 6 deliverable — a proposal for
human review, not an implemented route tree.

## Organising principle

The old site is organised by **vehicle type** (мотобайки / велосипеды / авто), which is how the
*business* sees its assets. Customers arrive with a **duration and a budget**, and only then a
vehicle preference. The audit shows the entire price architecture is duration-driven and the
day↔month gap is ~3×.

> **The primary control of the new product is rental duration. Price is a function of it, and
> every price shown anywhere is bound to a chosen length.**

This single decision fixes conflict C-01, C-03 and intents 1, 4, 6 simultaneously.

## Proposed navigation

Five items. Not nine.

| Nav item | Route | Replaces | Why it earns a slot |
|---|---|---|---|
| **Байки** | `/bikes` | `/ru/motorbike/` + `/ru/pricing/` + `/ru/auto/` + `/ru/bicycle/` | The catalogue *is* the price list once duration is global. Cars and bicycles become filter facets, not sections — 8 cars and 1 bicycle do not justify top-level nav. |
| **Как это работает** | `/how-it-works` | `/ru/rules/` + `/ru/faq/` + parts of `/ru/about/` | Documents, deposit, insurance limits, fuel, fines — one decision, one page, progressively disclosed. |
| **Доставка и офисы** | `/delivery` | `/ru/contacts/` + delivery paragraphs | Zone→price→ETA lookup plus the two offices. The differentiator becomes a tool. |
| **Долгая аренда** | `/long-term` | `/ru/monthly-motorbike-rental-pattaya/` | Distinct customer (зимовщик), distinct economics, distinct search intent. Keeps its own page. |
| **Помощь** | `/help` | `/ru/faq/` long tail + `/ru/news/` | Riding in Thailand, parking, fines, breakdown. Genuine value, kept out of the purchase path. |

Persistent, not in nav: **WhatsApp / Telegram** as a fixed action, and the **duration selector**
as a global control.

### Deliberately demoted

- **«О нас»** — folded into `/how-it-works` and the footer. It currently carries the site's worst
  content (three contradictory fleet sizes, unverifiable statistics).
- **«Цены»** as a separate page — absorbed into the catalogue. A standalone price table only
  exists today because the cards can't show real prices.
- **«Статьи»** — kept at `/help/<slug>` for SEO, out of the primary journey.

### Preserved for SEO (production phase, not now)

- `/bikes/<slug>` ← `/ru/motorbike/<slug>/` (37 detail routes)
- `/pattaya/<district>` ← `/ru/motorbike-rental-{district}/` (4 routes)
- `/prices` as a canonical redirect target into `/bikes?duration=…`
- 7-locale path prefixes and full `hreflang` alternates
- `/help/<slug>` ← `/ru/news/<slug>/` (29 articles)

No redirects are implemented in this phase.

## Key UX decisions the three directions must each answer

1. **Where does duration live?** Global header control, inline per-card stepper, or a
   first-run question? Each direction answers differently — this is the main axis of variation.
2. **How do you narrow 28 models?** The names already encode engine size, keyless and trim.
   Facets: назначение (город / вдвоём / трасса / стиль), объём, keyless, ABS, новый, цена за срок.
3. **How is "от X ฿" ever shown?** Only as `{price} ฿/день при аренде на {N}` — number and
   condition are one unit, never separable.
4. **Where do deposit, documents and delivery appear?** Next to the price, not on another page.
   They are part of "what will this cost me", not fine print.
5. **What is the booking action?** WhatsApp with model + dates + pickup pre-composed. The old
   modal with a 37-option `<select>` is the thing being replaced.
6. **Mobile**: the duration control and the booking action must both be reachable by thumb at
   all times, without covering price.

## Non-goals for this phase

No backend, no real submission, no CMS, no auth, no redirects, no locale routing. The Design Lab
is a visual and interaction decision surface only.
