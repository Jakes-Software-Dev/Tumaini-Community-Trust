# TODO — Tumaini Community Trust website

Approved Blueprint features are the acceptance criteria below. Evidence is noted per item.

## 1. Responsive multi-page structure — DONE
- [x] Informational page structure covering Home, About, Programs, Campaigns, Blog and Contact destinations.
- [x] Content stacks cleanly on smartphones (mobile-first); verified by screenshot capture at 375px, 768px-class and 1280px widths.
- [x] Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) with valid markup on every page.

## 2. Sticky site header — DONE
- [x] Sticky header with a logo placeholder (SVG woven-diamond mark + "Tumaini / Community Trust" wordmark).
- [x] Navigation links to Home, About, Programs, Campaigns, Blog and Contact, with `aria-current="page"` on the active route.
- [x] Prominent "Donate Now" action in the header (and in the footer bottom bar).
- [x] Mobile menu (accessible toggle, `aria-expanded`, Escape to close, 48px controls).

## 3. Home hero — DONE
- [x] Compelling NGO headline ("Hope that is built by the people who live here.").
- [x] Concise mission statement / mission hook.
- [x] Primary "Donate Now" button (Paystack, new tab).
- [x] Secondary "Learn More" button linking to `/about/`.

## 4. Programs grid — DONE
- [x] Responsive card grid: `lg:grid-cols-3` on larger screens, single column on mobile.
- [x] Each card shows program title, short summary and a "Read More" action linking to the program section.

## 5. Campaign media area — DONE
- [x] Clean video cards containing responsive 16:9 YouTube iframe containers (`.video-frame`, `aspect-ratio: 16/9`), lazily loaded.
- [x] Campaign imagery and costed copy alongside the video cards (home + campaigns page).

## 6. Paystack donation links — DONE
- [x] Every "Donate Now" button links to `https://paystack.com/pay/ngo-donate` with `target="_blank"` and `rel="noopener noreferrer"`.
- [x] Styled as prominent primary action buttons (amber `.btn-primary`, 48px minimum height).

## 7. Footer — DONE
- [x] Quick navigation links (all six routes).
- [x] NGO contact information (Kisumu address, postal address, phone, email, office hours).
- [x] Social links (Facebook, Instagram, X, LinkedIn, YouTube).
- [x] Copyright text with dynamic year.

## 8. Design system and accessibility — DONE
- [x] Deep Green `#1b4332`, Warm Gold/Amber `#d4a373`, Off-white `#f8f9fa`, Charcoal `#212529` applied consistently through Tailwind theme tokens.
- [x] Inter (body) and Poppins (display) self-hosted as woff2; Inter is a variable font (verified `fvar` axis 100-900).
- [x] Responsive image wrappers with `aspect-*` containers plus `width`/`height` attributes; every image has meaningful `alt` text.
- [x] Accessible: skip link, visible focus rings, ARIA labels for icon-only controls, `prefers-reduced-motion` handling.
- [x] Quick-loading: one 30KB compiled stylesheet, no blocking third-party requests, images resized/compressed (116-321KB WebP), below-fold images lazy-loaded.

## 9. SEO and social metadata — DONE
- [x] Per-page `<title>` and `<meta name="description">` within panel thresholds.
- [x] OpenGraph tags: `og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`, `og:image`, `og:image:alt`, `og:locale`.
- [x] Twitter card tags, canonical link, meta keywords (5-6), one `<h1>` per page, `<h2>` under 80 characters.
- [x] `sitemap.xml`, `robots.txt`, `favicon.svg`, `manus-routes.json` route manifest, NGO JSON-LD block.

## 10. Delivery — CHECKPOINTED, NOT PUBLISHED
- [x] Static publication configured (`build.command: "true"`, `build.outputDirectory: "public"` containing `index.html`).
- [x] Project logo metadata (`logoUrl`) set in `app.config.ts`.
- [x] Checkpoint `ca9489c` committed and pushed to `origin/main` (recorded platform version).
- [ ] Publication: a model-initiated publish was submitted and **declined by the user**, so the site is
      live on Preview only. Nothing has been published. Publish from the Dashboard when ready, and first
      set `SITE.origin` in `build.mjs` to the final domain so `canonical`, `og:url`, `og:image` and
      `sitemap.xml` point at the production origin.
