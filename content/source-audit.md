# Source audit — rentmotorbike.org

Audited **2026-09-12**. Source of business truth: the live public site. Not a visual reference.

## 1. What the business actually is

**Andrei Motorbike Rent Co., Ltd.** — a vehicle rental company in Pattaya, Thailand, trading since
2009. It is not primarily a motorcycle business: it is a **short-to-medium-term urban mobility
rental** business whose fleet happens to be mostly Honda scooters.

Two physical offices, both open 10:00–20:00 daily:

| Office | Address | Phone |
|---|---|---|
| Pratumnak | 354/101 Thappraya Rd, The Ocean Pearl, Pattaya 20150 | +66-88-520-5496 |
| Naklua (North Pattaya) | 285/106 Moo 5, Naklua Soi 16 | +66-65-067-4927 |

Staff languages: Russian, English, Thai, Farsi. The Russian-language site is the primary
commercial surface; RU is one of 7 locales.

### The fleet, as published

37 vehicles have real detail pages:

- **28 motorbikes** — 26 Honda, 2 Yamaha. Segments: 110–160cc commuter scooters (Click, Scoopy,
  ZoomerX, Giorno, PCX, Nouvo, GT), 300–350cc maxi-scooters (Forza, ADV), sport/cruiser
  (CBR 250, CBR 300R, Rebel 300), and a mini (MSX 125).
- **8 cars** — Toyota Yaris ×2, Camry Hybrid, Hilux; Ford Ecosport ×2, Fiesta ×2.
- **1 bicycle** — Trinx MTB.

Model naming encodes the three attributes customers actually filter on: **engine size**,
**keyless**, and **new/LED/ABS trim**. "Honda Click 160cc ABS" is a spec sheet in a product name.
That is a strong signal for the redesign's filter model.

### Price architecture

Six published tiers per vehicle: `1 день · от 3 дней · от 7 дней · 1 месяц · 2 месяца · 3 месяца`.
Day tiers bill per day. Month tiers bill **the whole period** — explicitly stated on `/ru/pricing/`:
"на 30, 60 и 90 дней мы считаем стоимость целого периода, а не «дни × дневной тариф»".

Range: 250 ฿/day (Click 110) to 1 500 ฿/day (Forza 350 New); 2 000 ฿/month to 15 000 ฿/month.
Cars: 3 days minimum in practice, 8 500–24 000 ฿/month.

**The ~3× day-vs-month gap is the defining commercial fact of this business** and the site
currently hides it behind a misleading card label. See `source-conflicts.md` C-01.

### Commercial differentiators the site claims

1. **Passport not held as deposit** — cash deposit 2 000–5 000 ฿ instead. Repeated on 5 pages;
   the company's strongest and most consistent claim.
2. **10-minute paperwork.**
3. **Delivery to hotel/condo in 30–90 minutes**, priced by zone (150/250/400/500 ฿).
4. **Two helmets + lock + full tank (95) included**; insurance to 30 000 ฿ for hospital treatment only.
5. **Free replacement on breakdown.**
6. **Russian-speaking staff.**

### What is genuinely risky for the customer, and stated plainly

Insurance covers **hospital treatment only** — not accident, theft, drop, or wilful damage. The
renter carries full liability, plus tyres, keys, documents, battery, water ingress. `/ru/faq/`
says this clearly. The redesign must keep this legible, not bury it.

---

## 2. Pages audited

| Route | What it contributes |
|---|---|
| `/ru/` | Hero, USP block, Google reviews carousel, 20-model card grid, booking + delivery modals, SEO copy |
| `/ru/about/` | Company history, statistics counter, service list, duplicated SEO block |
| `/ru/motorbike/` | 28 model cards, single flat grid, no filters, no sort, no search |
| `/ru/motorbike/<slug>/` ×28 | Price ladder, availability, delivery zones, deposit, gallery, description, spec table, pros/cons, "кому подойдёт", verdict, 4-question FAQ, related models |
| `/ru/auto/` + 8 details | Same template; no 1-day price |
| `/ru/bicycle/` + 1 detail | Same template |
| `/ru/pricing/` | Full 3-table price list (bikes / bicycles / cars), tier explanation, 6-question price FAQ |
| `/ru/faq/` | 16 Q&A — the richest page on the site; carries delivery prices, fines, parking, fuel, insurance |
| `/ru/rules/` | 11 numbered rental conditions |
| `/ru/contacts/` | Both offices, messengers, maps, socials |
| `/ru/motorbike-rental-{jomtien,pratumnak,naklua,central-pattaya}/` | District landing pages — and the only place prices are shown honestly (1-day **and** 1-month columns) |
| `/ru/monthly-motorbike-rental-pattaya/` | Long-stay landing page; states the 2–3× monthly saving outright |
| `/ru/news/` + 29 articles | SEO/content marketing |
| `/ru/contacts/wechat-qr.html/` | WeChat QR |

