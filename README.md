# Tumaini Community Trust — website

A five-page (six routes) informational website for a newly launching Kenyan NGO, built as
mobile-first, semantic HTML5 with a compiled Tailwind CSS v4 stylesheet. There is no runtime
framework and no backend: the published site is static files in `public/`.

## Design system

| Token | Value | Use |
| --- | --- | --- |
| Deep Green | `#1b4332` (`--color-forest`) | Primary brand, headings, dark bands |
| Warm Gold/Amber | `#d4a373` (`--color-gold`) | Primary buttons, accents, woven motif |
| Off-white | `#f8f9fa` (`--color-cream`) | Page background |
| Charcoal | `#212529` (`--color-charcoal`) | Body text |
| Typography | Poppins (display) + Inter (body), self-hosted | `src/fonts.css` |

Signature motifs: a woven "kanga" stripe rule (`#kanga-rule`), a lattice background
(`.woven`, `.woven-dark`), gold offset frames around photographs (`.frame-accent`) and
numbered program markers.

Accessibility and mobile rules applied throughout: 48px minimum touch targets (`.btn`
is `min-height: 3rem`), visible focus rings, a skip link, ARIA labels on icon-only
controls, `prefers-reduced-motion` support, and meaningful `alt` text on every image.

## Project structure

```
build.mjs              Static site generator: head/metadata, header, footer, sitemap, routes
server.mjs             Local + Preview static server (clean URLs, MIME types, 404 page)
src/tailwind.css       Design tokens, base styles and component classes
src/fonts.mjs          Downloads and self-hosts Inter + Poppins
src/fonts.css          Generated @font-face rules (do not edit by hand)
src/pages/*.html       Page bodies (content only — no <head>, header or footer)
src/brand/             Logo source (PNG rendered from the SVG mark)
public/                Build output — this is what gets published
  index.html, about/, programs/, campaigns/, blog/, contact/, 404.html
  assets/css/styles.css, assets/js/site.js, assets/fonts/, assets/img/
  favicon.svg, sitemap.xml, robots.txt, manus-routes.json
```

## Commands

```bash
npm run build:css   # compile src/tailwind.css -> public/assets/css/styles.css
npm run watch:css   # same, in watch mode
node build.mjs      # regenerate the HTML pages, sitemap, robots and route manifest
npm run serve       # serve public/ on http://0.0.0.0:3000
```

Full rebuild: `node src/fonts.mjs && node build.mjs && npm run build:css`.

## Deployment

Publication is static: `build.command` is `true` and `build.outputDirectory` is `public`,
because the compiled CSS, fonts, images and HTML are all committed. Run the commands above
before committing whenever you change `src/`.

## Content that must be replaced before launch

These values are deliberate placeholders and appear in several places:

1. **Donation link** — `https://paystack.com/pay/ngo-donate` (every "Donate Now" button,
   `SITE.donate` in `build.mjs`).
2. **Contact details** — phone `+254 712 345 678`, `hello@tumainitrust.org`,
   `safeguarding@tumainitrust.org`, the Kisumu address, Paybill `400200` / account `TUMAINI`.
3. **Registration and figures** — NGO Coordination Board registration number, board and team
   names, campaign targets and amounts raised, and the 2026 work-plan numbers.
4. **Social links** — the five handles in `SITE.social`.
5. **Public origin** — `SITE.origin` in `build.mjs` drives `canonical`, `og:url`,
   `og:image` and `sitemap.xml`; set it to the final domain after publication.
6. **Video embeds** — the five YouTube IDs on the homepage and campaigns page are real,
   publicly embeddable third-party films used as placeholders for the organisation's own
   campaign footage.
