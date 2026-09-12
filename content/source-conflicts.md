# Source conflicts — rentmotorbike.org/ru

Audited 2026-09-12 against the live site. Every conflict below is between **two official pages
of the business's own website**. Nothing here is resolved by guessing. Where the prototype must
display something, it uses the **most conservative** (least favourable-to-us) reading and is
marked in code.

Legend: `NEEDS_OWNER_CONFIRMATION` = the owner must state which is correct before production.

---

## C-01 — Catalogue price labels understate the real daily price by ~3× **[CRITICAL]**

The single most consequential inconsistency on the site.

Catalogue and homepage cards read **`от ฿X / день`**. That number is the **1-month tariff ÷ 30**.
The actual price to rent that bike for one day is roughly **three times higher**, published only
on the model detail page.

| Model | Card says "от ฿ / день" | Real 1-day price | Multiple |
|---|---:|---:|---:|
| Honda Click 110cc | 80 | 250 | 3.12× |
| Honda Scoopy 110cc | 80 | 250 | 3.12× |
| Yamaha Nouvo 135cc | 80 | 250 | 3.12× |
| Honda Click 125cc Keyless | 120 | 350 | 2.92× |
| Honda Click 160cc ABS | 150 | 450 | 3.00× |
| Honda PCX 160cc Keyless | 180 | 550 | 3.06× |
| Honda ADV 160cc Keyless | 200 | 600 | 3.00× |
| Honda Forza 350cc New | 500 | 1 500 | 3.00× |
| Honda ADV 350cc Keyless | 400 | 1 200 | 3.00× |

Verified across all 28 motorbike cards; the ratio is 2.92–3.12× with no exceptions.

- Sources: `/ru/motorbike/` and `/ru/` (cards) vs each `/ru/motorbike/<slug>/` (price table).
- The business is aware of the mechanic — `/ru/monthly-motorbike-rental-pattaya/` says outright
  "месячная аренда в 2–3 раза выгоднее посуточной", and detail-page FAQ repeats it.
- The district landing pages (e.g. `/ru/motorbike-rental-jomtien/`) do it **correctly**: they show
  a `1 день` column and a `1 месяц` column side by side.

**Status:** not a factual conflict about policy — a labelling defect. `NEEDS_OWNER_CONFIRMATION`
only on presentation, not on the numbers. The numbers themselves are internally consistent.

**Prototype handling:** never print a per-day figure without the duration that earns it. Every
price in the Design Lab is bound to a selected rental length.

---

## C-02 — Fleet size: 700+ vs 800+ vs 840 `NEEDS_OWNER_CONFIRMATION`

Three different figures, **two of them on the same page**.

| Claim | Where |
|---|---|
| «более 700 байков и авто» | `/ru/about/`, intro paragraph |
| «Более 800 единиц техники» | `/ru/about/`, lower SEO block — same page |
| «840 / Единиц техники» | `/ru/about/`, statistics counter — same page |
| «800+ байков Honda и Yamaha» | `/ru/` hero |
| «более 800 единиц мототехники» | `/ru/faq/` |
| «парком 800+ единиц» | `/ru/motorbike-rental-jomtien/` |

**Prototype handling:** no fleet-size number is displayed anywhere. `business.fleetSizeClaim = null`.

---

## C-03 — "от 80 ฿/сутки" is not reachable at any published 1-day price `NEEDS_OWNER_CONFIRMATION`

- `/ru/` hero: «скутеры от 80฿/день» — reads as a daily price.
- `/ru/about/`: «ОТ 80 БАТ/СУТКИ — минимальная стоимость **при долгосрочной аренде**» — correctly
  qualified.
- Cheapest published 1-day price anywhere on the site: **250 ฿** (Click 110 / Scoopy 110 / Nouvo 135).
- Cheapest achievable per-day figure: 2 000 ฿ ÷ 30 = **66.7 ฿/day**, and only on a 3-month contract.
  So even 80 ฿ does not correspond to a specific published tariff — 1 month ÷ 30 = 83.3 ฿.

