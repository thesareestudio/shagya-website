# Shagya — Homepage Design Plan

> Source of truth for the homepage redesign. Brand color extracted from the
> official logo `shagya-logo-vector-2.svg`. Built before code, per the brief:
> _"first create the wireframe and great content and design planning, and only
> then redesign the homepage."_

---

## 1. Brand Color Extraction (from the logo)

The logo `shagya-logo-vector-2.svg` contains a single fill color:

| Token | Value |
|-------|-------|
| Hex | `#69254e` |
| RGB | `105, 37, 78` |
| **OKLCH** | **`oklch(0.380 0.109 346)`** |

This is a **deep wine / maroon** sitting in the red→magenta range (hue ≈ 346°).
It reads as regal, heritage, luxurious — exactly the "Sabyasachi minimalism"
direction called for in `.impeccable.md`.

> ⚠️ The existing design tokens used warm amber/saffron at hue 65°. That did
> **not** match the logo. The brand is being corrected to **wine (hue 346)**.

### Palette built around the logo

**Brand — Wine** (hue 346, the logo's hue):

| Step | OKLCH | Use |
|------|-------|-----|
| 50  | `oklch(0.96 0.012 346)` | Tinted washes, subtle backgrounds |
| 100 | `oklch(0.92 0.025 346)` | Badges, hover tints |
| 200 | `oklch(0.85 0.05 346)`  | Borders on brand surfaces |
| 300 | `oklch(0.74 0.08 346)`  | Muted brand accents |
| 400 | `oklch(0.60 0.10 346)`  | Links on dark, secondary accent |
| 500 | `oklch(0.50 0.11 346)`  | Primary buttons, focus |
| 600 | `oklch(0.42 0.11 346)`  | **Logo / wordmark color** |
| 700 | `oklch(0.34 0.10 346)`  | Hover on buttons |
| 800 | `oklch(0.26 0.08 346)`  | Deep text on light |
| 900 | `oklch(0.19 0.06 346)`  | Dark section base |
| 950 | `oklch(0.13 0.04 346)`  | Richest wine, near-black wine |

**Accent — Zari Gold** (hue 85, complement to wine — the gold thread work in
premium sarees; used sparingly for hairlines, small caps labels, dividers):

| Step | OKLCH |
|------|-------|
| 300 | `oklch(0.80 0.10 85)` |
| 400 | `oklch(0.72 0.12 85)` |
| 500 | `oklch(0.64 0.13 85)` |

**Neutrals** — tinted toward the brand hue 346 (chroma 0.004–0.008), so they
never read as flat gray. Same lightness ladder as before.

**Semantic colors** — unchanged (success/error/warning/info), only re-hued
neutrals around them.

---

## 2. Logo Usage

- Optimized, themeable SVG at `public/shagya-logo.svg` (~35 KB, single path,
  `fill="currentColor"` so it inherits text color).
- Reusable `<Logo>` component (`src/components/layout/Logo.tsx`):
  - Props: `className`, `showWordmark` (default true), `markClassName`.
  - Renders the mark + "Shagya" wordmark in Sora.
  - Mark uses `text-brand-600`; on dark surfaces use `text-gold-400`.
- Used in: Header (left), Footer (brand column), favicon (`app/icon.svg`).

---

## 3. Homepage Wireframe

Mobile-first. Sections stack vertically; desktop layout noted per section.

```
┌──────────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR  (wine-950 bg, gold-400 text, tiny)         │
│ "Complimentary shipping over ₹999  ·  7-day easy returns"     │
├──────────────────────────────────────────────────────────────┤
│ HEADER: [Logo]   Silk  Cotton  Handloom  Designer  Collec.   │
│                                    [search] [♥] [account] [bag]│
╞════════════════════════════════════════════════════════════════╡
│                                                              │
│  SECTION 1 — HERO  (editorial split)                         │
│  ┌──────────────────────┬──────────────────────────────┐    │
│  │  EST. — HANDLOOM      │                              │    │
│  │                       │   [ editorial saree image ]  │    │
│  │  The art of           │   (full-bleed, rounded-xl)   │    │
│  │  the handwoven        │                              │    │
│  │  drape                │                              │    │
│  │                       │                              │    │
│  │  Sarees woven on      │                              │    │
│  │  wooden looms across  │                              │    │
│  │  India — silk, cotton │                              │    │
│  │  and heritage weaves. │                              │    │
│  │                       │                              │    │
│  │  [ Explore the shop →]│                              │    │
│  │  [ Our craft story  ] │                              │    │
│  └──────────────────────┴──────────────────────────────┘    │
│  Mobile: stacked — copy first, then image.                   │
│                                                              │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 2 — WEAVE MARQUEE (thin typographic strip)         │
│  Banarasi · Kanchipuram · Chanderi · Jamdani · Patola ·     │
│  Kanjivaram · Phulkari · Baluchari · Maheshwari ·  (repeat) │
│  Gold-400 small-caps, subtle, no emojis.                    │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 3 — SHOP BY CRAFT (categories)                     │
│  Eyebrow: "Browse the collections"                          │
│  H2: "Find your weave"                                      │
│                                                              │
│  2-col mobile / 3-col desktop image cards:                  │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │ image  │ │ image  │ │ image  │                          │
│  │ Silk   │ │ Cotton │ │Handloom│                          │
│  │ 24 weaves│ │18 weaves│ │31 weaves│                        │
│  └────────┘ └────────┘ └────────┘                          │
│  Editorial image-forward tiles (no emoji, no chip blobs).   │
│  Hover: image scale 1.03, label slides up.                  │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 4 — THE CRAFT STORY (editorial split, reversed)    │
│  ┌──────────────┬───────────────────────────────┐          │
│  │ [loom image] │  Eyebrow: "From the loom"      │          │
│  │              │  H2: "Six hands, one saree"    │          │
│  │              │  Body: the story of a Banarasi │          │
│  │              │  weave — 18 days, three        │          │
│  │              │  artisans, one length of silk. │          │
│  │              │  [ Read the journal → ]        │          │
│  └──────────────┴───────────────────────────────┘          │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 5 — CURATED PICKS (product grid)                   │
│  Eyebrow: "New this week"                                   │
│  H2: "Quietly chosen"                                       │
│  4 product cards (2-col mobile, 4-col desktop):             │
│  ┌──────┐┌──────┐┌──────┐┌──────┐                          │
│  │ img  ││ img  ││ img  ││ img  │                          │
│  │ name ││ name ││ name ││ name │                          │
│  │ ₹price││₹price││₹price││₹price│                          │
│  └──────┘└──────┘└──────┘└──────┘                          │
│  Card: image, weave name, region, price. No badges spam.    │
│  [ View all new arrivals → ]                                 │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 6 — WINE FEATURE BAND (dark, full-bleed)           │
│  bg: brand-950 (richest wine). Gold hairline top.           │
│  Eyebrow (gold-400): "A note from Shagya"                   │
│  H2 (white): "Every saree is signed by its maker"          │
│  Body: our promise — handloom-verified, maker-traced,       │
│  no middleman markup.                                        │
│  [ Begin browsing → ]   [ Meet the weavers ]                │
╞════════════════════════════════════════════════════════════════╡
│  SECTION 7 — JOURNAL + NEWSLETTER (two-column)              │
│  Left: "From the journal" — 2 article teasers.             │
│  Right: newsletter card on brand-50 wash.                   │
│  "Letters on craft" — weekly notes on weaves & makers.      │
│  [ email field ] [ Subscribe ]                              │
╞════════════════════════════════════════════════════════════════╡
│  FOOTER (existing, re-tinted to wine neutrals)              │
└──────────────────────────────────────────────────────────────┘
```

### Why this beats the current homepage
- **Removes AI tells**: gradient blobs, emoji category icons (✨🌿🧵💫🎉👑),
  generic "trust bar" with 4 identical icon chips.
- **Image-forward** per principle #1 ("let the sarees be the hero").
- **Editorial rhythm**: alternating split sections create cadence instead of
  one monotone stacked page.
- **Real content** about craft (weave names, maker story) instead of generic
  "handpicked sarees from India's finest weavers" filler.
- **Brand-correct**: wine + zari-gold, the actual heritage luxury pairing.

---

## 4. Content (final copy)

### Announcement bar
> Complimentary shipping over ₹999  ·  7-day easy returns

### Hero
- **Eyebrow**: EST. — HANDLOOM, INDIAN-MADE
- **H1**: The art of the handwoven drape
- **Sub**: Sarees woven on wooden looms across India — silk, cotton and
  heritage weaves, delivered from the maker to you.
- **Primary CTA**: Explore the shop
- **Secondary CTA**: Our craft story

### Weave marquee
Banarasi · Kanchipuram · Chanderi · Jamdani · Patola · Kanjivaram ·
Phulkari · Baluchari · Maheshwari · Ilkal

### Shop by craft
- **Eyebrow**: Browse the collections
- **H2**: Find your weave
- Cards: Silk (24 weaves), Cotton (18 weaves), Handloom (31 weaves)

### Craft story
- **Eyebrow**: From the loom
- **H2**: Six hands, one saree
- **Body**: A single Banarasi can take eighteen days and three artisans — the
  weaver, the border-maker, the draw-boy. We work directly with these
  clusters, so the hand that wove it is the hand that's paid for it.
- **CTA**: Read the journal

### Curated picks
- **Eyebrow**: New this week
- **H2**: Quietly chosen
- Four placeholder products: Banarasi Silk Saree (Varanasi) ₹12,400 ·
  Kanchipuram Silk (Tamil Nadu) ₹18,900 · Chanderi Cotton (MP) ₹4,200 ·
  Jamdani Handloom (Bengal) ₹7,650.
- **CTA**: View all new arrivals

### Wine feature band
- **Eyebrow** (gold): A note from Shagya
- **H2**: Every saree is signed by its maker
- **Body**: Handloom-verified. Maker-traced. No middleman markup, no
  warehouse mystery stock — just the cloth, the cluster it came from, and a
  fair price on both sides.
- **CTAs**: Begin browsing  ·  Meet the weavers

### Journal + newsletter
- **Heading**: Letters on craft
- **Body**: A short weekly note — one weave, one maker, one thing worth
  knowing. No marketing noise.
- **Button**: Subscribe
- Journal teasers: "How to tell a real Banarasi from a powerloom copy" ·
  "The last draw-boys of Varanasi"

---

## 5. Design Decisions

- **Light mode primary**, generous whitespace, one action per screen.
- **Type**: Sora (display) stays; heading sizes use the existing fluid scale
  (`text-hero`, `text-headline`). Body in Public Sans.
- **No gradient text** (banned). No `border-left` accent stripes (banned).
- **Card radius**: `rounded-2xl` for image tiles, `rounded-xl` for buttons.
- **Motion**: restrained — `slide-up` on hero only, hover lift on cards,
  respect `prefers-reduced-motion` (already in globals).
- **Image strategy**: until real CMS product images exist, use gradient +
  weave-name placeholders built from brand tints so the layout still reads as
  "image-forward" without broken `<img>`. Each placeholder is a tasteful
  wine-tinted panel with the weave name set in Sora — clearly a stand-in, not
  a fake photo.
- **Accessibility**: real heading order (one h1), descriptive link text,
  focus rings inherit brand-500, color contrast AA on wine-on-cream and
  cream-on-wine.
