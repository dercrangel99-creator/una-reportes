# Design System v3 — Unión Nacional de Avicultores (UNA)

> **Source of truth:** extracted from the code as it ships today (`app/globals.css`, `app/layout.tsx`, `app/components/**`).
> It supersedes `DESIGN-una-v2.md` and `DESIGN-una-admin-v2.md`, which describe an earlier light/Quicksand system that the code no longer follows.
>
> **Purpose:** give you everything needed to restyle another file/app so it matches **both** UNA styles — the **Dark "CME" style** and the **Light "Editorial" style** — with exact values.

---

## 0. Identity in one paragraph

An institutional Mexican poultry-industry site that looks like a **financial market terminal** (CME-style): near-black navy surfaces, a faint 50px grid, glassy cards with 1px hairlines, **square corners (2px)**, cyan for interaction, **yellow used like gold leaf** (thin bars, underlines, active markers), monospaced numbers, and tiny uppercase tracked labels. Headlines are set in **Playfair Display** with an **italic accent word**; UI and body copy are **Inter**. The same language has a **Light mode** (white cards, slate text, navy headings) that is used for the admin workspace, the associates portal, the data dashboards and some public sections.

---

## 1. The two styles and where each one lives

| Style | Where it's used | Root / scope class | Page background |
|---|---|---|---|
| **Dark (CME)** — default | Public site chrome (Navbar, Ticker, Footer, PageHeader), dark home sections, admin sidebar, market-intelligence navbar, default modals | none (it is the `body` default) | `#030712` (`bg-brand-dark`) |
| **Light – Admin** | `/dashboard/**` main content | `.admin-main-light` | `#f8fafc` |
| **Light – Associates** | `/my-dashboard/**` | `.asociados-light` (inside `bg-slate-50`) | `#f8fafc` (slate-50) |
| **Light – Data dashboards** | `(market-intelligence)` prices / variables / sanidad, `(comercio-exterior)` | `.dashboard-light` (inside `bg-[#F3F5F8]`) | `#F3F5F8` |
| **Light – Editorial public sections** | `HomeHero` (`#FEFEFE`), `HomeIntro` (`bg-white`), accordions, `Button` component | none (uses legacy UNA tokens directly) | `#FFFFFF` / `#FEFEFE` |

**How light mode works:** components are written once with dark-mode classes (`admin-card`, `admin-btn--ghost`, `status-pill--active`, even raw `text-slate-100`, `bg-white/5`, `border-white/10`), and the **scope class remaps them** to light values via descendant selectors in `globals.css`. So, to make a dark component light, wrap it in the scope class instead of rewriting it.

---

## 2. Color tokens

All tokens are Tailwind v4 theme colors defined in `@theme inline` (`app/globals.css`), usable as `bg-*`, `text-*`, `border-*`, `from-*`, etc.

### 2.1 Dark system (CME) — primary palette

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| `--color-brand-dark` | `#030712` | `bg-brand-dark` | Page background, deepest surface, text on yellow/cyan buttons |
| `--color-brand-navy` | `#0B1528` | `bg-brand-navy` | Navbar, footer, page header, sidebar, modal body, raised surfaces |
| `--color-brand-slate` | `#1E293B` | `bg-brand-slate` | Scrollbar thumb, tertiary surface |
| `--color-brand-yellow` | `#FDC300` | `bg-brand-yellow` | Primary CTA, active markers, accent bars, eyebrow on dark, selection |
| `--color-brand-cyan` | `#0EA5E9` | `text-brand-cyan` | Links, interactive accents, eyebrow on light, focus rings, admin primary buttons, avatars |
| `--color-brand-green` | `#10B981` | `text-brand-green` | Price up ▲, online status, live dot |
| `--color-brand-red` | `#EF4444` | `text-brand-red` | Price down ▼, errors |

Dark-only surfaces that appear as hardcoded values (keep them, they are part of the look):

| Hex | Use |
|---|---|
| `#050A14` | Market ticker bar background |
| `#060B16` | Dark home section background (e.g. `HomeProductos`) |
| `#0B1426` / `#0C1527` | Card / badge background inside dark sections |
| `#0D1F3A` | Market-intelligence & foreign-trade top navbar |
| `rgba(11,21,40,0.80)` + `blur(12–16px)` | Glass card (`.glass-panel`, `.admin-card`, `.una-card`) |
| `rgba(3,7,18,0.85)` + `blur(10–12px)` | Modal overlay |

**Text on dark** (Tailwind slate scale): primary `#e2e8f0` (`text-slate-200`, body default) / `text-slate-100` for headings / `text-white` for hero titles; secondary `text-slate-400` (`#94a3b8`); tertiary `text-slate-500` (`#64748b`); placeholders `#475569`. White alphas are used heavily: `text-white/75` (lead), `/70` (nav link), `/60`, `/50` (breadcrumb), `/25` (separators).

**Hairlines on dark:** `rgba(255,255,255,0.05)` (row dividers, `border-white/5`), `0.06` (card borders), `0.08` (table header, input), `0.10` (`border-white/10`, modals, outlines), `0.15` (outline buttons).

### 2.2 Light system — "Legacy UNA" editorial palette (still in use)