The `/ru/` `<title>` also carries «от 80฿/день» into search results.

**Prototype handling:** the "from" price is always shown as `от 67 ฿/день при аренде на 3 месяца`
style — figure plus the condition, computed from `pricing`, never a bare number.

---

## C-04 — Delivery price: three different published answers `NEEDS_OWNER_CONFIRMATION`

| Source | What it says |
|---|---|
| `/ru/faq/` + **every** vehicle detail page | Пратумнак 150฿ · Центр & Джомтьен 250฿ · На-Джомтьен & Наклуа 400฿ · Амбассадор & Сукхумвит 500฿ |
| `/ru/motorbike-rental-jomtien/` | «Доставка по Джомтьену — **от 100 бат** (до 3 км — 100฿, 3–8 км — 200฿)» |
| `/ru/pricing/` | «Доставка байка — платная услуга, **точную стоимость уточняйте у менеджера**» |
| `/ru/` | «Стоимость зависит от района» — no figures |

Jomtien is **250฿** on the detail pages and **100–200฿** on the Jomtien landing page.

**Prototype handling:** the zone table from the detail pages is used (it is the most widely
repeated and the least favourable to the customer), and the Jomtien figure is flagged in
`locations.ts`.

---

## C-05 — Driving licence: required or not? `NEEDS_OWNER_CONFIRMATION`

| Source | Wording |
|---|---|
| `/ru/rules/` §3 | «По правилам компании **права не требуются** для аренды» |
| `/ru/faq/` Q1 | «**Также потребуется** водительское удостоверение… МВУ категории A или A1» |
| `/ru/` | «Права категории A **обязательны по закону**… Мы выдаём скутер **без прав**, но ответственность на вас» |
| `/ru/about/` | «Аренда без залога паспорта и **без прав**» |
| detail-page FAQ | «нужны международные права (МВУ) категории A/A1 либо тайские права категории A» |

Two distinct propositions are being blurred: *the company's rental requirement* and *Thai law*.
The site is legally consistent (law requires a licence) but commercially contradictory
(does the company hand over a bike without one, or not?).

**Prototype handling:** the two propositions are separated into distinct UI statements —
«Что требует закон Таиланда» and «Что требует компания» — and the company-requirement
line is left as the conservative `/ru/faq/` wording until the owner confirms.

---

## C-06 — Passport wording is consistent, but "оригинал" is ambiguous on first read

All pages agree: **the original passport is not retained**. But `/ru/rules/` §1 opens with
«Для аренды необходим **оригинал паспорта**», which scans as "we take the original" before the
parenthetical clarifies «мы сделаем копию… и вернём его Вам».

Not a contradiction — a phrasing hazard, and it undercuts the company's single best
differentiator. Listed because the redesign must fix the reading order.

---

## C-07 — Bicycle model name: Trinx M600 vs M007 `NEEDS_OWNER_CONFIRMATION`

| Source | Name |
|---|---|
| `/ru/bicycle/trinx-mtb-m007/` `<h1>` | «Велосипед Trinx **M600**» |
| booking form dropdown (every page) | «Велосипед Trinx **M600**» |
| `/ru/pricing/` table + surrounding copy | «Велосипед Trinx **M007**» |
| URL slug and all image filenames | `trinx-mtb-m007` |

---

## C-08 — Homepage card price for Honda ADV 350cc Keyless disagrees with the catalogue

| Source | "от ฿ / день" |
|---|---:|
| `/ru/` homepage card | **500** |
| `/ru/motorbike/` catalogue card | **400** |
| `/ru/pricing/` 1-month rate ÷ 30 | 400 |
| `/ru/motorbike/honda-adv-350cc-keyless/` | 1-month 12 000 → 400 |

The homepage is wrong; it appears to show the ADV 350cc **New** price. This is the only
card mismatch among the 20 models the homepage repeats.

---

