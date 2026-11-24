# JK Speedy Driving School: website

Bilingual (English / Spanish) marketing site for JK Speedy Driving School, North Plainfield, NJ.

**Stack:** Next.js 16 (App Router, fully static pages) · TypeScript · Tailwind CSS 4 · next-intl 4 · GSAP + ScrollTrigger · Framer Motion · Lenis. Deploys to Vercel with zero config.

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000 → redirects to /en or /es
npm run build && npm start
```

Other scripts: `npm run typecheck`, `npm run icons` (re-renders favicons from `public/icon.svg`), `node scripts/contrast.mjs` (checks WCAG contrast for every color pairing).

---

## [CONFIRM] items: verify before launch

Everything below is a placeholder. Search the code for `[CONFIRM]` to find them. Most also show a visible dashed yellow **[CONFIRM]** badge on the page, so nothing unverified ships unnoticed.

| Item | Where to change it | Shows on |
|---|---|---|
| Pricing / packages | `messages/*.json` → `services.pricingValue`; remove `<ConfirmBadge label="Pricing">` in `src/app/[locale]/services/page.tsx` | Services |
| Instructor names, photos, bios | `src/app/[locale]/about/page.tsx` (3 placeholder cards) + `about.*` keys | About |
| School story / years in business | `about.story` in both message files | About |
| Email address | `business.email` in `src/config/site.ts` | Contact |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` env var (digits, with country code). Until it's set, links point to `wa.me/1XXXXXXXXXX` | Header bar, footer, contact |
| Social links (Facebook, Instagram…) | `business.social` in `src/config/site.ts` (also added to JSON-LD `sameAs`) | Footer |
| Google Business Profile URL + "write a review" link | `business.listings.google` / `googleReview` | Footer, reviews CTA, JSON-LD |
| Map coordinates (approximate) | `business.geo` in `src/config/site.ts` | JSON-LD |
| Vehicle make / model | About page "The car" card | About |
| NJ MVC driving-school license # | `business.mvcLicenseNumber` | Footer, About |
| Exact service-area towns | `src/config/areas.ts` (+ `AREAS` in `src/lib/schema.ts`) | Home, Areas, JSON-LD |
| Extra services (notary, vision test…) | Not built. Add to `SERVICE_IDS` + `services.items` if offered | n/a |
| Reviews (3 sample slots) | `src/components/sections/Reviews.tsx`. Paste **real** reviews only (first name, text, source link) | Home |
| Real photos | `src/config/images.ts`. All photos are Unsplash stock; footer states this | Everywhere |
| Privacy Policy & Terms | `legal.*` in message files: placeholder text, needs legal review | /privacy, /terms |
| Production domain | `NEXT_PUBLIC_SITE_URL` (canonical, hreflang, sitemap, OG, JSON-LD) | All |

**Deliberately absent:** no testimonials, star ratings, student counts, pass rates or "years of experience" were invented, and there is **no `AggregateRating` schema**. Add it to `businessSchema()` in `src/lib/schema.ts` only once real review numbers exist. The only count-up stats are verified facts (4 languages, 6 behind-the-wheel hours, 6 days/week, 50-question test).

NJ licensing facts (Guide, FAQ, journey) are labeled **"Last verified: Nov 2026"** and link to nj.gov/mvc. Re-check them periodically.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes (prod) | Public origin, no trailing slash |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | yes | WhatsApp digits, e.g. `19085551234` |
| `LEAD_WEBHOOK_URL` | one of these two | Form submissions are POSTed here as JSON (GoHighLevel inbound webhook, Zapier "Catch Hook", Make…) |
| `LEAD_WEBHOOK_SECRET` | optional | Sent as `X-Webhook-Secret` header |
| `RESEND_API_KEY` + `LEAD_EMAIL_TO` | one of these two | Email fallback via Resend (used if the webhook is unset or fails). `LEAD_EMAIL_TO` accepts a comma-separated list |
| `LEAD_EMAIL_FROM` | optional | Verified sender, e.g. `JK Speedy <leads@yourdomain.com>` |

Lead payload (`POST /api/lead` → webhook):
```json
{ "name": "Ana López", "phone": "+19085550101", "email": "", "preferredLanguage": "es",
  "ageGroup": "21+", "service": "nervous", "bestTimes": ["sat"], "message": "",
  "siteLocale": "es", "page": "/es/contacto", "source": "website", "submittedAt": "2026-11-24T…Z" }
```
Spam protection: honeypot field, minimum fill time, light per-IP rate limit, server-side validation. **If neither delivery method is configured in production, the API returns 503** and the form tells the visitor to call. Leads are never silently dropped. In `npm run dev` with nothing configured, leads are logged to the console.

No analytics are installed, so there's **no cookie banner**. The only cookie is `NEXT_LOCALE` (language choice). The Google Map is click-to-load. If you add analytics, add a consent banner at the same time.

---

## Bilingual architecture

- Routes: `/en/...` and `/es/...` with localized slugs (`/en/services` ↔ `/es/servicios`, `/en/areas-we-serve` ↔ `/es/zonas`, …), defined once in `src/i18n/routing.ts`.
- `/` redirects using the `NEXT_LOCALE` cookie, then `Accept-Language` (Spanish browsers → `/es`, everyone else → `/en`). See `src/proxy.ts`.
- All copy lives in `messages/en.json` and `messages/es.json` (same keys, checked for parity). The Spanish is written natively (US-Latino, *tú*), not machine-translated.
- Every page has: unique title (≤ 60 chars) and description (≤ 155), canonical, reciprocal hreflang (`en-US`, `es-US`, `x-default`), Open Graph/Twitter cards with a per-language 1200×630 image (`/og/en`, `/og/es`), and JSON-LD (LocalBusiness + EducationalOrganization, WebSite, BreadcrumbList, plus Service ×6, FAQPage, Article where relevant). `sitemap.xml` includes hreflang alternates.
- Layout uses logical CSS (`ms-`, `pe-`, `start-`, `text-start`…) and `<html dir>` comes from the locale, so RTL works without restyling.

### Adding Portuguese or Arabic (no refactor)

1. `src/i18n/routing.ts`: add `"pt"` / `"ar"` to `locales`, a slug for it under **every** entry in `pathnames`, and entries in `HREFLANG`, `OG_LOCALE` and `LOCALE_LABEL`. Arabic is already in `RTL_LOCALES`, so `dir="rtl"` is automatic.
2. Copy `messages/en.json` → `messages/pt.json` / `ar.json` and translate (keep the keys).
3. Add the locale's copy to `COPY` in `src/app/og/[locale]/route.tsx`. For Arabic, also load an Arabic-capable font there and in `src/app/fonts.ts` (e.g. IBM Plex Sans Arabic).
4. The language toggle is a two-up pill: with 3+ locales, switch `LanguageToggle` to a menu.
5. Remove the "Also available in Português / العربية: call us" line (`common.otherLanguages`).

Hreflang, sitemap, middleware detection and the `dir` attribute all read from `routing.ts` automatically.

---

## Motion & performance notes

- Hero entrance is pure CSS (so text paints on the first frame for fast LCP). GSAP + ScrollTrigger are code-split and only load when an animated section gets near the viewport. Lenis starts on idle.
- "Your Road to a License" (`src/components/sections/Journey.tsx`) is a progressive enhancement: without JS or with `prefers-reduced-motion` it's a plain ordered list with the road already drawn.
- Only `transform`/`opacity` are animated, apart from the SVG `stroke-dashoffset` road draw and the FAQ accordion height.
- Under `prefers-reduced-motion`: no Lenis, no pinning, no parallax/tilt/magnetic effects, marquee becomes a static list, View Transitions are disabled.
- Images use a custom `next/image` loader (`src/lib/image-loader.ts`) that hands sizing to Unsplash's CDN (`auto=format&fit=crop&q=80&w=…`), with a dark gradient fallback if a photo fails.