| Token | Hex | Tailwind | Role |
|---|---|---|---|
| `--color-navy-deep` | `#06254B` | `text-navy-deep` | Headings on light, outline button, `themeColor` meta |
| `--color-navy-primary` | `#03488D` | `text-navy-primary` | Primary on light, italic accent `em.acc`, eyebrow on light dashboards, imports series |
| `--color-accent-yellow` | `#F8D227` | `bg-accent-yellow` | Light-mode yellow: primary button, hover accent bar, eyebrow line |
| `--color-bg-light` | `#F2F8FF` | `bg-bg-light` | Soft blue surface, badges |
| `--color-text-dark` | `#1C1C1C` | `text-text-dark` | Body/headings on white |
| `--color-text-editorial` | `#3a4256` | `text-text-editorial` | Long-form paragraphs (`#2d3748` inside `.dashboard-light`) |
| `--color-text-muted` | `#5a6478` | `text-text-muted` | Secondary text (`#4a5568` inside `.dashboard-light`) |
| `--color-footer-charcoal` | `#1C1C1C` | — | Legacy footer |
| `--color-success-green` | `#2e8b57` | — | Success on light |
| `--color-warning-amber` | `#b85c00` | — | Warning / destructive on light |
| (hardcoded) | `#1D5E9D` | `text-[#1D5E9D]` | Italic accent words in the light Home hero |

**Light hairlines (navy-tinted):** `--color-hairline-light` `rgba(6,37,75,0.06)`, `-strong` `0.10`, `-ui` `0.15`. Admin/associates light uses neutral black instead: `rgba(0,0,0,0.06 / 0.08 / 0.12 / 0.15)`.

**Light text (admin / associates):** headings `#0f172a`, body `#1e293b` / `#334155`, secondary `#475569`, muted `#64748b`, placeholder `#94a3b8`.

### 2.3 Data-dashboard neutrals (market-intelligence pages, hardcoded)

These pages are built with inline hex values instead of tokens. Reuse them for any chart/data screen:

| Hex | Role |
|---|---|
| `#F3F5F8` | Dashboard page background |
| `#FFFFFF` | Panel background (`bg-white rounded-xl border`) |
| `#E2E8F0` | Panel border, chart grid lines (`strokeDasharray="3 3"`) |
| `#1A2B4A` | Panel title / tooltip label text |
| `#6B7B8F` | Uppercase field labels (`text-xs font-bold uppercase tracking-wider`) |
| `#9AA5B1` | Captions, empty states |

### 2.4 Chart / data-series palette

From `app/lib/functions/market-intelligence/variables/colors.ts` and `app/components/recharts/_chartConfig.ts`:

| Name | Hex | Typical series |
|---|---|---|
| Navy | `#0A2240` | Production, USA, primary series |
| Gold | `#C8A84B` | Prices, secondary series |
| Teal | `#1D9E75` | Breeding costs, Brazil |
| Imports | `#03488D` | `TRADE_COLORS.importaciones` |
| Exports | `#E07B2A` | `TRADE_COLORS.exportaciones` |
| Blue | `#3B82F6` | |
| Violet | `#8B5CF6` | |
| Slate-900 | `#0F172A` | |
| Amber | `#F59E0B` / `#EAB308` | |
| Green | `#10B981` / `#16A34A` | |
| Red | `#EF4444` | |
| Pink | `#EC4899` | |

Year-comparison sequence (`PALETA_ANIOS`): `#94A3B8, #3B82F6, #8B5CF6, #0A2240, #F59E0B, #10B981, #EF4444, #EC4899`.

### 2.5 Semantic / status colors

| Status | Dark: bg / text | Light: bg / text |
|---|---|---|
| Pending | `rgba(253,195,0,0.15)` / `#FDC300` | `rgba(253,195,0,0.12)` / `#b45309` |
| Active | `rgba(14,165,233,0.12)` / `#0EA5E9` + border `0.20` | `rgba(14,165,233,0.10)` / `#0369a1` |
| Success | `rgba(16,185,129,0.12)` / `#34d399` | `rgba(16,185,129,0.10)` / `#059669` |
| Warning | `rgba(239,68,68,0.10)` / `#f87171` | `rgba(239,68,68,0.08)` / `#dc2626` |
| Error | `rgba(239,68,68,0.15)` / `#ef4444` | `rgba(239,68,68,0.10)` / `#dc2626` |
| Delta up / down | `#34d399` ▲ / `#f87171` ▼ (KPI), `text-brand-green` / `text-brand-red` (ticker) | same |

---

## 3. Dark ↔ Light equivalence map (use this to match both styles)

