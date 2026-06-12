# CRAFTECH — Enterprise Audit & Premium Redesign Report

**Date:** 2026-06-12
**Scope audited:** `crafttech/craftech-backend` + `crafttech/craftech-frontend` (the actively developed copy — last source changes 2026-05-06). The `ct/` folder on the Desktop is an older variant of the same project and is treated as a duplicate (see Phase 2).
**Detected stack:** React 18 + Vite 4 + Tailwind 3 + Framer Motion + AOS (frontend) · Node.js + Express 4 + Mongoose 8 + Cloudinary + JWT + Nodemailer (backend) · MongoDB.

---

## TL;DR — The Five Facts That Matter Most

1. **The contact form does not work.** `Contact.jsx` renders a `<form>` with no `onSubmit`, no state, and no API call. The backend lead endpoint (`POST /api/cms/leads`) and the email notification service exist and are never called. A lead-generation website that cannot capture a lead.
2. **The Google Map shows a different company** — the embed in `Contact.jsx` points to "WISETECH MEP CONSULTANTS Pvt. Ltd.", not Craftech.
3. **Soft-delete is broken platform-wide.** Admin "Delete" sets `isDeleted: true`, but every public and admin list query (`Testimonial.find()`, `Client.find()`, `ProcessStep.find()`, `WhyFeature.find()`, `Lead.find()`) never filters it. Deleted testimonials/clients/steps stay on the live website forever.
4. **Half the "CMS" is fake.** The public Services, Core Pillars (Values), and Videos sections are hardcoded JSX. The admin panel edits the database — and the website never reads it. The `SectionRenderer` "dynamic sections" system reads `homeData.sections`, a field that does not exist in the `Home` schema, so it always falls back to a hardcoded order.
5. **The copy actively repels high-ticket clients.** "Connect with Leads", "Transmit Project Brief", "Initialize Protocol", "Full Stakeholder Identity", "Brief Vision Disclosure" — and the Spanish word "nuestro" left mid-sentence in the Core Pillars section ("cemented nuestro position").

---

## PHASE 1 — BUSINESS & BRAND ANALYSIS

### Identity conflict (decide this first)
The brief says *luxury interior development company*. The website says *engineering / MEP / structural construction firm* ("Craftech Engineers", "Technical Blueprint", "MEP Mastery", BOQ, PMC). These are different buyers:

- **Luxury interior client** (HNW homeowner, hospitality brand) buys *emotion*: photography, materials, lifestyle, taste.
- **Construction/MEP client** (developer, architect, project director) buys *competence*: track record, compliance, process, numbers.

The current site is a *technical-competence* site wearing *agency-flashy* effects (custom cursor, film grain, particles). It serves neither buyer cleanly. **Recommendation:** position as a *design-build firm for premium spaces* — lead with finished interiors (emotion), back with engineering depth (trust). Architecture firms like this structure the story as: beautiful result → rigorous process → verifiable numbers.

### Would a high-ticket client trust this today? No. Specific trust-killers found:

| # | Trust-killer | Where |
|---|---|---|
| 1 | Contact form silently does nothing | `Contact.jsx` |
| 2 | Map shows another company's office | `Contact.jsx:30` |
| 3 | Two different phone numbers (+91 93248 77493 in Navbar/Footer/WhatsApp button vs. +91 97028 73497 in footer WhatsApp link) | `Navbar.jsx:148`, `Footer.jsx:34,74` |
| 4 | "nuestro" (Spanish) left in English copy | `Values.jsx:48` |
| 5 | About section claims "120+ Successful projects"; Stats section on the same page says "25 Projects Executed" | `About.jsx:50` vs `Stats.jsx` |
| 6 | Social icons link to `#` | `Footer.jsx:32-33` |
| 7 | "ISO 9001:2015" claim hardcoded in a decorative marquee with no certificate page | `Hero.jsx:145` |
| 8 | Robotic CTA copy ("Connect with Leads", "Initialize Protocol") reads like internal jargon, or AI generation left unedited | `Hero.jsx`, `Contact.jsx` |
| 9 | Testimonials shown with letter-initials in a box — no faces, no company logos, no project link | `Why.jsx:102` |
| 10 | WhatsApp button is `hidden lg:block` — **invisible on mobile**, where WhatsApp conversion in India actually happens | `WhatsAppButton.jsx:13` |

### What's missing for premium positioning
- No team / leadership / "who is behind this" — high-ticket buyers hire *people*.
- No case studies with narrative (challenge → solution → outcome → numbers).
- No project detail pages (the lightbox is an image dump with no story, no materials, no scope, no duration, no budget band).
- No certifications/licenses page, no awards, no press.
- No before/after — the single highest-converting asset class for interior/renovation firms.
- No FAQ, no process guarantees ("48 hours" promise appears once, unbacked).

---

## PHASE 2 — FILE STRUCTURE ANALYSIS

### Repository hygiene (critical)
- `craftech-frontend` is a git repo (github.com/wisetechitcare/craftech-frontend, 2 commits). **`craftech-backend` has no git at all.** One ransomware event or disk failure loses the backend.
- **Duplicate project trees on the Desktop:** `crafttech/` (active) and `ct/` (older copy, different structure — flat `controllers/models/routes`, no `src/`). You currently have `ct/backend/.env` open in your editor while the live code is in `crafttech/` — this *will* eventually cause an edit-the-wrong-project incident. Archive or delete `ct/`.
- Project name is spelled three ways: `crafttech` (folder), `craftech` (packages), `ct` (old copy).