## C-09 — «Популярные модели» lists five models that are not in the fleet

`/ru/about/` advertises: «Honda Click, PCX, Forza, Scoopy, ADV, CBR, **Yamaha NMAX, Aerox, XMAX,
Filano, Fino**».

Catalogue, price list and booking dropdown contain exactly **two** Yamahas: **GT 125cc LED** and
**Nouvo 135cc**. NMAX, Aerox, XMAX, Filano and Fino appear nowhere else on the site.

**Prototype handling:** only the 37 vehicles that have real detail pages exist in `vehicles.ts`.

---

## C-10 — Cars have no 1-day price, and this is never explained

All 8 cars show `- ฿` in the `1+ день` column of `/ru/pricing/` and have no `1 день` row on their
detail pages. The minimum is effectively 3 days. No page states a car minimum rental term, while
`/ru/rules/` §11 states «Минимальный срок аренды — 1 сутки» as a blanket rule.

`NEEDS_OWNER_CONFIRMATION`: is the car minimum 3 days?

---

## C-11 — `/ru/pricing/` omits vehicles that exist in the catalogue

Missing from the price table but present in the catalogue, the booking dropdown and with live
detail pages:

- **Honda ADV 350cc New** (15 000 ฿/мес on its own page)
- **Ford Fiesta 1,6 AT 122 лс 2012, седан** (one Fiesta row covers two distinct listings)
- **Ford Ecosport 2014** and **2017** are separate listings at different prices (12 000 vs 14 000 ฿/мес);
  the table lists both, but the catalogue names them ambiguously.

---

## C-12 — Honda ADV 350cc New has no photographs at all

`/ru/motorbike/honda-adv-350cc-new/` renders with an empty gallery — zero images. It is also
marked «Под заказ». It is nonetheless one of the most expensive models offered (1 500 ฿/day).

---

## C-13 — Availability: «Под заказ» is shown but never defined

Four vehicles are flagged «Под заказ» rather than «В наличии»: Honda ADV 350cc Keyless,
Honda ADV 350cc New, Ford Ecosport 2017, Toyota Yaris 2023.

No page explains what «Под заказ» means for the customer — lead time, deposit, or whether it
can be booked at all. `NEEDS_OWNER_CONFIRMATION`.

Note this is a *stale-content* risk, not a live inventory feed: these flags are hand-set.
The prototype shows availability **as published**, and never invents a count of units.

---

## C-14 — Pratumnak office address is printed four different ways

- `/ru/contacts/` — «354/101 Thappraya Rd, The Ocean Pearl, Pattaya 20150»
- footer — «20150 Pattaya, Thappraya rd. **Soi 12**, The Ocean Pearl, 354/101»
- header — «Пратумнак (**Pattaya Park Rd.**)»
- `/ru/about/` — «354/101 **Thap Phraya** Road, Pattaya City, Bang Lamung, Chon Buri 20150»

Probably one location, but "Pattaya Park Rd." and "Thappraya Rd Soi 12" are not the same street
name, and a tourist navigating by text will notice. `NEEDS_OWNER_CONFIRMATION` on the canonical form.

---

## C-15 — Fuel shortfall penalty stated in two different ways

- `/ru/rules/` §4 — «возможно удержание **стоимости недостающего топлива**»
- `/ru/faq/` — «мы удерживаем **50 бат за каждый недостающий литр**» (measured with a canister)

50 ฿/L is above Thai pump price, so this is a penalty rate, not cost recovery. The two
statements are not equivalent. `NEEDS_OWNER_CONFIRMATION`.

---

## C-16 — Unverifiable statistics presented as facts

`/ru/about/` counter: **17** лет · **19** специалистов · **17 677** довольных клиентов · **840** единиц техники.

"17 677 довольных клиентов" is a precise-looking number with no stated basis. The Google rating
(4.8) has a real source; this does not.

**Prototype handling:** the statistics counter is not reproduced. Only the Google rating and the
five verbatim published reviews are used.