| Role | Dark (CME) | Light – Admin / Associates | Light – Editorial / Data dashboards |
|---|---|---|---|
| Page bg | `#030712` | `#f8fafc` | `#FFFFFF` / `#F3F5F8` |
| Raised surface (nav, header) | `#0B1528` | `#0B1528` (sidebar stays dark) | `#06254B` / `#0D1F3A` (navbar stays dark) |
| Card bg | `rgba(11,21,40,0.80)` + blur 12px | `#ffffff` | `#ffffff` |
| Card border | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` | `rgba(6,37,75,0.08)` / `#E2E8F0` |
| Card shadow (rest → hover) | `0 2px 12px rgba(0,0,0,.25)` → `0 14px 36px rgba(0,0,0,.40)` | `0 2px 12px rgba(0,0,0,.06)` → `0 14px 36px rgba(0,0,0,.10)` | `0 2px 12px rgba(6,37,75,.06)` → `0 14px 36px rgba(6,37,75,.12)` |
| Heading text | `#f1f5f9` / white | `#0f172a` | `#06254B` |
| Body text | `#e2e8f0` | `#334155` | `#2d3748` / `#1C1C1C` |
| Secondary text | `#94a3b8` | `#64748b` | `#4a5568` / `#5a6478` |
| Interactive accent | `#0EA5E9` cyan | `#0EA5E9` (text `#0284c7`) | `#03488D` navy-primary |
| Gold accent | `#FDC300` | `#FDC300` (text `#b45309`) | `#F8D227` |
| Eyebrow text / line | yellow text + cyan line (`on-dark`) or cyan text + yellow line | `#0284c7` text + yellow line | `#03488D` text + `#F8D227` line, Quicksand 11px 600 |
| Italic accent | `em.acc-yellow` (`#FDC300`) or `font-serif italic text-brand-cyan` | `em.acc` (`#03488D`) | `em.acc` (`#03488D`) / `#1D5E9D` |
| Input | bg `rgba(11,21,40,.6)`, border `white/8%` | bg `#fff`, border `black/12%`, text `#1e293b` | same as admin |
| Focus | border `#0EA5E9` + outline `2px rgba(14,165,233,.30)` offset 2px | outline opacity `.20` | same |
| Modal overlay | `rgba(3,7,18,0.85)` + blur | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.5)` |
| Modal panel | `rgba(11,21,40,.95)` / `#0B1528`, border `white/8%`, shadow `0 40px 80px rgba(0,0,0,.5)` | `#ffffff`, border `black/8%`, shadow `0 40px 80px rgba(0,0,0,.15)` | same |
| Close button | `bg-white/5 text-slate-300` → hover `bg-brand-cyan text-brand-dark rotate-90` | `bg-slate-100 text-slate-500` → hover `bg-slate-200 text-slate-900` | same |
| Filter chip active | `bg-brand-navy text-white border-brand-cyan` | `bg-brand-cyan text-white border-brand-cyan` | same |
| Filter chip idle | `text-slate-400 border-white/10` hover `border-brand-cyan` | `text-slate-500 border-slate-200` hover `border-brand-cyan` | same |
| Pagination current | `bg-brand-navy text-white` | `bg-brand-cyan text-white` | same |
| Table header | `#64748b`, border `white/8%` | `#64748b`, border `black/8%` | same |
| Table row hover | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.02)` | same |
| Zebra row | `rgba(14,165,233,0.03)` | `rgba(14,165,233,0.03)` | same |

---

## 4. Typography

### 4.1 Families (loaded in `app/layout.tsx` via `next/font/google`)

| Family | CSS var / utility | Weights | Use |
|---|---|---|---|
| **Inter** | `--font-inter` / `font-inter` (body default) | 300–800 | All UI and body copy, labels, buttons, tables |
| **Playfair Display** | `--font-playfair` / `font-playfair` | 400–900, normal + italic | H1/H2/H3, modal/page titles, KPI values, ranks (`01`), italic accent words, avatar initials |
| **JetBrains Mono** | `--font-jetbrains` / `font-mono-numbers` (also `font-mono`) | 400, 500 | Prices, tickers, numeric data, codes, placeholder labels |
| *Quicksand* | `font-quicksand` | — | **Legacy.** Used in light/editorial components but **not loaded**, so it renders as the system sans-serif. For new work, use Inter. |

### 4.2 Type scale (observed in components)

| Role | Font | Size | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Hero H1 (public page header) | Playfair | `clamp(40px, 4.5vw, 68px)` | 500 | 1.0 | -0.01em | White on navy |
| Home hero H1 (light) | Inter | `text-4xl → sm:text-6xl → lg:text-7xl` | 300 | 1.05 | tight | Accent words in serif italic 600 |
| Section H2 (editorial) | Playfair | `clamp(36px, 4vw, 54px)` | 500 | 1.05 | -0.01em | Contains `<em class="acc">` |
| Section H2 (dark CME) | Inter | `text-3xl sm:text-4xl` | 300 | — | tight | Accent `font-serif italic text-brand-cyan` |
| Admin page H1 | Playfair | 52px | 500 | 1.0 | -0.01em | |
| KPI value | Playfair | 46px (+ 18px italic cyan unit) | 500 | 1.0 | -0.02em | |
| Modal title | Playfair | 38px | 500 | 1.05 | -0.01em | |
| Slide-over title | Playfair | 28px | 500 | 1.05 | — | |
| Accordion title | Playfair | 20px → `lg:24px` | 500 | 1.2 | — | |
| Card title (dark) | Inter | 16px (`text-base`) | 700 | — | — | |
| Chart card title (light) | Playfair | 16 → `sm:18px` | 500 | tight | -0.01em | Color `#06254B` |
| Lead paragraph | Inter | 15–17px | 300 | 1.7 | — | `text-white/75` on dark |
| Body | Inter | 14–15px | 400 | 1.7–1.75 | — | |
| Small / table cell | Inter | 13–14px | 400–600 | — | — | |
| Nav link | Inter | 11px | 700 | — | 0.15em | UPPERCASE |
| Button | Inter | 10–13px | 700–800 | — | 0.04–0.18em (`tracking-widest`) | UPPERCASE |
| Eyebrow | Inter | 10px | 700 | — | 0.3em | UPPERCASE, with a 32×1px line before it |
| Micro label / meta / table head | Inter | 9–10px | 600–700 | — | 0.2–0.3em | UPPERCASE |
| Ticker | JetBrains Mono / Inter | 11px (label 9px) | 500–700 | — | wider | |
| Price value | JetBrains Mono | 24px (`text-2xl`) | 900 | — | — | |

**Most-used tracking values:** `0.22em`, `0.3em`, `0.15em`, `0.2em`, `0.1em`, `-0.01em` (headlines).
**Most-used sizes:** `text-xs` (12px), `text-sm` (14px), `text-[10px]`, `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[15px]`.

### 4.3 Signature typographic patterns