### Dead / broken files (verified, safe to act on)

| File | Verdict | Evidence |
|---|---|---|
| `craftech-frontend/src/pages/admin/Dashboard.jsx` (697 lines) | **Delete** — dead code | Imported nowhere; superseded by `Layout` + `DashboardHome` |
| `craftech-backend/src/middleware/multer.js` (100 lines) | **Delete** — dead code | Never imported; `routes/upload.js` builds its own `memoryStorage`. Also requires `multer-storage-cloudinary`, which is **not in package.json** |
| `craftech-backend/seed.js` (root) | **Delete** — stale & dangerous | Uses `MONGO_URI` (the app uses `MONGODB_URI`), writes `heroTitle`/`heroSubtitle` fields that no longer exist on the `Home` model, and `deleteMany({})`s all testimonials on every run. `package.json` runs `src/seed.js`, not this |
| `SectionRenderer.jsx` dynamic branch | **Dead abstraction** | Reads `homeData.sections`; `Home` schema has no `sections` field — fallback always runs |
| `Project.seo`, `baseSchema.metadata` fields | **Dead weight** | Never rendered anywhere on the frontend |
| npm deps: `leaflet`, `react-leaflet`, `react-hook-form`, `clsx`, `tailwind-merge` (frontend); `express-validator`, `slugify`*, `streamifier`** (backend) | **Unused / phantom** | Zero imports in `src` for the frontend five; `express-validator` never imported. (*`slugify` IS used in `Project.js` — keep. **`streamifier` IS used in `uploadController` — keep.) |
| Two icon systems: Font Awesome (CDN) on public + `lucide-react` in admin | Consolidate to lucide | `index.html:19` |

### Structural issues
- `cmsController.js` handles 5 unrelated domains (Home, Settings, ProcessSteps, WhyFeatures, Testimonials, Clients, Leads); `contentController.js` handles 3 more (Pillars, Services, HighlightVideos). The split between "cms" and "content" is arbitrary — both are content. Leads (a CRM concern) live inside the CMS controller.
- `BaseService` exists but only `projectService` uses it; every other controller hits models directly with `findByIdAndUpdate`, which is exactly where the soft-delete filtering bug comes from — the discipline exists in one place and is bypassed everywhere else.
- Three sources of truth for content: hardcoded fallbacks in components, seed data, and the CMS — each with *different* text (e.g., three different About descriptions exist in the codebase).

### Recommended target structure (feature-modular)

```
craftech/                          # ONE git repo (monorepo)
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── config/            # env.js (validated), db.js, cloudinary.js
│   │       ├── modules/
│   │       │   ├── auth/          # auth.routes|controller|service|model
│   │       │   ├── projects/
│   │       │   ├── leads/         # CRM domain, separate from CMS
│   │       │   ├── content/       # services, pillars, process, features,
│   │       │   │                  #   testimonials, clients, videos
│   │       │   ├── pages/         # home singleton, settings singleton, SEO
│   │       │   └── media/         # uploads, cloudinary lifecycle
│   │       ├── shared/            # BaseService, AppError, catchAsync,
│   │       │                      #   validate.js, logger.js, plugins/
│   │       └── server.js
│   └── web/
│       └── src/
│           ├── features/
│           │   ├── public/        # sections, layout (Navbar, Footer)
│           │   └── admin/         # lazy-loaded admin bundle
│           ├── components/ui/     # shared primitives
│           ├── lib/               # api client, hooks, utils
│           └── styles/            # public.css + admin.css separated
├── packages/                      # (later) shared types/constants
└── scripts/seed/                  # ONE seed entry point
```

Naming rules: one slug everywhere (`craftech`), module = folder = route prefix, controllers thin / services own logic / models own schema.

---

## PHASE 3 — PREMIUM UI/UX REDESIGN

### Honest assessment of the current design language
There is real effort here — the section headers with the red tick + tracking-wide kicker, the editorial watermarks ("METRICS.", "Legacy."), the project lightbox with the fixed sidebar. But the overall effect is **loud, not luxurious**:

- **Typography:** Poppins at `font-black` with `uppercase tracking-[3-6px]` on nearly every label, plus italic accent words on every heading. Poppins is a friendly geometric — pushed to 800/900 weight it reads *startup landing page*, not *luxury interiors*. Every section shouts; nothing whispers. Luxury typography = one expressive display face (serif: Fraunces, Canela, Playfair; or refined grotesque: Neue Haas, Söhne) + one quiet text face (Inter), with weight contrast doing the work instead of uppercase tracking.
- **Color:** Navy `#0A2647` + signal-red `#C41B1F` + gold `#D4AF37` is a *corporate/industrial* triad (and red+gold together drifts toward "discount banner"). Luxury interiors palettes are warm neutrals (ivory, greige, taupe), deep charcoal, and **one** restrained metallic. Keep navy as the engineering anchor if you keep the engineering positioning; drop either red or gold as a primary.
- **Effects inflation:** film-grain overlay + particle canvas + cursor-following orb + custom cursor + scroll progress bar + 3-second curtain preloader + marquees + AOS + Framer Motion on one page. Each one is "agency demo"; together they are noise and jank. Pick **one** signature interaction (the image-reveal masks are the best candidate) and delete the rest.
- **Radius inflation:** `rounded-[40px]`, `rounded-[60px]` cards everywhere reads bubbly/consumer. Premium portfolios are mostly square or 2–8px.
- **`cursor: none` is set globally on `<body>`** (`index.css:34`) and the custom cursor is only mounted on the HomePage — so on a desktop the **admin panel has no visible mouse cursor** except over elements that explicitly set `cursor-pointer`. This is a genuine usability bug, not a style choice.

