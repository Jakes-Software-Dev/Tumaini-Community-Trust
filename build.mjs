/**
 * Tumaini Community Trust — static site generator.
 *
 * Reads the page bodies in src/pages/*.html and writes complete, semantic HTML5
 * documents into public/ (shared header, footer, metadata, JSON-LD, sitemap).
 *
 * Usage: node build.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(".");
const OUT = path.join(ROOT, "public");

/* -------------------------------------------------------------------------- */
/* Site facts                                                                  */
/* -------------------------------------------------------------------------- */
const SITE = {
  name: "Tumaini Community Trust",
  short: "Tumaini",
  tagline: "Hope, woven locally.",
  origin: "https://8328-if3l7f2ffj7xabsq50t89-d8c08184.us4.manus.computer",
  donate: "https://paystack.com/pay/ngo-donate",
  email: "hello@tumainitrust.org",
  phone: "+254 712 345 678",
  phoneHref: "tel:+254712345678",
  whatsapp: "https://wa.me/254712345678",
  postal: "P.O. Box 4318-40100, Kisumu",
  reg: "Registered by the NGO Coordination Board · Reg. No. OP.218/051/9128",
  founded: "Founded 2025 · Launching 2026",
  addressLines: ["Awuor Plaza, 2nd Floor", "Oginga Odinga Street", "Kisumu 40100, Kenya"],
  hours: "Monday – Friday, 8:00am – 5:00pm EAT",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/tumainitrust", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/tumainitrust", icon: "instagram" },
    { label: "X", href: "https://x.com/tumainitrust", icon: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tumainitrust", icon: "linkedin" },
    { label: "YouTube", href: "https://www.youtube.com/@tumainitrust", icon: "youtube" },
  ],
};

/* Images generated for this project, committed under public/assets/img/. */
const IMG = {
  hero: "/assets/img/hero-community.webp",
  about: "/assets/img/about-team.webp",
  education: "/assets/img/program-education.webp",
  water: "/assets/img/program-water.webp",
  livelihoods: "/assets/img/program-livelihoods.webp",
  health: "/assets/img/program-health.webp",
  campaignClassrooms: "/assets/img/campaign-classrooms.webp",
  campaignBorehole: "/assets/img/campaign-borehole.webp",
  blogMapping: "/assets/img/blog-mapping.webp",
  blogDigital: "/assets/img/blog-digital.webp",
  blogFarm: "/assets/img/blog-farm.webp",
};