**Italic accent word.** Every big title has one word or phrase in Playfair italic, regular weight, in the accent color. Admin titles end with a period.

```html
<!-- Light -->
<h2 class="font-playfair ...">Más de <em class="acc">60 años</em> al servicio de la avicultura mexicana.</h2>
<!-- Dark -->
<h2 class="font-playfair text-white ...">Confirmar <em class="acc-yellow">Desconexión</em>.</h2>
<!-- Dark CME section (Inter light headline + serif italic cyan) -->
<h2 class="text-4xl font-light tracking-tight">La más amplia gama de <span class="font-serif italic text-brand-cyan">productos avícolas</span>.</h2>
```

**Eyebrow.** A short line, then an UPPERCASE label, placed above every section title.

```html
<div class="section-eyebrow">SOBRE NOSOTROS</div>          <!-- cyan text, yellow line (for light bg) -->
<div class="section-eyebrow on-dark">NORMATIVIDAD</div>    <!-- yellow text, cyan line (for dark bg) -->
<div class="admin-eyebrow warning">CONFIRMACIÓN REQUERIDA</div>  <!-- red #f87171 -->
```
Spec: `inline-flex; gap 12px; Inter 10px/700; letter-spacing .3em; uppercase; margin-bottom 16px; ::before 32×1px`.

**KPI label.** UPPERCASE 10px/700, `0.28em`, `#94a3b8`, preceded by a **7×7px cyan square rotated 45°** (a diamond).

**Ranks.** `01`, `02`… in Playfair italic, cyan, 15px, 500 (`String(n).padStart(2,"0")`).

---

## 5. Shape, elevation, spacing

### 5.1 Radius

| Context | Radius | Tailwind |
|---|---|---|
| Dark CME + admin system (cards, buttons, pills, inputs, chips) | **2px** | `rounded-[2px]` / `rounded-xs` |
| Small CTAs, nav links, ticker badges | 4px | `rounded-sm` |
| Admin modal | 4px | — |
| Data-dashboard panels, chart cards, user dropdown | 8–12px | `rounded-lg` / `rounded-xl` |
| Avatars, status dots, slider handles | full | `rounded-full` |
| Editorial image frame | `8px 0 8px 0` (opposite corners) | inline style |

The rule: **marketing and admin surfaces are nearly square; analytical dashboards are softly rounded.**

### 5.2 Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-card-rest` | `0 2px 12px rgba(6,37,75,0.04)` | Light card at rest |
| `--shadow-card-hover` | `0 20px 50px rgba(6,37,75,0.12)` | `.card-hover:hover` |
| `--shadow-cta` | `0 8px 24px rgba(248,210,39,0.25)` | Yellow button hover glow |
| `--shadow-modal` | `0 40px 80px rgba(6,37,75,0.30)` | Modal |
| `--shadow-lightbox` | `0 40px 100px rgba(0,0,0,0.40)` | Lightbox image |

The look is **flat at rest**; depth appears only on hover (lift plus a bigger shadow).

### 5.3 Layout & spacing

| Item | Value |
|---|---|
| Content container (editorial) | `max-w-[1320px] mx-auto px-6 lg:px-12` (`<Container>`) |
| Content container (chrome: navbar, footer, dark sections) | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Associates content | `max-w-[1100px] mx-auto px-6 lg:px-8 py-10 lg:py-14` |
| Section vertical padding | Editorial `py-[140px] max-md:py-20` (`--spacing-section` 140 / mobile 80); dark CME `py-20` |
| Page header padding | `padding-top: 140px; padding-bottom: 100px` |
| Navbar height | `h-16` (64px), sticky, `bg-brand-navy/95 backdrop-blur-md border-b border-white/5` |
| Market-intelligence navbar | `h-19` (76px), `bg-[#0d1f3a]`; content area `h-[calc(100vh-76px)]` |
| Admin sidebar | 268px fixed, `#0B1528`, border-right `white/6%`; main `lg:ml-67 px-5 py-8 lg:px-12 lg:py-11` |
| Card padding | `p-6` / `p-7` / `p-8 lg:p-9` / `p-9 lg:p-10` (admin); `p-5` (dark product); `p-3 sm:p-4` (chart) |
| Grid gaps | `gap-6` (cards), `gap-10 lg:gap-20` / `gap-12 lg:gap-20` (two-column hero/intro) |
| Breakpoints | Tailwind defaults (`sm` 640, `md` 768, `lg` 1024); carousel switches at 640 / 1100 |

### 5.4 Z-index scale

`z-10` in-card overlays · `z-40` main navbar · `z-50` ticker / MI navbar / mobile drawer · `z-[85]`/`z-[90]` admin sidebar backdrop/panel · `z-[150]` user menu dropdown · `z-[200]` modals, slide-overs, skip link · `z-[300]` lightbox.

---

## 6. Motion

| Item | Value |
|---|---|
| **Signature easing** | `cubic-bezier(0.2, 0.8, 0.2, 1)`, used for every lift, slide, reveal and accent bar |
| Color / border transitions | `0.2s ease` |
| Card hover lift | `translateY(-2px)` (admin / dashboard) or `-4px` (`.card-hover`), `0.3s` |
| Top accent bar reveal | `scaleX(0 → 1)`, origin left, `0.4s` |
| Modal | backdrop `fadeIn 0.3s`; panel `slideUp` (20px → 0) `0.4s` |
| Slide-over | `slideInRight 0.4s` |
| Scroll reveal | `.reveal` → `.reveal.visible`: opacity plus 24px rise, `0.6s` |
| Close buttons | `hover:rotate-90`, `0.2s` |
| Nav underline | 1px yellow `::after` grows `0 → 100%` width, `0.3s` |
| Ticker | `.animate-marquee` 30s linear infinite, pauses on hover; edges masked with gradients to the bar color |
| Live dots | `.pulse-dot` 2s / `.admin-pulse` 1.6s / Tailwind `animate-pulse` |
| Flowing SVG line | `.flowing-line` dash 8/12, 2s |