### Section-by-section (current single-page site)

| Section | Keep | Problems found | Redesign direction |
|---|---|---|---|
| **Preloader** | ✗ | Hard-coded 3s delay on *every* visit (2000ms + 1000ms timers) before content renders. Costs you LCP and bounces | Show once per session max, cap at ~800ms, or remove. Never gate content on a timer |
| **Hero** | partly | Particles + orb + 2 gradient layers + auto-rotating slides every 8s; comma-split title hack breaks with CMS titles that lack commas; CTA "Connect with Leads" is meaningless to a client; bottom marquee with unverifiable ISO claim; preloads an image (`39_s4jqut.jpg`) that isn't in the default slides | One full-bleed *finished-interior* photo (or 5s video loop), one headline, one subline, two CTAs: "Book a Site Visit" + "View Our Work". Slide rotation ≥10s or manual only |
| **About** | ✓ | "120+ projects" contradicts Stats; `precision`-word underline hack only fires if title contains "precision" | Tighten copy, add founder/leadership photo + name (the quote is attributed to "Director, Craftech" — name them), reconcile numbers |
| **Stats** | ✓ | Counter re-implements what Framer Motion does; values fine | Keep, place directly under hero as social-proof strip |
| **Values/Pillars** | ✗ as-is | **Hardcoded** — PillarsCMS edits are never shown; "nuestro" typo | Wire to `/api/content/pillars`, fix copy |
| **Services** | ✗ as-is | **Hardcoded** — ServicesCMS edits never shown; 6 equal cards with identical hover | Wire to API; consider 2–3 flagship services with photography, rest as list. Each service → its own SEO page (see Phase 5) |
| **Process** | ✓ | Dynamic (one of the few). Fine | Keep; add real site photos per step |
| **Portfolio** | partly | Public list capped at **10 projects** (BaseService default `limit=10`); filter buttons hardcode 4 of the 7 schema categories — projects in "Interior Fit Outs", "MEP Execution", "Project Management" can never be filtered; "all" is labeled "Featured Collection" but shows everything; lightbox images have no `loading="lazy"`, full-res Cloudinary URLs with zero transformations | Real `/projects` + `/projects/:slug` routes (deep-linkable, SEO-indexable, shareable). Case-study layout: hero shot, scope, location, duration, materials, gallery, "next project" footer, CTA |
| **Videos** | ✗ as-is | **Hardcoded** `videoData` array; the HighlightVideo CMS + upload pipeline exists and is unused publicly | Wire to `/api/content/highlight-videos`; lazy-load `<video>` with `preload="none"` + poster |
| **Why + Testimonials** | ✓ | Dynamic; star rating always renders 5 stars regardless of `rating` field; soft-deleted testimonials still display (Phase 8 bug) | Use real `rating`, add client photo/company, link testimonial → its project |
| **Clients marquee** | ✓ | Dynamic with fallback. OK | Use real logos (grayscale → color on hover is already right) |
| **Contact** | ✗ | **Form non-functional; map = wrong company**; "Global Operations Hub" + "Initialize Protocol" copy; phone/email/address hardcoded while a `Setting` model exists in DB for exactly this | Rebuild entirely (Phase 4) |
| **Footer** | partly | All content hardcoded; `#` socials; second phone number; "Built with ♥" line — remove for premium tone | Render from Settings API |
| **Navbar** | ✓ | Phone hardcoded; "Get Technical Quote" CTA okay but inconsistent with other CTA labels | Render contact from Settings; one CTA verb system |

### Recommended homepage flow (and why)