const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Programs", href: "/programs/" },
  { label: "Campaigns", href: "/campaigns/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

const PAGES = [
  {
    slug: "",
    url: "/",
    nav: "Home",
    file: "home.html",
    title: "Tumaini Community Trust | Hope, woven locally",
    description:
      "Tumaini Community Trust is a Kenyan NGO working with rural communities on education, clean water, women's livelihoods and health. Donate today.",
    keywords: "Kenyan NGO, charity Kenya, community development, clean water Kenya, education Kenya",
    image: IMG.hero,
    imageAlt:
      "Kenyan women and children standing together at golden hour, one woman holding a seedling",
  },
  {
    slug: "about",
    url: "/about/",
    nav: "About",
    file: "about.html",
    title: "About us | Tumaini Community Trust, Kenya",
    description:
      "Who we are: a Kenyan-led trust founded on community mapping, transparent reporting and locally hired teams working across the lake region.",
    keywords: "about Tumaini Community Trust, Kenyan-led NGO, non-profit transparency, Kisumu NGO",
    image: IMG.about,
    imageAlt: "Community meeting under a timber shade structure with a facilitator at a flipchart",
  },
  {
    slug: "programs",
    url: "/programs/",
    nav: "Programs",
    file: "programs.html",
    title: "Programs | Education, water, livelihoods, health",
    description:
      "Four programs, one method: classrooms and bursaries, clean water and sanitation, women's savings groups, and mobile community health outreach.",
    keywords: "NGO programs Kenya, education program, WASH Kenya, women's livelihoods, health outreach",
    image: IMG.education,
    imageAlt: "Children in green school sweaters writing at shared wooden desks in a bright classroom",
  },
  {
    slug: "campaigns",
    url: "/campaigns/",
    nav: "Campaigns",
    file: "campaigns.html",
    title: "Campaigns | Fund a Kenyan community today",
    description:
      "Three live campaigns: a classroom block, twelve boreholes and a seed fund for market traders. Give once, monthly or on behalf of a group.",
    keywords: "donate Kenya, fundraising campaign, borehole appeal, school campaign, give monthly",
    image: IMG.campaignBorehole,
    imageAlt: "Borehole drilling rig working on dry cracked earth while villagers watch",
  },
  {
    slug: "blog",
    url: "/blog/",
    nav: "Blog",
    file: "blog.html",
    title: "Field notes & stories | Tumaini Community Trust",
    description:
      "Honest field notes from our teams in Kisumu, Homa Bay and Migori: what worked, what failed, and what the numbers behind the work look like.",
    keywords: "NGO blog, field notes, Kenya development stories, community mapping, savings groups",
    image: IMG.blogMapping,
    imageAlt: "Hands drawing a village map on flipchart paper during a community mapping session",
  },
  {
    slug: "contact",
    url: "/contact/",
    nav: "Contact",
    file: "contact.html",
    title: "Contact & visit us | Tumaini Community Trust",
    description:
      "Reach our Kisumu office, request a partnership pack, ask about volunteering or book a visit to see a project on the ground. We reply within two days.",
    keywords: "contact NGO Kenya, Kisumu office, partnership, volunteer Kenya, donate questions",
    image: IMG.health,
    imageAlt: "Nurse checking a toddler's chest during a mobile health outreach clinic",
  },
];

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */
const ICONS = {
  facebook:
    '<path d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.2l.5-3H13v-1.2c0-.5.2-.8.5-.8Z"/>',
  instagram:
    '<path d="M12 8.6A3.4 3.4 0 1 0 15.4 12 3.4 3.4 0 0 0 12 8.6Zm0 5.6A2.2 2.2 0 1 1 14.2 12 2.2 2.2 0 0 1 12 14.2ZM16.4 3.5H7.6A4.1 4.1 0 0 0 3.5 7.6v8.8a4.1 4.1 0 0 0 4.1 4.1h8.8a4.1 4.1 0 0 0 4.1-4.1V7.6a4.1 4.1 0 0 0-4.1-4.1Zm2.9 12.9a2.9 2.9 0 0 1-2.9 2.9H7.6a2.9 2.9 0 0 1-2.9-2.9V7.6a2.9 2.9 0 0 1 2.9-2.9h8.8a2.9 2.9 0 0 1 2.9 2.9Zm-3.3-9a.9.9 0 1 0 .9.9.9.9 0 0 0-.9-.9Z"/>',
  x: '<path d="M17.5 4h2.6l-5.7 6.5L21 20h-5.3l-3.7-4.8L7.8 20H5.2l6.1-6.9L4.6 4h5.4l3.4 4.5Zm-.9 14.1h1.4L8.1 5.8H6.6Z"/>',
  linkedin:
    '<path d="M6.9 8.7H4.2V20h2.7ZM5.5 4a1.6 1.6 0 1 0 1.6 1.6A1.6 1.6 0 0 0 5.5 4Zm9.1 4.5A3.6 3.6 0 0 0 11.4 10V8.7H8.8V20h2.7v-5.9c0-1.6.8-2.5 2-2.5s1.8.8 1.8 2.5V20h2.7v-6.4c0-2.9-1.5-5.1-4.4-5.1Z"/>',
  youtube:
    '<path d="M20.5 8.2a2.3 2.3 0 0 0-1.6-1.6C17.4 6.2 12 6.2 12 6.2s-5.4 0-6.9.4A2.3 2.3 0 0 0 3.5 8.2 24 24 0 0 0 3.1 12a24 24 0 0 0 .4 3.8 2.3 2.3 0 0 0 1.6 1.6c1.5.4 6.9.4 6.9.4s5.4 0 6.9-.4a2.3 2.3 0 0 0 1.6-1.6 24 24 0 0 0 .4-3.8 24 24 0 0 0-.4-3.8ZM10.3 15V9l5.2 3Z"/>',
  mail: '<path d="M3.5 6.5h17v11h-17Zm1.9 1.6 6.6 4.6 6.6-4.6Zm13.2 1.1-6.6 4.6-6.6-4.6v6.7h13.2Z"/>',
  phone:
    '<path d="M7.1 3.8h3l1.5 3.7-1.9 1.4a12.4 12.4 0 0 0 5.4 5.4l1.4-1.9 3.7 1.5v3a1.8 1.8 0 0 1-2 1.8A15.6 15.6 0 0 1 5.3 5.8a1.8 1.8 0 0 1 1.8-2Z"/>',
  pin: '<path d="M12 3.2A6.3 6.3 0 0 0 5.7 9.5c0 4.6 6.3 11.3 6.3 11.3s6.3-6.7 6.3-11.3A6.3 6.3 0 0 0 12 3.2Zm0 8.6a2.3 2.3 0 1 1 2.3-2.3A2.3 2.3 0 0 1 12 11.8Z"/>',
  clock: '<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.5 8.5 0 0 0 12 3.5Zm0 15.4A6.9 6.9 0 1 1 18.9 12 6.9 6.9 0 0 1 12 18.9Zm.8-11.2h-1.6v5.1l4 2.4.8-1.3-3.2-1.9Z"/>',
  arrowRight: '<path d="M13.2 5.2 11.8 6.6l4.1 4.2H4.5v2h11.4l-4.1 4.2 1.4 1.4L19.5 12Z"/>',
  check: '<path d="M9.6 16.3 5.8 12.5l-1.4 1.4 5.2 5.2L20.4 8.3l-1.4-1.4Z"/>',
  play: '<path d="M8 5.2v13.6L19 12Z"/>',
  menu: '<path d="M4 6.5h16v2H4Zm0 4.5h16v2H4Zm0 4.5h16v2H4Z"/>',
  close:
    '<path d="M18.3 7.1 16.9 5.7 12 10.6 7.1 5.7 5.7 7.1l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9Z"/>',
  shield:
    '<path d="M12 2.8 4.8 5.6v5.9c0 4.3 3 8.3 7.2 9.7 4.2-1.4 7.2-5.4 7.2-9.7V5.6Zm-1.1 13-3-3 1.4-1.4 1.6 1.6 3.9-3.9 1.4 1.4Z"/>',
};

function icon(name, className = "h-5 w-5") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

function logoSvg(className = "h-11 w-11") {
  return `<svg class="${className}" viewBox="0 0 48 48" role="img" aria-label="Tumaini Community Trust logo mark" focusable="false">
        <path d="M24 3 44 24 24 45 4 24Z" fill="#1b4332"/>
        <path d="M24 10.5 36.5 24 24 37.5 11.5 24Z" fill="#2d6a4f"/>
        <path d="M24 17c3.6 2 5.5 4.4 5.5 7s-2.2 4.6-5.5 7c-3.3-2.4-5.5-4.4-5.5-7s1.9-5 5.5-7Z" fill="#d4a373"/>
        <circle cx="24" cy="24" r="2.1" fill="#1b4332"/>
      </svg>`;
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */
function renderHead(page, is404 = false) {
  const canonical = `${SITE.origin}${page.url}`;
  const ogImage = `${SITE.origin}${page.image}`;
  const robots = is404 ? "noindex, follow" : "index, follow, max-image-preview:large";

  return `<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.keywords}">
    <meta name="author" content="${SITE.name}">
    <meta name="robots" content="${robots}">
    <meta name="theme-color" content="#1b4332">
    <link rel="canonical" href="${canonical}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE.name}">
    <meta property="og:locale" content="en_KE">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:alt" content="${page.imageAlt}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${ogImage}">
    <meta name="twitter:image:alt" content="${page.imageAlt}">

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <link rel="preload" href="/assets/fonts/inter-normal-variable.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/poppins-normal-700.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/assets/css/styles.css">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "${SITE.name}",
        "alternateName": "${SITE.short}",
        "url": "${SITE.origin}/",
        "logo": "${SITE.origin}/favicon.svg",
        "slogan": "${SITE.tagline}",
        "foundingDate": "2025",
        "email": "${SITE.email}",
        "telephone": "${SITE.phone}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Awuor Plaza, 2nd Floor, Oginga Odinga Street",
          "addressLocality": "Kisumu",
          "postalCode": "40100",
          "addressCountry": "KE"
        },
        "areaServed": "Kenya",
        "sameAs": [${SITE.social.map((s) => `"${s.href}"`).join(", ")}]
      }
    </script>`;
}

function renderHeader(active) {
  const desktopLinks = NAV.map(
    (item) =>
      `<li><a class="nav-link" href="${item.href}"${
        item.label === active ? ' aria-current="page"' : ""
      }>${item.label}</a></li>`,
  ).join("\n            ");

  const mobileLinks = NAV.map(
    (item) =>
      `<a class="nav-link-mobile" href="${item.href}"${
        item.label === active ? ' aria-current="page"' : ""
      }>${item.label}</a>`,
  ).join("\n          ");

  return `<header id="site-header" class="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur transition-shadow duration-200">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <a href="/" class="flex items-center gap-2.5" aria-label="${SITE.name} — home">
          ${logoSvg("h-10 w-10 shrink-0")}
          <span class="leading-none">
            <span class="block font-display text-lg font-bold tracking-tight text-forest-deep">Tumaini</span>
            <span class="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">Community Trust</span>
          </span>
        </a>

        <nav class="hidden lg:block" aria-label="Primary">
          <ul class="flex items-center gap-0.5">
            ${desktopLinks}
          </ul>
        </nav>

        <div class="flex items-center gap-2">
          <a class="btn btn-primary btn-sm" href="${SITE.donate}" target="_blank" rel="noopener noreferrer">
            <span class="sm:hidden">Donate</span>
            <span class="hidden sm:inline">Donate Now</span>
          </a>
          <button id="menu-toggle" type="button" class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-forest lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
            <span data-icon="open">${icon("menu", "h-6 w-6")}</span>
            <span data-icon="close" class="hidden">${icon("close", "h-6 w-6")}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden border-t border-line bg-cream lg:hidden">
        <nav class="mx-auto max-w-6xl px-4 pb-4 pt-1 sm:px-6" aria-label="Mobile">
          ${mobileLinks}
        </nav>
      </div>

      <div class="kanga-rule" role="presentation"></div>
    </header>`;
}

function renderFooter() {
  const quickLinks = NAV.map(
    (item) => `<li><a class="text-sm text-cream/85 hover:text-gold" href="${item.href}">${item.label}</a></li>`,
  ).join("\n            ");

  const programLinks = [
    ["Classrooms & Scholarships", "/programs/#education"],
    ["Water, Sanitation & Hygiene", "/programs/#water"],
    ["Women's Livelihoods", "/programs/#livelihoods"],
    ["Community Health Outreach", "/programs/#health"],
    ["Live campaigns", "/campaigns/"],
  ]
    .map(([label, href]) => `<li><a class="text-sm text-cream/85 hover:text-gold" href="${href}">${label}</a></li>`)
    .join("\n            ");

  const socials = SITE.social
    .map(
      (s) =>
        `<a class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold hover:text-gold" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${SITE.name} on ${s.label}">${icon(s.icon)}</a>`,
    )
    .join("\n            ");

  return `<footer class="woven-dark text-cream">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div class="lg:col-span-1">
            <a href="/" class="flex items-center gap-2.5" aria-label="${SITE.name} — home">
              ${logoSvg("h-10 w-10 shrink-0")}
              <span class="leading-none">
                <span class="block font-display text-lg font-bold tracking-tight text-white">Tumaini</span>
                <span class="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold">Community Trust</span>
              </span>
            </a>
            <p class="mt-4 text-sm text-cream/80">
              A Kenyan-led trust working alongside rural communities on education, water, livelihoods and health.
              ${SITE.tagline}
            </p>
            <p class="mt-3 text-xs text-cream/60">${SITE.founded}<br>${SITE.reg}</p>
          </div>

          <nav aria-label="Footer quick links">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">Quick links</h2>
            <ul class="mt-4 space-y-2.5">
            ${quickLinks}
            </ul>
          </nav>

          <nav aria-label="Footer programs">
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">Our programs</h2>
            <ul class="mt-4 space-y-2.5">
            ${programLinks}
            </ul>
          </nav>

          <div>
            <h2 class="font-display text-sm font-semibold uppercase tracking-[0.16em] text-gold">Contact</h2>
            <ul class="mt-4 space-y-3 text-sm text-cream/85">
              <li class="flex gap-2.5">${icon("pin", "mt-0.5 h-5 w-5 shrink-0 text-gold")}<span>${SITE.addressLines.join("<br>")}<br>${SITE.postal}</span></li>
              <li class="flex gap-2.5">${icon("phone", "mt-0.5 h-5 w-5 shrink-0 text-gold")}<a class="hover:text-gold" href="${SITE.phoneHref}">${SITE.phone}</a></li>
              <li class="flex gap-2.5">${icon("mail", "mt-0.5 h-5 w-5 shrink-0 text-gold")}<a class="hover:text-gold" href="mailto:${SITE.email}">${SITE.email}</a></li>
              <li class="flex gap-2.5">${icon("clock", "mt-0.5 h-5 w-5 shrink-0 text-gold")}<span>${SITE.hours}</span></li>
            </ul>
            <div class="mt-5 flex flex-wrap gap-2.5">
            ${socials}
            </div>
          </div>
        </div>

        <div class="mt-12 flex flex-col gap-4 border-t border-cream/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-cream/70">© <span data-year>2026</span> ${SITE.name}. All rights reserved. Made in Kisumu, Kenya.</p>
          <a class="btn btn-primary btn-sm" href="${SITE.donate}" target="_blank" rel="noopener noreferrer">Donate Now</a>
        </div>
      </div>
    </footer>`;
}

function renderDocument({ page, body, is404 = false }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${renderHead(page, is404)}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    ${renderHeader(page.nav)}
    <main id="main">
${body}
    </main>
    ${renderFooter()}
    <script src="/assets/js/site.js" defer></script>
  </body>
</html>
`;
}

/* -------------------------------------------------------------------------- */
/* Build                                                                       */
/* -------------------------------------------------------------------------- */
async function build() {
  await mkdir(OUT, { recursive: true });

  for (const page of PAGES) {
    const body = (await readFile(path.join(ROOT, "src/pages", page.file), "utf8")).trimEnd();
    const dir = page.slug ? path.join(OUT, page.slug) : OUT;
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), renderDocument({ page, body }));
    //console.log(`built ${page.url}`);
  }

  const notFound = {
    ...PAGES[0],
    url: "/404.html",
    title: "Page not found | Tumaini Community Trust",
    description: "The page you were looking for has moved or never existed. Return to our homepage to continue.",
    keywords: "404, page not found",
    image: IMG.hero,
    imageAlt: "Kenyan women and children standing together at golden hour",
  };
  const notFoundBody = (await readFile(path.join(ROOT, "src/pages/404.html"), "utf8")).trimEnd();
  await writeFile(path.join(OUT, "404.html"), renderDocument({ page: notFound, body: notFoundBody, is404: true }));
  //console.log("built /404.html");

  const routes = {
    routes: PAGES.map((page) => ({ path: page.url, title: page.nav })),
  };
  await writeFile(path.join(OUT, "manus-routes.json"), JSON.stringify(routes, null, 2) + "\n");

  const urls = PAGES.map(
    (page) =>
      `  <url>\n    <loc>${SITE.origin}${page.url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${page.url === "/" ? "1.0" : "0.8"}</priority>\n  </url>`,
  ).join("\n");
  await writeFile(
    path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );

  await writeFile(
    path.join(OUT, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /manus-storage/\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
  );

  await writeFile(
    path.join(OUT, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Tumaini Community Trust">
  <path d="M24 3 44 24 24 45 4 24Z" fill="#1b4332"/>
  <path d="M24 10.5 36.5 24 24 37.5 11.5 24Z" fill="#2d6a4f"/>
  <path d="M24 17c3.6 2 5.5 4.4 5.5 7s-2.2 4.6-5.5 7c-3.3-2.4-5.5-4.4-5.5-7s1.9-5 5.5-7Z" fill="#d4a373"/>
  <circle cx="24" cy="24" r="2.1" fill="#1b4332"/>
</svg>
`,
  );

  //console.log("built manus-routes.json, sitemap.xml, robots.txt, favicon.svg");
}

build().catch((error) => {
  //console.error(error);
  process.exit(1);
});