All of these are disabled under `@media (prefers-reduced-motion: reduce)`. Keep that block when porting.

---

## 7. Signature decorative patterns

| Pattern | Implementation |
|---|---|
| **CME grid background** | `.cme-grid`: two 1px `rgba(255,255,255,0.02)` linear gradients, `background-size: 50px 50px`. Used on dark headers and sections |
| **Glass panel** | `.glass-panel`: `rgba(11,21,40,0.8)` + `backdrop-filter: blur(16px)` + `1px solid rgba(255,255,255,0.06)` |
| **Gold top bar on hover** | `::before` 2–3px tall, full width, `#FDC300` (dark) / `#F8D227` (light), `scaleX(0)` → `scaleX(1)` on hover. Classes: `.admin-card`, `.una-card`, `.year-card`, `ChartCard` |
| **Brand gradient text** | `.text-gradient-brand`: `linear-gradient(135deg, #0EA5E9, #FDC300)` clipped to text |
| **Gold-tipped bar** | `.bar-track` 6px `white/6%`, `.bar-fill` cyan with a 2px `#FDC300` cap on the right end |
| **Lead with gold rule** | Right column of the page header: `border-left: 1px solid rgba(253,195,0,0.4)` + `pl-10` |
| **Active nav item (sidebar)** | `bg-[rgba(14,165,233,0.15)] text-white border-l-2 border-brand-yellow`, icon `#FDC300` |
| **Section label in sidebar** | 22×1px `rgba(14,165,233,0.40)` line + 10px/600 `0.3em` uppercase `white/35` |
| **Image placeholder** | `.img-placeholder` 135° stripes `#e6eef9`/`#d4e0f0` (yellow variant `#fff5d1`/`#ffe896`) + dashed inner box + mono 10px label |
| **Selection** | `::selection { background: #FDC300; color: #030712; }` |
| **Scrollbar** | 8px, track `#0B1528`, thumb `#1E293B` → hover `#0EA5E9`; `.no-scrollbar` hides it |

---

## 8. Components

### 8.1 Buttons

**Dark / admin buttons** (`.admin-btn` + modifier; Inter 11px/700, `0.18em`, uppercase, radius 2px, `gap 8px`, padding `14px 22px`):

| Variant | Rest | Hover |
|---|---|---|
| `admin-btn--filled` (primary) | `bg #0EA5E9`, text `#030712` | `bg #38bdf8` |
| `admin-btn--yellow` (CTA) | `bg #FDC300`, text `#030712`, padding `12px 22px` | `bg #fde047` + `0 8px 24px rgba(253,195,0,.25)` |
| `admin-btn--outline` | transparent, text `#e2e8f0`, border `white/15%` | `bg white/8%`, border `white/30%`, text white |
| `admin-btn--ghost` | transparent, text `#94a3b8`, border `white/8%` | `bg white/6%`, border `white/20%`, text `#e2e8f0` |
| `admin-btn--icon` | 40×40, border `white/10%`, text `#94a3b8` | `bg white/8%`, text `#e2e8f0`; focus-visible `2px #0EA5E9` outline |

In light scopes, `outline`, `ghost` and `icon` switch to black-alpha borders and `#334155` / `#64748b` text; `filled` and `yellow` stay the same.

**Navbar CTA (dark):** `bg-brand-yellow hover:bg-amber-400 text-brand-dark px-4 py-2 rounded-sm font-extrabold text-[10px] tracking-widest uppercase shadow-md shadow-brand-yellow/15` with a 14px lock icon.

**Public `<Button>` (light editorial)**, base `inline-flex gap-2 uppercase transition-all duration-200`:

| Variant | Classes |
|---|---|
| `primary` | `bg-accent-yellow text-navy-deep px-[22px] py-3 rounded-[2px] font-semibold text-[13px] tracking-[0.04em] hover:bg-white hover:-translate-y-[1px]` |
| `filled-navy` | `bg-navy-primary text-white px-6 py-[14px] font-bold text-[12px] tracking-[0.15em] hover:bg-navy-deep` |
| `outline` | `text-navy-deep border border-navy-deep px-6 py-[14px] font-bold text-[12px] tracking-[0.15em] hover:bg-navy-deep hover:text-white` |
| `filter` / `filter-active` | `px-4 py-2 font-semibold text-[12px] tracking-[0.1em]`; idle `text-text-muted border-hairline-light-ui`, active `bg-navy-deep text-white` |

**Destructive (light dropdown):** `border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-sm`, 11px bold `tracking-widest` uppercase.

### 8.2 Cards

```css
/* Dark card — .admin-card / .una-card */
background: rgba(11,21,40,0.80); backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.06); border-radius: 2px;
box-shadow: 0 2px 12px rgba(0,0,0,0.25); overflow: hidden; position: relative;
transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s cubic-bezier(.2,.8,.2,1);
/* hover */ transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,0.40);
/* ::before */ 2px #FDC300 top bar, scaleX(0) → scaleX(1) on hover, .4s
```

