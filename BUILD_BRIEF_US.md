# Build brief — Direct Hire, United States

Single long-form marketing page for CloudEmployee's US permanent-placement
offer, built on the CE Design System. Covers what exists in the repository
today, how the page is assembled, and what must be resolved before launch.

- **Owner:** Marketing / Web
- **Locale:** en-US
- **Status:** build complete, real photography and video outstanding

---

## 1. What is in the project

Two parallel implementations of the same page, both driven by the same tokens.

| Path | What it is |
| --- | --- |
| `static-site/index.html` | Static build. Opens directly in a browser, no toolchain. Visually verified. |
| `static-site/css/tokens.css` | CE Design System tokens — colour ramps, type scale, spacing, radii, elevation, motion. |
| `static-site/css/style.css` | Component and section styles for the static build. |
| `static-site/js/main.js` | GSAP + ScrollTrigger scroll animations, accordion, tabs, modal, scroll progress. |
| `web/` | Next.js 14 (App Router) port of the same page. Never installed or run — treat as an unverified manual port. |
| `static-site/serve.ps1` | Local static server for the plain HTML build (wired up in `.claude/launch.json` on port 8891). |

The Next.js app splits the page into `components/sections/` (one file per
section), `components/ds/` (design-system primitives) and `lib/content/us.js`
(every string as data), so the US and UK routes share components and differ
only in content. `web/styles/tokens.css` and `web/styles/components.css` are
carried over from `static-site/css/` **and currently match it byte-for-byte** —
see §7.

---

## 2. Page structure

Nine sections between a sticky navbar and the footer. Every primary CTA opens
the same "Start a search" modal.

| # | Section | Purpose | Notable UI |
| --- | --- | --- | --- |
| 1 | Hero | Positioning claim and primary CTA | Shortlist panel with two candidate cards, three trust checks |
| 2 | Problem | "AI ruined hiring" — why job posts fail | Animated job-post grid with floating profile cards |
| 3 | Explainer (`#how`) | 90-second CEO video | Video placeholder, to be filmed |
| 4 | Process (`#process`) | Three stages, then two stages in detail | Stage cards, live code panel, candidate report card with tabs and scores, funnel table |
| 5 | De-risk band | Four guarantees in one strip | Full-width band, animated on scroll |
| 6 | Differentiators | Four things a recruiter cannot do | Icon-tile feature cards |
| 7 | Pricing (`#pricing`) | Published fee, worked example | Pricing card plus rationale for the up-front payment |
| 8 | FAQ (`#faq`) | Ten questions founders and CTOs ask | Accordion, first item open by default; side card links to chatbot |
| 9 | Closing CTA | Restates the claim, two CTAs | Display heading, fine print |

**Modal:** work email, seniority select, role textarea, weekly-updates
checkbox. Currently front-end only — no submit handler in either the static
build or the Next.js port's `SearchModal.jsx`. Point it at the form endpoint
before launch.

**Header:** 71px, fixed, `rgba(7,13,24,0.92)` over `blur(10px)`. A 2px accent
scroll-progress bar sits directly beneath it, hidden under 768px.

---

## 3. Design system and tokens

Everything comes from the CE Design System. Nothing is hardcoded, and no
component outside the system was introduced.

| Token | Value | Use |
| --- | --- | --- |
| `--navy-1000` | `#070D18` | Page ground |
| `--lime-500` | `#D4FF3C` | The single accent |
| `--lime-hover` | `#E1FF6B` | Hover |
| `--lime-active` | `#C4F522` | Press |
| `--teal-500` | `#4A9B9B` | A strong score |
| `--amber-500` | `#C8862A` | A caveat, an unfinished slot |
| `--red-500` | `#E4646A` | Live indicator |
| `--border-hairline` | `#22314D` | Card hairlines (removed on this build) |

The accent is rationed: kickers, the primary button, checks, the serif
emphasis clause, and the funnel table's outcome row. Nowhere else.

Type is Inter in four weights, plus Source Serif 4 Italic for exactly one
clause per heading, always in the accent. h1 60px at −1.68px tracking, h2 44px
at −1.232px, lead 19.5px, body 15.5–17px. Sentence case throughout except
uppercase kickers; headings take full stops.

Layout is a 1180px container with 32px gutters, 22px card-row gaps, and radii
scaling with size (4px chips through 22px hero cards, full pill for controls).