1. **Hero** — one stunning finished space, one promise, "Book a Site Visit" (the visitor's first 3 seconds decide premium-or-not; a single confident image outperforms a busy slider).
2. **Trust strip** — client logos + "25 projects · 12 years · Mumbai" (borrowed credibility immediately after the claim).
3. **Featured projects (3)** — your actual product. Cards → case-study pages.
4. **Signature service split** — Design-Build / Interior Fit-Out / MEP, each with photo (buyers self-select their path; 6 equal cards force them to read everything).
5. **Before/After slider** — one flagship transformation (highest-converting asset for renovation/interiors).
6. **Process timeline (4 steps)** — already have it; reduces perceived risk of a big-ticket engagement.
7. **Testimonial + project link** — proof adjacent to process.
8. **Video walkthrough** — one, not three; motion sells interiors.
9. **Team/leadership block** — faces close the trust loop before the ask.
10. **Consultation CTA band** — full-width, single field or WhatsApp/Call/Form choice.
11. **FAQ (5 questions)** — handles objections (budget bands, timelines, warranty) without a salesperson.
12. **Footer** — NAP consistency (one phone!), licenses, socials.

---

## PHASE 4 — CLIENT CONVERSION SYSTEM

### Step 0 (today): make the existing funnel function
1. Wire `Contact.jsx` to `cmsApi.createLead` (the API helper *already exists* in `services/api.js:104`), with `react-hook-form` (already installed, unused), success state, and error toast.
2. Show the WhatsApp button on mobile — remove `hidden lg:block`; make it a **sticky bottom bar on mobile**: `[WhatsApp] [Call] [Get Quote]`.
3. One phone number everywhere, sourced from Settings.
4. Fix the map (or replace with a static styled image + address card — faster and prettier than a grayscale iframe).

### Funnel design

```
Awareness        →  Consideration       →  Intent              →  Capture
SEO/social/refs     /projects/:slug        Services pages         Multi-channel
homepage hero       before/after           pricing-band FAQ       • WhatsApp (mobile #1)
                    testimonials           process page           • 2-step form
                                                                  • Call / callback
                                                                  • Site-visit booking
```

**CTA system (use exactly these, consistently):**
- Primary: **"Book a Free Site Visit"** (high commitment, high intent — the natural first step for construction/interiors and a stronger qualifier than "contact us")
- Secondary: **"Get a Detailed Quote"** (estimate funnel: 2-step form — Step 1: project type + location + budget band; Step 2: name + phone. Two steps because asking for identity *after* investment doubles completion)
- Tertiary: **"Chat on WhatsApp"** (pre-filled message including the page/project they were viewing: `wa.me/<n>?text=Hi, I'm interested in <project>`)
- Per-project: **"Build Something Like This"** on every case study (context-aware ask converts better than generic contact)

**Lead handling backend (extend what exists):**
- `Lead` model upgrade: replace `contacted: Boolean` with `status: enum [new, contacted, qualified, follow_up, proposal_sent, won, lost]`, plus `source` (form/whatsapp/call/project page), `budgetRange`, `city`, `projectRef`, `notes[]` (timestamped), `assignedTo`.
- Auto-reply email to the lead ("We received your brief — expect our call within 24h") in addition to the existing internal notification.
- Validation + honeypot field + per-route rate limit on `POST /leads` (currently unvalidated and spammable).
- Capture `utm_*` + referrer into the lead document — you cannot optimize what you don't attribute.

---

## PHASE 5 — FULLY DYNAMIC WEBSITE ARCHITECTURE

### Current truth table

| Content | Admin UI exists | DB model exists | Public site reads it |
|---|---|---|---|
| Hero slides, About, Stats | ✓ HomeCMS | ✓ Home | ✓ |
| Process steps | ✓ | ✓ | ✓ |
| Why features | ✓ | ✓ | ✓ |
| Testimonials | ✓ | ✓ | ✓ (incl. deleted ones — bug) |
| Clients | ✓ | ✓ | ✓ |
| Projects | ✓ | ✓ | ✓ (max 10 — bug) |
| **Services** | ✓ ServicesCMS | ✓ Service | **✗ hardcoded** |
| **Pillars/Values** | ✓ PillarsCMS | ✓ CorePillar | **✗ hardcoded** |
| **Highlight videos** | ✓ via content API | ✓ HighlightVideo | **✗ hardcoded** |
| **Contact info / socials** | ✓ Settings | ✓ Setting | **✗ hardcoded** (Navbar, Footer, WhatsApp, Contact) |
| Navbar links, Footer links, marquee text, map embed, SEO meta | ✗ | ✗ | ✗ hardcoded |
| Section order/visibility | ✗ | ✗ (`sections` field missing) | dead code path |

### Plan
1. **Wire the four broken rows above** — this is days of work, not weeks, because both ends already exist.
2. **Implement the `sections` array** the SectionRenderer was built for: add to `Home` schema `sections: [{ type: enum, isVisible, order, data: Mixed }]`, plus a drag-to-reorder UI in HomeCMS. Now order/visibility is genuinely CMS-driven.
3. **Singleton pattern for pages:** `Home` and `Setting` already act as singletons via `findOne()` — formalize with a `key` field (`unique`) so you can add `about-page`, `contact-page` documents later without new models.
4. **Settings expansion:** `phone`, `whatsappNumber`, `email`, `address`, `mapEmbedUrl`, `socialLinks{}`, `seo { defaultTitle, defaultDescription, ogImage }`, `navigation[]`, `footerLinks[]`, `announcements`.
5. **Frontend data layer:** add TanStack Query (caching, retries, stale-while-revalidate) instead of ad-hoc `useEffect` fetches per component — currently the homepage fires 7+ uncoordinated requests (CMSContext fires 5, Portfolio, Why, ClientsMarquee fire their own).
6. **Remove all hardcoded fallback content** from components. Fallbacks belong in the **seed**, not the JSX — otherwise you have the current situation where the site silently shows stale fallback copy when an API call fails and nobody notices.

---

## PHASE 6 — ADMIN DASHBOARD

### What's already good
The shell is solid: glassy dark sidebar with grouped nav, breadcrumb header, protected routes, drag-drop uploads with progress, toast feedback. This is above-average for a hand-built admin.

### What's wrong (found in code)
1. **Three competing design systems:** `DashboardHome`/`ProjectForm` use inline-style glass cards (`rgba(10,38,71,0.25)`), `LeadsList`/`HomeCMS` use Tailwind `slate-800/30` classes, `Login` uses the `.card`/`.input` classes from `index.css`. Pick one (extract `AdminCard`, `AdminInput`, `AdminTable`, `AdminEmptyState` primitives) — this alone makes it feel "designed".
2. **Fake data presented as real:** the "+2 this month" trend on Total Projects is a hardcoded string; the "System Status" card always says "All Systems Operational / MongoDB Connected / Cloudinary Active" — it checks nothing. For a business owner this is worse than no status: it will say "Operational" during an outage. Either implement a real `/health` probe or delete the card.
3. **No invisible-cursor fix:** `body { cursor: none }` applies to the admin (see Phase 3).
4. **Leads is a table, not a CRM:** single `contacted` boolean, no statuses, no notes, no filters, no export.
5. **No RBAC:** one `Admin` model, every admin can do everything including delete.
6. **Window.confirm** for destructive actions in LeadsList (ConfirmModal component exists — use it consistently).

### Target information architecture

```
DASHBOARD     KPI row (leads this week, new vs contacted, projects live,
              media count) · lead-trend chart · latest 5 leads inline · quick actions
LEADS (CRM)   Pipeline board (New → Contacted → Qualified → Follow-up →
              Proposal → Won/Lost) · lead detail drawer: timeline of notes,
              source, budget, linked project · filters + CSV export
PROJECTS      List (search/filter/feature toggle) · case-study editor
              (scope, duration, materials, before/after pairs) · media per project
CONTENT       Homepage sections (reorder/show-hide) · Services · Pillars ·
              Process · Why · Testimonials · Clients · Videos · FAQs* · Team*
MEDIA         Library with usage info ("used in: Project X") · orphan cleanup
SETTINGS      Company & contact · SEO defaults · Navigation/Footer · Users & roles
```
*new collections

### How data should sync
Admin writes → API invalidates a server-side cache key (`content:home`, `content:services`) → public site reads through TanStack Query with `staleTime` ~1 min. No rebuild step needed at this scale. When you later add SSG/ISR (Phase 10), the same invalidation triggers revalidation.

### RBAC model
`super_admin` (users, settings, destructive ops) · `admin` (all content + leads) · `content_manager` (content only, no leads, no settings) · `sales` (leads only). Implement as `role` field + `permit('leads:write')` middleware — four roles need a constants file, not a permissions collection.

---

## PHASE 7 — MONGODB DATABASE ARCHITECTURE

### Current state assessment
- Mongoose pluralizes model names, so actual collections are `admins, clients, corepillars, highlightvideos, homes, leads, processsteps, projects, services, settings, testimonials, whyfeatures`. Names like `corepillars`/`whyfeatures` encode *UI section names* into the database — when the design changes, the names rot. `homes` for a singleton page document is wrong twice.
- `baseSchema` plugin is inconsistently applied (Project, Service, CorePillar, HighlightVideo **don't** get it; the others do), which is why `order` vs `displayOrder` both exist and why soft-delete filtering is half-implemented.
- Almost no validation: `Lead.email` accepts anything, no maxlengths anywhere, `phone` is free text.
- Indexes: only Project has any (`slug` unique, `category`, `featured`). Every sorted list (`displayOrder`) does collection scans — irrelevant at 50 docs, but free to fix.

### Target collections (enterprise naming: plural, snake-free, domain-first)

| Collection | Purpose | Key fields | Indexes | Validation highlights |
|---|---|---|---|---|
| `users` | All back-office users (replaces `admins`) | name, email, passwordHash, **role**, isActive, lastLoginAt | `email` unique | email regex, role enum |
| `projects` | Portfolio case studies | title, slug, category→ref, summary, **story{challenge,solution,outcome}**, client{name,isPublic}, location{city,area}, year, durationMonths, budgetBand, thumbnail{url,publicId}, gallery[{url,publicId,caption,order}], beforeAfter[{before,after,caption}], videos[], featured, status, displayOrder, seo{} | `slug` uniq, `{status,featured,displayOrder}`, `{category,status}`, text index on title+summary | title 3–120 chars; gallery item requires url+publicId together (fixes the current parallel-array `images[]`/`imagePublicIds[]` drift risk) |
| `project_categories` | Replaces the 7-value hardcoded enum (which already drifted from the UI filter list) | name, slug, displayOrder, isActive | slug uniq | — |
| `services` | Service offerings | title, slug, excerpt, body, icon, image{}, features[], displayOrder, isActive, seo{} | slug uniq | — |
| `leads` | CRM core | name, email, phone, message, **status enum(new…lost)**, source, budgetRange, city, projectRef, utm{}, assignedTo→users, isDeleted | `{status,createdAt}`, `{assignedTo,status}`, email | phone/email format, message ≤2000 |
| `lead_activities` | Timeline per lead (notes, calls, status changes) | leadId→leads, type, body, byUser, at | `{leadId,at}` | — |
| `testimonials` | — | author, role, company, quote, avatar{}, rating, projectRef, displayOrder, isPublished | `{isPublished,displayOrder}` | rating 1–5 |
| `clients` | Logo wall | name, logo{}, website, displayOrder, isPublished | — | — |
| `team_members`* | Leadership/team | name, role, photo{}, bio, socials, displayOrder | — | — |
| `faqs`* | — | question, answer, displayOrder, isPublished | — | — |
| `media_assets` | Mirror of every Cloudinary upload → enables real media library + orphan cleanup (today, deleting a project's DB row via soft-delete leaves Cloudinary files orphaned and *unfindable*) | publicId, url, resourceType, bytes, width, height, folder, usedBy[{collection,docId}] | `publicId` uniq, `folder` | — |
| `pages` | Singletons: home, about, contact (replaces `homes`) | key uniq, sections[{type,isVisible,order,data}], seo{} | `key` uniq | section.type enum |
| `site_settings` | Singleton: company, contact, socials, navigation, footer, SEO defaults | key='default' | — | one document enforced via unique key |
| `content_blocks` | Generic ordered lists: pillars, process steps, why-features (3 models → 1) | kind enum('pillar','process_step','why_feature'), title, body, icon, meta{}, displayOrder, isPublished | `{kind,displayOrder}` | — |
| `videos` | Replaces `highlightvideos` | title, category, url, publicId, thumbnail{}, durationSec, featured, displayOrder | `{featured,displayOrder}` | — |
| `analytics_events`* | Page views, CTA clicks, lead submissions | type, path, projectRef, sessionId, at, utm{} | `{type,at}`, TTL index (90d) on `at` | capped growth via TTL |

*new. **Normalization strategy:** MongoDB-idiomatic — embed what is always read together (project gallery, story), reference what is queried independently or mutated often (lead activities, categories, media usage). The current parallel arrays (`images[]` + `imagePublicIds[]`) are the worst of both — replace with embedded objects.

**Soft-delete strategy:** put it in ONE place — a schema plugin that adds `isDeleted` AND a `pre(/^find/)` query hook excluding deleted docs by default (with `.withDeleted()` escape hatch). This makes the Phase-8 bug class impossible rather than patched.

---

## PHASE 8 — BACKEND ARCHITECTURE

### Bugs (verified in code)

1. **Soft-delete leak** (critical, detailed in TL;DR) — `cmsController.js` lines 46/69/92/120/148 and `cmsService.getProcessSteps/getWhyFeatures` all query without `isDeleted` filtering.
2. **Query-param injection into Mongo filters:** `projectController.getAllProjects` passes `req.query` straight into `find()` via BaseService — so `GET /api/projects?page=2` builds filter `{page: 2}` and **returns zero results** (pagination breaks filtering), and `?email[$ne]=x`-style operator injection is accepted on a public endpoint. Whitelist filterable fields (`category`, `featured`) and strip the rest.
3. **No upload constraints on the live path:** `routes/upload.js` uses bare `multer.memoryStorage()` — no `fileFilter`, no size `limits`. (The size/type rules exist only in the dead `middleware/multer.js`.) Anyone with an admin token can upload arbitrary files of arbitrary size; combined with `express.json({limit:'50mb'})` this is a memory-DoS surface.
4. **`emailService.sendContactEmail(item)` fire-and-forget** is fine (it catches internally), but the transporter is created at module load — if SMTP env vars are absent (they're missing from `.env.example`!) every lead logs an error.
5. **`errorMiddleware` uses `fs.appendFileSync`** on every production error — synchronous disk I/O on the request path.
6. **`db.js` hardcodes Google DNS** (`dns.setServers(['8.8.8.8'])`) — a local-ISP workaround baked into production code; breaks in DNS-restricted networks (corporate/container).

### Architecture upgrades
- **Validation layer:** `zod` (or the already-installed `express-validator`) schemas per route, mounted as middleware: `router.post('/leads', validate(leadSchema), createLead)`. Today *nothing* is validated anywhere.
- **Consistent service/repository use:** either every module goes through `BaseService` (recommended — it already does soft-delete right) or delete it. The half-adoption is the root cause of bug #1.
- **Env validation at boot** (zod again): fail fast if `JWT_SECRET`, `MONGODB_URI`, `CLOUDINARY_*`, `SMTP_*` missing — and **delete both hardcoded `'craftech_secret_key_2024'` fallbacks** (`auth.js:16`, `adminController.js:20`).
- **Logging:** replace `console.log`/`morgan`/`appendFileSync` with `pino` + `pino-http` (request IDs, JSON logs, no sync writes).
- **Rate limiting:** keep the global limiter; add a strict one for `POST /api/cms/leads` (e.g., 5/hour/IP) + honeypot.
- **Caching:** in-memory TTL cache (or Redis later) for the 7 public content GETs — they serve identical payloads to every visitor.
- **API shape:** version it (`/api/v1`), standardize `{ success, data, meta }`, cap `limit` at 50.
- **Mongo hygiene:** `express-mongo-sanitize` middleware as a backstop to bug #2.
- **Graceful shutdown** (`SIGTERM` → close server → close mongoose) and `app.set('trust proxy', 1)` when deployed behind a proxy (rate-limit keys are wrong without it).

---

## PHASE 9 — FRONTEND ARCHITECTURE

### Biggest single win: code-split the admin
`App.jsx` statically imports all 14 admin pages + lucide + dropzone into the same bundle every public visitor downloads. `React.lazy(() => import('./features/admin'))` cuts the public bundle dramatically — likely the single largest performance fix available.

### Other findings & fixes
- **react-hook-form is installed and unused** while the one form that matters is broken. Use it for Contact + all admin forms (HomeCMS mutates nested state by hand).
- **Two animation libraries** (AOS + Framer Motion) doing the same job — keep Framer Motion (`whileInView`), drop AOS (~14KB + global CSS).
- **Two icon systems** — drop the Font Awesome CDN (render-blocking 70KB+ CSS), use lucide everywhere.
- **Images:** every Cloudinary URL is served raw. Build a `cld(url, {w, h})` helper inserting `f_auto,q_auto,w_<n>,c_fill` and add `loading="lazy"` + `srcset` to Portfolio/About/lightbox images. This is free money — Cloudinary does the work.
- **AuthContext never verifies the token** (`getMe` exists, unused): an expired 30-day token shows the admin shell, then every call 401s with no redirect. Add a response interceptor: on 401 → clear storage → `/admin/login`.
- **No error boundaries, no 404** (catch-all silently redirects home — bad for users and SEO), **no document-title management** (add `react-helmet-async` or React 19 title tags later).
- **CMSContext fetches 5 endpoints for every visitor** including admin pages that don't need them; Portfolio/Why/ClientsMarquee fetch separately → TanStack Query with per-section hooks (`useHome()`, `useServices()`) and sensible `staleTime`.
- Component cleanups: Hero's comma-split headline → explicit `titleLine1/titleLine2` CMS fields; Stats counter → Framer Motion `useInView` + `animate`; delete NoiseOverlay/CustomCursor/particles per Phase 3.

---

## PHASE 10 — PERFORMANCE + SEO

### Performance (expected Lighthouse today: ~40–60 mobile)
Render-blocking chain: Google Fonts CSS (7 Poppins weights!) + Font Awesome CDN + 3s preloader + full-bundle JS (admin included) + unoptimized hero JPG + particle canvas + per-frame rAF loops (cursor, orb).
**Fix order:** (1) remove preloader delay, (2) lazy-load admin bundle, (3) Cloudinary transforms + lazy images, (4) self-host 2 font weights with `font-display: swap`, (5) drop FA + AOS, (6) `preload` the *actual* first hero image (the current preload points at an image not in the default slides).

### SEO (current score: near zero)
- Single-page anchors = the entire business has **one indexable URL**, one title, one meta description (hardcoded in `index.html`).
- No sitemap.xml, no robots.txt, no canonical, no OG/Twitter images, no structured data. `Project.seo` and `baseSchema.metadata` fields exist in the DB and are rendered nowhere.
- **Plan:** real routes (`/projects`, `/projects/:slug`, `/services/:slug`, `/about`, `/contact`) → per-route meta from CMS → `LocalBusiness` + `Service` + `Project/CreativeWork` JSON-LD → generated sitemap → Google Business Profile alignment (one phone number — NAP consistency). For a CSR React app, either prerender (vite-plugin or prerender.io) or migrate the public site to Next.js/Astro later; routes + meta + sitemap come first either way.

---

## PHASE 11 — SECURITY

| Severity | Finding | Location | Fix |
|---|---|---|---|
| **Critical** | Hardcoded JWT secret fallback `'craftech_secret_key_2024'` — if `JWT_SECRET` is unset in prod, anyone reading the GitHub repo can forge admin tokens | `auth.js:16`, `adminController.js:20` | Remove fallback; fail at boot |
| **High** | Mongo operator injection via `req.query` spread on public endpoint | `projectController.getAllProjects` | Whitelist filters + `express-mongo-sanitize` |
| **High** | Zero input validation on all writes incl. public `POST /leads` (stored XSS vector → lead `message` is later interpolated into the notification **email HTML** unescaped in `emailService.js:33`) | all controllers | zod/express-validator + escape email interpolation |
| **High** | No file-type/size limits on live upload routes | `routes/upload.js` | Restore fileFilter + limits on the memory uploader; validate `projectSlug` param (it becomes a Cloudinary folder path) |
| **Medium** | JWT 30-day expiry, localStorage storage, no revocation | `adminController`, `AuthContext` | 1–4h access token + refresh rotation; or at minimum shorten + verify on app load |
| **Medium** | `express.json({ limit: '50mb' })` | `index.js:38` | 1mb default; uploads go via multipart anyway |
| **Medium** | No RBAC — every admin is super-admin | `Admin` model | Phase 6 roles |
| **Low** | localhost origins allowed in production CORS list | `index.js:23-28` | env-conditional list |
| **Low** | Login limiter (10/15min) keys by IP without `trust proxy` → behind a proxy all users share one bucket / or spoofable | `index.js` | `app.set('trust proxy', 1)` |
| **Low** | Backend `.env` exists with no git repo → when git is initialized, high risk of committing secrets | `craftech-backend/.env` | Add `.gitignore` *before* `git init`; rotate any secrets already shared |

Not vulnerable to CSRF (Bearer-token auth, no cookies). Passwords correctly hashed (bcrypt cost 12, `select: false`). Helmet present.

---

## PHASE 12 — HOW TO RUN THE SYSTEM

### Backend (`crafttech/craftech-backend`)
```bash
npm install
copy .env.example .env    # then edit
npm run seed              # runs src/seed.js: creates admin from ADMIN_EMAIL/ADMIN_PASSWORD,
                          # seeds pillars + services (idempotent)
npm run dev               # nodemon, http://localhost:5000  (prod: npm start)
```
Required env: `PORT`, `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`, `ADMIN_EMAIL/PASSWORD/NAME`, `FRONTEND_URL`, `ADMIN_URL`.
⚠️ **`.env.example` is missing the SMTP vars the code reads:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` (`emailService.js`). Without them, lead-notification emails fail silently.
⚠️ Do **not** run the root `seed.js` — it's stale (wrong env var name, dead schema fields) and wipes all testimonials.
Health check: `GET http://localhost:5000/api/health`. No migrations exist (Mongoose-only).

### Frontend (`crafttech/craftech-frontend`)
```bash
npm install
npm run dev               # http://localhost:5173 — /api proxied to :5000 (vite.config.js)
npm run build && npm run preview
```
⚠️ **Production gap:** axios `BASE_URL = '/api'` with no `VITE_API_URL` support — the built site only works if a reverse proxy (nginx/Vercel rewrite) forwards `/api` to the backend host. Either configure that proxy or add `import.meta.env.VITE_API_URL`.

### Admin
- URL: `http://localhost:5173/admin/login` → dashboard at `/admin`
- Credentials: whatever `ADMIN_EMAIL` / `ADMIN_PASSWORD` were at seed time
- Flow: login → JWT (30d) in localStorage → `ProtectedRoute` gates `/admin/*` → change password under the API `PATCH /api/admin/change-password`

---

## PHASE 13 — FINAL REPORT

### Scores

| Dimension | Score | One-line justification |
|---|---|---|
| Premium feel | **4/10** | Real design effort, but loud typography, effect inflation, robotic copy, and trust-breaking inconsistencies |
| UI/UX | **5/10** | Good section craft and admin shell; invisible-cursor bug, 3s preloader, hidden mobile WhatsApp, broken filters |
| Conversion | **1/10** | The contact form does not submit; WhatsApp hidden on mobile; no booking, no funnel |
| Backend | **5/10** | Clean layering started (services, AppError, catchAsync) but abandoned halfway; soft-delete and query bugs |
| Frontend | **4/10** | No code-splitting, dead 697-line page, 5 unused deps, hardcoded "dynamic" content, no error handling |
| MongoDB | **4/10** | Workable schemas, but inconsistent plugin use, parallel-array media, UI-named collections, no validation |
| Security | **3/10** | Hardcoded JWT fallback in a public GitHub repo + zero validation + unrestricted uploads |
| SEO | **2/10** | One URL, one hardcoded meta tag, no sitemap/structured data; SEO DB fields exist but unrendered |
| Scalability | **4/10** | Fine to ~thousands of docs; no caching, no pagination discipline, no monorepo/CI/tests |

### CRITICAL (fix this week — mostly hours, not days)
1. Wire the contact form to `POST /api/cms/leads` (helper already exists) + success/error states.
2. Fix the Google Maps embed (wrong company).
3. Fix soft-delete: add the query-hook plugin or `isDeleted: { $ne: true }` to the 7 unfiltered queries.
4. Remove hardcoded JWT fallback secrets; set a strong `JWT_SECRET`; rotate.
5. Show WhatsApp/call CTA on mobile (sticky bottom bar).
6. One phone number everywhere; fix "nuestro"; reconcile 25 vs 120+ projects.
7. `git init` the backend (with `.gitignore` covering `.env` **first**).

### HIGH priority (sprint 1–2)
8. Wire Services, Pillars, Videos, Settings (Navbar/Footer/Contact) to their existing APIs — the "fake CMS" rows in Phase 5.
9. Fix `getAllProjects` filter/pagination injection; raise/parameterize the 10-project cap; align category filters with real categories.
10. Validation layer on all routes; upload size/type limits; lead-route rate limit + honeypot; escape lead fields in the email template.
11. Lazy-load the admin bundle; add 401 interceptor + token verification on load; error boundary + real 404.
12. Delete dead code: `Dashboard.jsx`, `middleware/multer.js`, root `seed.js`, 5 unused npm deps, `ct/` folder (archive it).
13. Replace the CTA/microcopy across the site (Phase 4 CTA system); kill "Initialize Protocol" et al.

### MEDIUM priority (sprint 3–4)
14. Real routes: `/projects`, `/projects/:slug` case studies, `/services/:slug`, `/about`, `/contact` + per-route meta, sitemap, JSON-LD.
15. Lead CRM upgrade (status pipeline, notes, sources, assignment) + admin pipeline board.
16. Cloudinary transform helper + lazy images + font/effects diet (remove preloader delay, AOS, FA CDN, particles, noise, custom cursor).
17. Admin design-system consolidation (one card/input/table primitive set); remove fake trend/status widgets.
18. TanStack Query data layer; settings-driven navigation/footer.
19. RBAC (4 roles) + audit fields actually populated (`createdBy/updatedBy` exist but are only set on 2 routes).

### LOW priority (quarter)
20. Visual redesign rollout per Phase 3 (typography, palette, photography standards, homepage flow).
21. Before/after component, team section, FAQ section (+ collections).
22. `media_assets` library with orphan cleanup; analytics events + dashboard charts.
23. Monorepo restructure (Phase 2 target), TypeScript migration, ESLint/Prettier, CI (lint+build), basic API tests.
24. Consider Next.js/Astro for the public site when SEO becomes a growth channel.

### Transformation roadmap

| Phase | Duration | Outcome |
|---|---|---|
| **0. Stop the bleeding** | 2–3 days | Leads actually arrive; map/phone/typos fixed; secrets safe; backend in git |
| **1. Make the CMS true** | 1–2 wks | Every visible pixel editable from admin; injection/validation/upload hardening |
| **2. Conversion engine** | 1–2 wks | Mobile CTA bar, 2-step quote form, WhatsApp deep links, auto-reply, lead statuses |
| **3. Premium reskin** | 2–3 wks | New type/palette, homepage flow vNext, case-study pages, copy rewrite |
| **4. SEO & performance** | 1–2 wks | Real routes, meta/sitemap/JSON-LD, image pipeline, Lighthouse ≥90/85 |
| **5. Business platform** | ongoing | CRM board, RBAC, analytics, media library, monorepo + CI |

**Sequencing logic:** conversion plumbing before beauty (a gorgeous site with a dead form earns ₹0), data-truth before redesign (no point styling sections that ignore the CMS), SEO after real routes exist (there is nothing to index until then).