- **Dark product card:** `group bg-[#0B1426] border border-white/5 rounded-sm overflow-hidden`; image `h-40` with `group-hover:scale-105` (500ms); 8px uppercase badge top-left; body `p-5 space-y-3`; title `text-base font-bold text-slate-100`; price `text-2xl font-black font-mono text-slate-100` + unit `text-xs text-slate-400`; delta `text-xs font-mono font-bold` green/red/slate.
- **Light chart card (`ChartCard`):** `rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(6,37,75,0.12)]` + yellow `h-0.5` top bar on hover; eyebrow 11px uppercase `0.3em` `#03488D` with a 32px yellow line; title Playfair `#06254B`; subtitle 12px `#5a6478`; optional amber pill badge (`rounded-full border-amber-300 bg-amber-50 text-amber-700 text-[10px]`). Chart body `min-h-[200px]`.
- **Data panel (market intelligence):** `bg-white rounded-xl border border-[#E2E8F0]` → `p-5`; title `text-sm font-bold text-[#1A2B4A]`; caption `text-xs text-[#9AA5B1]`.
- **KPI card:** `.admin-card p-7`; top row with `.kpi-label` + 36×36 icon tile `rgba(14,165,233,0.12)`; value Playfair 46px; cyan sparkline (1.5px stroke, gradient fill 25% → 0%); delta row with a hairline top border.

### 8.3 Inputs

`.admin-input`: `padding 12px 16px; bg rgba(11,21,40,.60); border 1px rgba(255,255,255,.08); radius 2px; Inter 14px; color #e2e8f0`; focus `border #0EA5E9; outline 2px rgba(14,165,233,.30); offset 2px`; placeholder `#475569`. Light: bg `#fff`, border `rgba(0,0,0,.12)`, text `#1e293b`, placeholder `#94a3b8`.

Range slider (light dashboards): track `h-1.5 rounded-full bg-slate-200`, fill = accent (`#1a4d8f` in market intelligence, `#06254B` in prices), 20px white handles with a 2px accent border; year box `w-14 rounded-md border-slate-200 font-mono text-sm`.

### 8.4 Tables (`.admin-table`)

- `th`: padding `14px 20px`, Inter 10px/700, `0.3em`, uppercase, `#64748b`, bottom border `white/8%`.
- `td`: padding `18px 20px`, Inter 14px, `#e2e8f0`, bottom border `white/5%`.
- Row hover `white/4%`. Optional `.admin-table--zebra` (even rows `rgba(14,165,233,0.03)`). Optional rank column (Playfair italic cyan `01`). Actions column has a 32px `admin-btn--icon` with a `MoreHorizontal` icon.

### 8.5 Status pills (`.status-pill--{pending|active|success|warning|error}`)

`inline-flex; padding 4px 10px; Inter 10px/700; letter-spacing .2em; uppercase; radius 2px`. Colors are in §2.5.

### 8.6 Filters & pagination

- **FilterBar / FilterChipBar:** `px-4 py-2 font-inter font-semibold text-[11–12px] tracking-[0.1em] uppercase border`; states as in §3.
- **Pagination:** 40×40 page cells, Inter 13px/500; prev/next text buttons with 16px chevrons; disabled `opacity-30`; current page navy (dark) or cyan (light).
- **Carousel:** 56×56 arrows `bg-brand-dark border-white/10 text-brand-cyan hover:bg-brand-navy hover:text-white`; dots are 40×3px bars (`bg-brand-yellow` active, `bg-white/10` idle).

### 8.7 Overlays

| Component | Overlay | Panel | Close |
|---|---|---|---|
| `Modal` (public) | dark `rgba(3,7,18,.85)` / light `rgba(0,0,0,.5)`, blur 12px | `bg-brand-navy border-white/10` / `bg-white border-slate-200`; `max-width 1180px; max-height 90vh` | 48×48 `bg-brand-dark text-brand-cyan hover:bg-brand-yellow hover:text-brand-dark hover:rotate-90` |
| `AdminModal` | `.admin-modal-overlay` | `.admin-modal-content`, `max-width 540px`; body `px-9 pt-9 pb-6`; eyebrow + Playfair 38px title + 15px body; optional meta row (dashed top border, 9px labels, Playfair italic 18px cyan values); footer `px-9 py-6` right-aligned on a tinted bg | 36×36, top-right |
| `SlideOver` | same overlay | right panel, width 560px, sticky header (Playfair 28px) and sticky footer | 36×36 |
| `Lightbox` | `rgba(6,37,75,0.96)` | image `min(80vw,80vh)` | 52×52 `border-white/30` → hover `bg-accent-yellow` |
| User menu | `bg-black/30 backdrop-blur-sm` | `w-[320px] bg-white rounded-lg shadow-2xl p-5` (always light) | — |

All overlays lock body scroll, close on ESC or a backdrop click, move focus to the first focusable element, and return focus to the trigger on close.

### 8.8 Page chrome

- **Market ticker** (above the navbar): `bg-[#050A14] border-b border-white/5 py-2.5 text-[11px]`; fixed label with a green pulsing dot + `MONITOR AVÍCOLA — SEMANA DEL …` (9px bold uppercase slate-400); items are label `slate-500` + value mono bold `slate-100` + change green ▲ / red ▼ / slate ▬, divided by `border-r border-white/5`.
- **Navbar:** logo `h-10` (hover scale 105), center `.nav-link` items, right CTA or `UserMenu`; mobile drawer `bg-brand-navy border-t border-white/10 px-6 py-8`, links 14px, active link yellow.
- **PageHeader:** `bg-brand-navy border-b border-white/5`, `cme-grid` (or video at 20% opacity with a navy gradient); breadcrumbs 11px/600 `0.3em` uppercase (`white/50` links, `/` in `white/25`, current page yellow); 2-column grid: eyebrow + H1 on the left, lead with a gold left rule on the right.
- **Footer:** `bg-brand-navy border-t border-white/10 py-16 text-slate-500 text-xs font-light`; 12-col grid (4/2/3/3); column headings 10px bold `slate-100` uppercase `tracking-widest`; links 11px `hover:text-brand-yellow`; bottom bar 10px `slate-400` with `border-t border-white/5`.
- **Skip link:** `sr-only focus:not-sr-only … focus:bg-brand-yellow focus:text-brand-dark`.