### Two approved deviations from the Figma source

1. **No section divider hairlines.** The Figma separates sections with 1px
   `#22314D` rules. This build removes all 1px borders; whitespace separates
   sections instead.
2. **Uniform 140px section rhythm.** Figma uses ~98px padding with 155px
   between major blocks. Every section boundary here uses a single
   `--space-section-gap: 140px` token instead — the hero itself keeps its own
   155px top offset since it sits directly under the fixed header rather than
   between two sections. Compresses to 72px under 768px.

---

## 4. Motion

GSAP 3.12 with ScrollTrigger. Global ease `power3.out`; reveals use
`toggleActions: 'play none none none'` so nothing replays on scroll-back.

On load: header drops in, hero copy staggers up, the shortlist panel rises and
scales, then the candidate cards. On scroll: generic reveals at `top 86%`,
section headers at `top 88%`, the applicant grid cells scatter in from random
order and dim as they leave, the video panel wipes open via `clipPath`, report
bars scale from the left while their percentages count up, and the funnel table
plays row by row.

Micro-interactions are CSS only — 80–320ms on colour, background and ring.
Nothing scales or translates on press. `prefers-reduced-motion` skips GSAP
entirely and zeroes every duration token. Non-negotiable.

**Rejected in review, do not reintroduce:** a pinned scroll-scrub on the funnel
table. The plain staggered reveal replaced it.

---

## 5. Responsive

| Breakpoint | Behaviour |
| --- | --- |
| ≥1281px | As authored. 1180px container, three-across cards, two-column splits. |
| 1024–1280px | h1 48px, h2 36px. Splits become `1fr 1fr`. Stage cards two-across. |
| 768–1023px | All grids single column. Media panels full width. Shortlist panel drops below the hero copy. |
| <768px | h1 38px, h2 30px, lead 17px. Gutters 20px, card padding 20px, section rhythm 72px. Nav keeps wordmark plus CTA. Progress bar hidden. |

Control heights stay at 58.39 / 52 / 46.39px, all above the 44px touch minimum.

---

## 6. Accessibility

A 2px accent focus outline at 2px offset sits on every focusable element,
declared once in the tokens. Never remove it. `--text-muted` is for 15px and
above only; `--text-subtle` for annotations and disabled states. The accent
badge label inherits `--text-muted` on accent (~2.6:1) from the Figma —
override the colour wherever that label carries meaning. The accordion uses
real buttons with `aria-expanded`, tabs set `role="tablist"`, the modal is
`role="dialog" aria-modal` and closes on Escape, and the applicant grid is
`aria-hidden`.

---

## 7. Outstanding before launch

- **Photography.** Every photo slot is a striped navy tile labelled "REAL
  PHOTO". Supply real photography or leave the slot visible. Do not substitute
  stock, illustration or generated portraits.
- **Video.** The explainer is a placeholder marked "VIDEO SLOT — TO FILM".
- **Logo.** No logo asset exists; the wordmark is a ring beside the name.
  Replace the ring if a real mark is supplied.
- **Modal endpoint.** No submission is wired.
- **Annotation chips.** The "Illustrative" and "Video slot" chips are behind a
  flag — switch them off at launch.
- **Fonts.** Inter and Source Serif 4 load via `@import` in `tokens.css` from
  Google Fonts. Swap to local `@font-face` (or `next/font/local`) if licensed
  copies arrive.
- **Verify the Next.js port.** `web/` has been installed and built
  (`npm run build` compiles cleanly, all routes prerender). Compare visually
  against `static-site/index.html`, which has been checked in a browser.

Resolved, no action needed: the design system reverted its accent from
yellow (`#FCFF3C`) back to lime (`#D4FF3C`) per the Claude Design project's
`repo_patch/tokens.css`. `static-site/css/tokens.css` and `web/styles/tokens.css`
have been patched to match — both now carry the lime accent and remain
byte-identical to each other. No other token file (type, spacing, layout,
motion, elevation, base) changed. No reconciliation work remains there.

---

## 8. Copy

Every string is final and transcribed from the Figma. Do not rewrite, tighten
or correct it — including "Its easy to get 500 applicants in a week." Pull
exact strings from `web/lib/content/us.js` rather than retyping them.