**567 URLs in the sitemap; 81 under `/ru/`.**

### Multilingual structure

7 locales with full `hreflang` alternates: `/` (en, x-default), `/ru/`, `/cn/`, `/th/`, `/de/`,
`/fr/`, `/it/`. Locale is a path prefix; the RU tree is the one audited. Any production
architecture must preserve this prefix scheme and the alternates.

### Technical observations

- Fully server-rendered HTML. No client-side hydration needed to read content.
- Assets follow a strict convention: `/static/upload/pattaya/models/<slug>/<slug>-N.jpg`.
- Booking is a **modal form** duplicated into every page's DOM (two of them — "Забронировать"
  and "Доставка в отель"), each re-rendering the full 37-item model `<select>`. This is why every
  page ships ~40 KB of repeated markup.
- Catalogue has **no filtering, no sorting, no search, no comparison** — 28 cards in one flat grid.

---

## 3. SEO inventory to preserve (do not migrate in this phase)

Valuable search intent currently served:

- **Vehicle detail routes** — `/ru/motorbike/<slug>/`, `/ru/auto/<slug>/`, `/ru/bicycle/<slug>/`.
  37 pages with unique titles of the form «Аренда {model} в Паттайе 2026 — от {N}฿/день».
- **District landing pages** — 4 routes targeting «аренда байка в {район}».
- **Long-stay landing page** — `/ru/monthly-motorbike-rental-pattaya/`.
- **`/ru/pricing/`** — targets «цены на аренду байка Паттайя 2026».
- **`/ru/faq/`** — 16 questions, several of which are genuine long-tail queries
  (документы, права, штрафы, парковка, доставка).
- **`/ru/news/`** — 29 articles, incl. high-intent ones: «rent-motorbike-pattaya-without-license»,
  «cost-renting-motorbike-scooter-pattaya-2026», «how-to-rent-motorbike-pattaya»,
  «driving-license-need-ride-motorbike-thailand-pattaya».
- **7-locale `hreflang` graph.**

Titles lean on the year («2026»), which requires annual maintenance — worth noting for production.

---

## 4. What the old site does badly, in product terms

1. **The catalogue advertises a price you cannot buy.** (C-01) Everything else is secondary.
2. **No way to narrow 28 models.** No filter, no sort, no search, no comparison. A first-time
   tourist cannot distinguish Click 125 LED from Click 125 Keyless from Click 160 Keyless.
3. **Duration is invisible until the detail page.** The customer already knows their dates on
   arrival; the site asks for them last, inside a modal.
4. **Price, deposit, delivery and documents live on four different pages.** These are one decision.
5. **Booking is a modal with a 37-option `<select>`** and no context carried from the page.
6. **Delivery — the actual differentiator — is a paragraph**, not a tool. "Which zone am I in
   and what does that cost" takes reading `/ru/faq/`.
7. **SEO copy outranks product UI.** The homepage places ~1 200 words of keyword prose between
   the model grid and the footer.
8. **Two offices are treated as footer text**, though "which one is closer" is a real question.
9. **The best content is buried.** `/ru/faq/` — fines, parking, fuel, insurance limits — is the
   most useful page on the site and is linked as «Вопросы» in ninth nav position.

---

## 5. Derived customer intents (Phase 5)

Ranked by how often the site's own content implies them:

| # | Intent | What the customer needs on screen |
|---|---|---|
| 1 | "Cheap scooter for a week / a month" | Price **for that duration**, not a "from" price |
| 2 | "Something comfortable for two" | Seat/размер/мощность signal, filterable |
| 3 | "I specifically want a Forza / ADV / Rebel" | Direct model access — search or brand entry |
| 4 | "What's available for my dates and what does it cost" | Duration selector bound to every price |
| 5 | "What documents do I need?" | One answer, split into law vs company |
| 6 | "How much is the deposit?" | 2 000–5 000 ฿, per model, next to the price |
| 7 | "Can you deliver to my hotel?" | Zone → price → ETA, as a lookup not a paragraph |
| 8 | "Which office is closer?" | Two offices with map + district association |
| 9 | "Can I rent without leaving my passport?" | The headline trust claim, stated first |
| 10 | "How do I book?" | WhatsApp/Telegram, with the model and dates pre-filled |

Intents 1, 4 and 6 all reduce to one control: **choose a duration, see honest money**. That is the
product's centre of gravity and it is what the three Design Lab directions each solve differently.