### 8.9 Icons

`lucide-react`. Default `strokeWidth={1.5}` (most common), `2` for small or close icons. Sizes: 14–15px in buttons and menus, 16px in pagination, 18px in sidebar and close buttons, 20–24px for arrows and mobile menu. Decorative icons get `aria-hidden="true"`.

### 8.10 Rich content (`.rich-content`)

Paragraph `margin 0 0 1em`; h2 `1.4em/600`; h3 `1.2em/600`; lists `padding-left 1.5em`; links cyan + underline; blockquote with a 3px `rgba(148,163,184,.4)` left border, italic; images `max-width 100%`, radius 2px; `overflow-wrap: anywhere`; tables scroll horizontally.

---

## 9. Drop-in tokens for another file

### 9.1 Tailwind v4 (`@import "tailwindcss";` project)

Copy `@theme inline { … }` **and** the custom classes from `app/globals.css` (`.cme-grid`, `.glass-panel`, `.section-eyebrow`, `.admin-*`, `.una-card`, `.status-pill*`, `.kpi-label`, `.bar-*`, the light scopes, keyframes, and the reduced-motion block). Load the fonts with `next/font/google` exactly as in `app/layout.tsx` (Playfair Display 400–900 + italic, Inter 300–800, JetBrains Mono 400–500) and set `<body class="font-inter bg-brand-dark text-slate-200 antialiased">`.

### 9.2 Plain CSS (any stack, no Tailwind)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

:root {
  /* ---- Dark (default) ---- */
  --una-bg:            #030712;
  --una-surface:       #0B1528;
  --una-surface-3:     #1E293B;
  --una-card:          rgba(11,21,40,0.80);
  --una-overlay:       rgba(3,7,18,0.85);
  --una-text:          #e2e8f0;
  --una-text-strong:   #f1f5f9;
  --una-text-2:        #94a3b8;
  --una-text-3:        #64748b;
  --una-border:        rgba(255,255,255,0.06);
  --una-border-ui:     rgba(255,255,255,0.10);
  --una-accent:        #0EA5E9;   /* cyan: links, focus, primary button */
  --una-accent-hover:  #38bdf8;
  --una-gold:          #FDC300;   /* yellow: CTA, active, accent bars */
  --una-gold-hover:    #fde047;
  --una-up:            #10B981;
  --una-down:          #EF4444;
  --una-shadow-rest:   0 2px 12px rgba(0,0,0,0.25);
  --una-shadow-hover:  0 14px 36px rgba(0,0,0,0.40);
  --una-shadow-modal:  0 40px 80px rgba(0,0,0,0.50);

  --una-radius:        2px;
  --una-radius-panel:  12px;      /* data dashboards only */
  --una-ease:          cubic-bezier(0.2, 0.8, 0.2, 1);

  --una-font-display:  'Playfair Display', Georgia, serif;
  --una-font-ui:       'Inter', system-ui, sans-serif;
  --una-font-num:      'JetBrains Mono', ui-monospace, monospace;
}

/* ---- Light (admin / associates) ---- */
.una-light {
  --una-bg:            #f8fafc;
  --una-card:          #ffffff;
  --una-overlay:       rgba(0,0,0,0.45);
  --una-text:          #334155;
  --una-text-strong:   #0f172a;
  --una-text-2:        #64748b;
  --una-text-3:        #94a3b8;
  --una-border:        rgba(0,0,0,0.08);
  --una-border-ui:     rgba(0,0,0,0.15);
  --una-shadow-rest:   0 2px 12px rgba(0,0,0,0.06);
  --una-shadow-hover:  0 14px 36px rgba(0,0,0,0.10);
  --una-shadow-modal:  0 40px 80px rgba(0,0,0,0.15);
}

/* ---- Light (editorial / data dashboards, navy-tinted) ---- */
.una-light-editorial {
  --una-bg:            #F3F5F8;
  --una-card:          #ffffff;
  --una-text:          #2d3748;
  --una-text-strong:   #06254B;
  --una-text-2:        #4a5568;
  --una-border:        rgba(6,37,75,0.08);
  --una-border-ui:     rgba(6,37,75,0.18);
  --una-accent:        #03488D;
  --una-gold:          #F8D227;
  --una-shadow-rest:   0 2px 12px rgba(6,37,75,0.06);
  --una-shadow-hover:  0 14px 36px rgba(6,37,75,0.12);
}

body { background: var(--una-bg); color: var(--una-text); font-family: var(--una-font-ui); -webkit-font-smoothing: antialiased; }
::selection { background: #FDC300; color: #030712; }

.una-card {
  position: relative; overflow: hidden;
  background: var(--una-card); backdrop-filter: blur(12px);
  border: 1px solid var(--una-border); border-radius: var(--una-radius);
  box-shadow: var(--una-shadow-rest);
  transition: transform .3s var(--una-ease), box-shadow .3s var(--una-ease);
}
.una-card::before {
  content: ''; position: absolute; inset: 0 0 auto 0; height: 2px;
  background: var(--una-gold); transform: scaleX(0); transform-origin: left;
  transition: transform .4s var(--una-ease);
}
.una-card:hover { transform: translateY(-2px); box-shadow: var(--una-shadow-hover); }
.una-card:hover::before { transform: scaleX(1); }

.una-eyebrow {
  display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;
  font: 700 10px/1 var(--una-font-ui); letter-spacing: .3em; text-transform: uppercase;
  color: var(--una-accent);
}
.una-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--una-gold); flex-shrink: 0; }

.una-title { font-family: var(--una-font-display); font-weight: 500; line-height: 1.05; letter-spacing: -0.01em; color: var(--una-text-strong); }
.una-title em { font-style: italic; font-weight: 400; color: var(--una-accent); }

.una-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 22px; border-radius: var(--una-radius); cursor: pointer;
  font: 700 11px/1 var(--una-font-ui); letter-spacing: .18em; text-transform: uppercase;
  transition: all .2s ease;
}
.una-btn--primary { background: var(--una-accent); color: #030712; border: 0; }
.una-btn--primary:hover { background: var(--una-accent-hover); }
.una-btn--gold { background: var(--una-gold); color: #030712; border: 0; }
.una-btn--gold:hover { background: var(--una-gold-hover); box-shadow: 0 8px 24px rgba(253,195,0,.25); }
.una-btn--ghost { background: transparent; color: var(--una-text-2); border: 1px solid var(--una-border-ui); }

.una-input {
  padding: 12px 16px; border-radius: var(--una-radius);
  background: var(--una-card); border: 1px solid var(--una-border-ui);
  font: 400 14px var(--una-font-ui); color: var(--una-text-strong);
}
.una-input:focus { border-color: #0EA5E9; outline: 2px solid rgba(14,165,233,.30); outline-offset: 2px; }

.una-num { font-family: var(--una-font-num); font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  .una-card, .una-card::before, .una-btn { transition: none !important; }
}
```

---

## 10. Checklist: restyling another file to match

1. **Pick the mode** for each screen with §1. Dark is the default for public, marketing and chrome; light is for workspaces, forms and data.
2. **Swap the background and surfaces** using §3 (page bg → card bg → border → shadow).
3. **Retype:** body and UI → Inter; every H1/H2/modal title → Playfair 500 with `-0.01em` and **one italic accent word**; every number, price or code → JetBrains Mono.
4. **Add an eyebrow** above each section or page title (UPPERCASE, `0.3em`, 32px line).
5. **Square the corners** to 2px everywhere except analytical chart panels (8–12px).
6. **Recolor interaction:** links, focus and primary buttons → cyan `#0EA5E9` (navy `#03488D` in editorial light); CTA and active state → yellow (`#FDC300` dark / `#F8D227` light). Yellow is for accents only, never large fills except CTAs.
7. **Labels and table heads** → 9–11px, 600–700, uppercase, tracking `0.2–0.3em`, muted slate.
8. **Hover behaviour:** cards lift 2px with a bigger shadow and the gold top bar; buttons change color in 0.2s; close buttons rotate 90°. Use `cubic-bezier(0.2,0.8,0.2,1)`.
9. **Status:** use the pill palette (§2.5); deltas use ▲ green / ▼ red, in mono.
10. **Charts:** white or glass panel, `#E2E8F0` dashed grid, series from §2.4, 2–2.5px lines, tooltip `rounded-lg border shadow-lg` with `#1A2B4A` labels.
11. **Accessibility:** keep the reduced-motion block, visible focus rings (2px cyan), `aria-hidden` on decorative icons, the skip link, and focus trap/return in overlays.
12. **Spanish UI copy**, sentence case in body; UPPERCASE only for labels, eyebrows and buttons.

---

## 11. Known inconsistencies in this codebase (don't copy them blindly)

| Issue | Detail | Recommendation |
|---|---|---|
| Quicksand not loaded | `font-quicksand` is used ~320 times (mostly market-intelligence, comercio-exterior, `Button`, `Accordion`) but no font file is loaded, so it falls back to system sans | Use Inter (or load Quicksand on purpose) |
| `font-serif` ≠ Playfair | `font-serif` is Tailwind's default serif stack (Georgia…). Used in `PageHeader` H1, `HomeHero`, `HomeProductos` | Use `font-playfair` |
| `font-heading` | Only defined inside `.dashboard-light` | Use `font-playfair` |
| Two yellows | `#FDC300` (dark system) vs `#F8D227` (legacy/light) | `#FDC300` on dark, `#F8D227` on light editorial |
| Two primary blues | Cyan `#0EA5E9` (CME) vs navy `#03488D` (legacy) plus `#1A4D8F` / `#1D5E9D` / `#0A2240` hardcoded | Cyan for interaction; navy for editorial headings/accents |
| `--color-hairline-yellow` defined twice | The second one wins: `rgba(248,210,39,0.25)` | Treat `border-hairline-yellow` as 25% yellow |
| Hardcoded hex in dashboards | Market-intelligence components use inline hex (`#1A2B4A`, `#9AA5B1`, `#E2E8F0`, …) instead of tokens | Map them to the tokens in §2.3 when porting |
| Radius drift | `rounded-lg` / `rounded-xl` / `rounded-md` used alongside 2px | Follow §5.1 |
| `KPICard` value uses `text-slate-900` | It's only readable inside a light scope | Use `--una-text-strong` |
| Light overrides use `!important` | `.admin-main-light .text-slate-100 { color: #0f172a !important }` etc. | In new code, prefer CSS variables (§9.2) over class remapping |
