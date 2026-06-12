# CRAFTECH — Transformation Blueprint (Execution Plan)

**Date:** 2026-06-12 · **Companion to:** `CRAFTECH_AUDIT.md` (verified findings)
**Codebase:** `crafttech/craftech-backend` + `crafttech/craftech-frontend`
**Format:** Every task has an ID, exact files, the real change (code where it matters), effort, and a verification step. Tasks reference *actual* code locations confirmed in the audit — nothing here is generic.

---

## DECISIONS REQUIRED FROM YOU (blockers marked ⛔, the rest have defaults)

| # | Decision | Why it blocks | Default if you don't answer |
|---|---|---|---|
| D1 ⛔ | **Which phone number is correct?** `+91 93248 77493` (Navbar:148, Footer:74, WhatsAppButton:5) or `+91 97028 73497` (Footer wa.me link:34) | P0-5 unifies all contact points | — |
| D2 ⛔ | **Correct Google Maps location / address** (current embed = WISETECH MEP CONSULTANTS) | P0-2 | Replace map with address card, no map |
| D3 | **Brand position:** (a) premium design-build for luxury spaces, or (b) engineering/MEP contractor | Phase 3 typography, photography, copy deck | (a) — matches your stated business goal |
| D4 | SMTP provider + credentials (`SMTP_HOST/PORT/USER/PASS`, `CONTACT_EMAIL`) | Lead email notifications (currently failing silently) | Lead still saves to DB + shows in admin without it |
| D5 | Production hosting target (VPS/nginx, Render+Vercel, etc.) | P2-9 API URL strategy | Add `VITE_API_URL` support so any target works |

---

# PHASE 0 — STOP THE BLEEDING (2–3 days, ~14h)

> Goal: leads arrive, nothing on the site is factually wrong, secrets are safe.
> Every task here is independently shippable.

### P0-1 · Wire the contact form (3h) — THE fix
**Files:** `craftech-frontend/src/components/home/Contact.jsx` (rewrite form block)
**Verified facts:** the API helper already exists (`cmsApi.createLead` → `POST /api/cms/leads`, `api.js:104`); backend saves the lead and fires `emailService.sendContactEmail` (`cmsController.js:152-159`); `react-hook-form` is already in package.json, unused.
**Trap to avoid:** the current form has **no phone field**, but `Lead.phone` is `required: true` (`Lead.js:7`) — wiring as-is would 500 on every submit. Add the phone input.

```jsx
// Contact.jsx — replace the dead <form> with:
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { cmsApi } from '../../services/api';

const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

const onSubmit = async (values) => {
  try {
    await cmsApi.createLead(values);
    reset();
    toast.success("Thank you — we'll call you within 24 hours.");
  } catch {
    toast.error('Something went wrong. Please WhatsApp or call us directly.');
  }
};

<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-1" noValidate>
  <input {...register('name',  { required: true, minLength: 2 })} placeholder="Your Name" ... />
  <input {...register('phone', { required: true, pattern: /^[+\d][\d\s-]{7,14}$/ })} placeholder="Phone / WhatsApp" ... />
  <input {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} placeholder="Email" ... />
  <select {...register('projectType')}> ... </select>
  <textarea {...register('message', { required: true, minLength: 10 })} ... />
  {/* honeypot — hidden from humans, bots fill it (backend rejects in P1-4) */}
  <input {...register('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
  <button disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Request a Call Back'}</button>
</form>
```
Replace placeholder copy at the same time: "Full Stakeholder Identity" → "Your Name", "Brief Vision Disclosure" → "Tell us about your project", button "Initialize Protocol" → "Request a Call Back".
**Verify:** submit on `localhost:5173` → toast → lead appears in `/admin/leads` → (if D4 set) email arrives.

### P0-2 · Fix the map (30m)
**File:** `Contact.jsx:30`. Swap the iframe `src` for the correct place (D2), or replace the iframe with a static address/hours card (faster + on-brand). Also delete the section kicker "Global Operations Hub" → "Visit Our Office".

### P0-3 · Fix soft-delete platform-wide with ONE change (1h)
**File:** `craftech-backend/src/models/plugins/baseSchema.js`
**Verified bug:** deletes set `isDeleted: true` (`cmsController.js:62,85,114,142,168`) but `ProcessStep.find()`, `WhyFeature.find()`, `Testimonial.find()`, `Client.find()`, `Lead.find()` (and `cmsService.getProcessSteps/getWhyFeatures`) never filter it. All five affected models already use this plugin — so fix it at the plugin:

```js
// append inside baseSchemaPlugin(schema):
const excludeDeleted = function () {
  if (!this.getOptions().withDeleted) this.where({ isDeleted: { $ne: true } });
};
schema.pre(['find', 'findOne', 'findOneAndUpdate', 'countDocuments'], excludeDeleted);
```
Side effects checked: `Project`/`Service`/`CorePillar`/`HighlightVideo` don't use the plugin (Project filters via BaseService; the other three hard-delete) — no behavior change for them. `adminController.getStats` already filters manually — now double-filtered, harmless. Restoring a deleted doc later = `Model.findOneAndUpdate({_id}, {isDeleted:false}).setOptions({withDeleted:true})`.
**Verify:** delete a testimonial in admin → it disappears from `GET /api/cms/testimonials` AND from the homepage carousel.

### P0-4 · Remove hardcoded JWT fallback + env boot validation (1h)
**Files:** `middleware/auth.js:16`, `controllers/adminController.js:20`, `src/index.js`
```js
// src/config/env.js (new) — require()d first in index.js
const REQUIRED = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) { console.error(`FATAL: missing env vars: ${missing.join(', ')}`); process.exit(1); }
if (process.env.JWT_SECRET.length < 32) { console.error('FATAL: JWT_SECRET must be ≥32 chars'); process.exit(1); }
```
Then `jwt.sign({id}, process.env.JWT_SECRET, ...)` / `jwt.verify(token, process.env.JWT_SECRET)` — no `||` fallback. **Rotate the secret** (the fallback string is in a public GitHub repo via the frontend org; treat it as burned). Also add the missing SMTP keys to `.env.example`: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL`.
**Verify:** boot without `JWT_SECRET` → process exits with the message. Login still works after rotation.

### P0-5 · One phone number + WhatsApp visible on mobile (2h)
**Files:** `Navbar.jsx:148`, `Footer.jsx:34,74`, `WhatsAppButton.jsx:5,13`
1. Apply D1's number to all four spots (P1-6 later makes it CMS-driven; hardcode-unify now).
2. `WhatsAppButton.jsx`: remove `hidden lg:block` (line 13). Replace with a **mobile sticky action bar** + desktop float:
```jsx
{/* mobile: full-width bottom bar */}
<div className="fixed bottom-0 inset-x-0 z-[5000] grid grid-cols-2 lg:hidden">
  <a href={`tel:${phone}`} className="py-4 bg-navy text-white text-center font-bold text-sm">
    <i className="fa-solid fa-phone mr-2" />Call Now
  </a>
  <a href={waUrl} className="py-4 bg-[#25D366] text-white text-center font-bold text-sm">
    <i className="fa-brands fa-whatsapp mr-2" />WhatsApp
  </a>
</div>
{/* desktop: keep existing float */}
```
**Verify:** Chrome devtools mobile viewport → both buttons visible and tappable; `wa.me` opens with prefilled text.

### P0-6 · Copy hotfixes (1h)
- `Values.jsx:48` "cemented nuestro position" → "cemented our position".
- `About.jsx:50` "120+ Successful projects" → match the real number used in Stats (source of truth: `homeData.stats`).
- `Hero.jsx:136` "Connect with Leads" → "Talk to an Expert".
- `Hero.jsx:145` marquee: remove "ISO 9001:2015" unless you hold the certificate (if you do, keep + add it to the footer with cert number).
- `Footer.jsx:32-33` socials: real URLs or remove the icons (a `#` link is worse than no link). Remove "Built with ♥ for excellence" line.

### P0-7 · Backend into git, safely (30m)
```bash
cd craftech-backend
printf "node_modules/\n.env\nerror_log.txt\n" > .gitignore   # BEFORE git init
git init && git add -A && git commit -m "Initial commit: Craftech API"
```
Create `wisetechitcare/craftech-backend` on GitHub (private) and push.
**Verify:** `git ls-files | grep -c "^\.env$"` → 0.

### P0-8 · Fix the invisible admin cursor (30m)
**File:** `index.css:34` — `body { cursor: none }` applies to the admin where `CustomCursor` is never mounted.
Move the rule off `body` onto a `.cursor-hidden` class that `HomePage.jsx` adds to `<body>` on mount and removes on unmount (`useEffect` + cleanup). Admin gets its cursor back; the public page keeps the custom one (until Phase 3 removes it).
**Verify:** `/admin` on desktop → normal cursor everywhere.

### P0-9 · Quarantine the dangerous seed + dead code (1h)
- Delete `craftech-backend/seed.js` (root) — stale schema fields, wrong env var (`MONGO_URI`), and `deleteMany({})` on testimonials. The real seed is `src/seed.js` (already wired to `npm run seed`).
- Delete `craftech-frontend/src/pages/admin/Dashboard.jsx` (697 lines, zero imports).
- Delete `craftech-backend/src/middleware/multer.js` (never imported; depends on uninstalled `multer-storage-cloudinary`).
- `npm uninstall leaflet react-leaflet clsx tailwind-merge` in frontend (keep `react-hook-form` — P0-1 now uses it).
- Archive `Desktop/irfan/ct/` → `ct_ARCHIVED_2026-06-12.zip` (it's the older duplicate; you have its `.env` open in your IDE right now — close it).
**Verify:** `npm run build` (frontend) and `npm run dev` (backend) still clean.

**Phase 0 exit criteria:** a stranger can submit the form on production and the lead shows in admin; no wrong company/number/typo anywhere; backend in git; admin usable.

---

# PHASE 1 — MAKE THE CMS TRUE + HARDEN THE API (Week 1–2, ~28h)

> Goal: every pixel the admin edits actually renders; public endpoints are injection-proof and validated.

### P1-1 · Wire Services to the API (2h)
**File:** `components/home/Services.jsx` (currently a hardcoded 6-item array, lines 4–11, while `ServicesCMS` + `GET /api/content/services` sit unused).
```jsx
const [services, setServices] = useState([]);
useEffect(() => {
  contentApi.getServices().then(({ data }) => data.success && setServices(
    data.data.filter(s => s.active)
  )).catch(() => {});
}, []);
if (!services.length) return null;   // no hardcoded fallback — seed is the fallback (P1-7)
```
Map DB fields: `title`, `description`, `icon` (the seed stores lucide-ish names like `building`, `home` — standardize on Font Awesome class names in the CMS until Phase 3 swaps icon systems; add a hint in `ServicesCMS`'s icon field).
**Verify:** edit a service title in `/admin/services` → refresh homepage → new title renders.

### P1-2 · Wire Pillars (Values) to the API (1.5h)
**File:** `components/home/Values.jsx` — same pattern, `contentApi.getPillars()`, sorted by `order`. Map `color` enum (`navy|red|gold`) to the existing hex map already hardcoded in the component.

### P1-3 · Wire Videos to the API (2.5h)
**File:** `components/home/Videos.jsx` — replace the hardcoded `videoData` (DB Bhavan / Ramzan Shaikh / Dr. Waqar entries) with `contentApi.getHighlightVideos()`. DB shape is flat (`HighlightVideo` = one URL + thumbnail each) vs the UI's grouped "segments" — group client-side by `category` to keep the segment UI:
```js
const groups = Object.values(
  videos.reduce((acc, v) => {
    (acc[v.category] ||= { title: v.category, poster: v.thumbnailUrl, videos: [] })
      .videos.push({ url: v.url, label: v.title });
    return acc;
  }, {})
);
```
Add `preload="none"` + `poster` to the `<video>` element (currently `autoPlay` with no preload control).
**Verify:** upload a highlight video in admin → appears on homepage; network tab shows no video bytes until play.

### P1-4 · Validation layer + lead anti-spam (4h)
**New files:** `src/middleware/validate.js`, `src/validation/schemas.js` (backend, zod — `npm i zod`)
```js
// validate.js
module.exports = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return next(new AppError(r.error.issues[0].message, 400));
  req.body = r.data;            // stripped/coerced — unknown keys dropped
  next();
};
// schemas.js (excerpt)
const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{7,14}$/, 'Invalid phone'),
  message: z.string().trim().min(10).max(2000),
  projectType: z.string().trim().max(60).optional(),
  website: z.string().max(0).optional(),     // honeypot: any content → reject
}).strict();
```
Mount on every write route (`cms.js`, `content.js`, `projects.js`). Add a dedicated limiter in `index.js`: `rateLimit({ windowMs: 3600_000, max: 5 })` on `POST /api/cms/leads`. Add `app.set('trust proxy', 1)` (limiter currently keys wrongly behind any proxy) and drop `express.json` limit from `50mb` → `1mb`.
**Also:** escape interpolated lead fields in `emailService.js:27-33` (stored-XSS-to-email vector):
```js
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
```
**Verify:** `curl -X POST /api/cms/leads -d '{"name":"x","email":"bad"}'` → 400 with message; honeypot-filled submit → 400; 6th submit in an hour → 429.

### P1-5 · Fix project list injection + caps + categories (3h)
**File:** `controllers/projectController.js:6-13`
**Verified bug:** `req.query` is spread into the Mongo filter, so `?page=2` filters on a nonexistent `page` field (returns empty) and `?x[$ne]=` operator injection is accepted.
```js
exports.getAllProjects = catchAsync(async (req, res) => {
  const filter = {};
  if (typeof req.query.category === 'string') filter.category = req.query.category;
  if (req.query.featured === 'true') filter.featured = true;
  const page  = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const sort  = ['-createdAt', 'createdAt', 'order', '-year'].includes(req.query.sort) ? req.query.sort : '-createdAt';
  const result = await projectService.getAll(filter, { page, limit, sort });
  res.json({ success: true, ...result });
});
```
Frontend: `Portfolio.jsx:14` → `projectsApi.getAll({ limit: 50 })` (removes the silent 10-project cap), and **derive filter chips from data** instead of the hardcoded 4-of-7 list (line 25):
```js
const categories = ['all', ...new Set(projects.map(p => p.category))];
```
Rename the `'all'` chip from "Featured Collection" → "All Projects". Add `express-mongo-sanitize` app-wide as a backstop.
**Verify:** `?page=2` paginates instead of returning `[]`; a project in "Interior Fit Outs" is now filterable; `?category[$ne]=x` → treated as no filter.

### P1-6 · Settings-driven contact identity (3h)
**Backend:** extend `models/Setting.js`: `whatsappNumber`, `mapEmbedUrl`, `tagline`. (Schema-only change; `updateSettings` already passes body through.) Add the fields to `pages/admin/cms/Settings.jsx`.
**Frontend:** `Navbar`, `Footer`, `WhatsAppButton`, `Contact` consume `useCMS().settings` (already fetched by `CMSContext` for every visitor — zero new requests):
```jsx
const { settings } = useCMS();
const phone = settings?.phone ?? '';
const waUrl = `https://wa.me/${(settings?.whatsappNumber || '').replace(/\D/g, '')}?text=...`;
```
**Verify:** change phone in `/admin/settings` → it changes in navbar, footer, WhatsApp links without a deploy.

### P1-7 · One seed, no JSX fallbacks (2h)
Merge the surviving content from the deleted root seed (process steps, why-features, testimonials) into `src/seed.js`, all guarded with `countDocuments()` checks like the existing pillars/services blocks (idempotent — never `deleteMany`). Then strip the hardcoded fallback arrays from `Process.jsx`, `Why.jsx`, `ClientsMarquee.jsx`, `Hero.jsx` (`DEFAULT_SLIDES`), `Stats.jsx` (`DEFAULT_STATS`) — components render `null` when empty. Three sources of truth become one.

### P1-8 · Upload hardening (2h)
**File:** `routes/upload.js` — the live uploader is bare `multer.memoryStorage()` (no type/size limits; the rules only existed in the dead middleware).
```js
const imageUpload = multer({ storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter: (req, f, cb) => cb(null, /^image\/(jpe?g|png|webp)$/.test(f.mimetype)) });
const videoUpload = multer({ storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024, files: 1 },
  fileFilter: (req, f, cb) => cb(null, /^video\/(mp4|quicktime|webm)$/.test(f.mimetype)) });
```
Validate `:projectSlug` (`/^[a-z0-9-]{1,80}$/`) before it becomes a Cloudinary folder path (`uploadController.js:22`).

### P1-9 · Auth session sanity (2h)
**Files:** `services/api.js`, `context/AuthContext.jsx`, `controllers/adminController.js`
- Response interceptor: `401` on an `/admin`-token request → clear `adminToken` + `craftech_admin_user` → redirect `/admin/login`.
- `AuthContext`: on mount with a stored token, call `authApi.getMe()` (exists, unused) to validate instead of trusting localStorage.
- Shorten JWT `expiresIn` `'30d'` → `'12h'` (refresh tokens come with RBAC in Phase 5; 12h is the right interim).

### P1-10 · Ops hygiene (2h)
- `config/db.js`: delete the hardcoded `dns.setServers(['8.8.8.8','8.8.4.4'])` (local ISP workaround; breaks in restricted networks). If your dev machine needs it, gate behind `if (process.env.DNS_OVERRIDE)`.
- `middleware/errorMiddleware.js:25`: remove `fs.appendFileSync` → `npm i pino pino-http`, JSON logs, request IDs; morgan removed.
- CORS (`index.js:23-28`): only include localhost origins when `NODE_ENV !== 'production'`.
- Graceful shutdown: `SIGTERM` → `server.close()` → `mongoose.connection.close()`.

**Phase 1 exit criteria:** grep the public components for hardcoded business content → only Phase-3-pending copy remains; OWASP quick-pass on `/api` (injection, validation, rate limits, upload) clean.

---

# PHASE 2 — CONVERSION ENGINE (Week 2–3, ~24h)

> Goal: every visitor has a ≤2-tap path to contact; every lead is captured with context and worked through a pipeline.

### P2-1 · Lead model v2 + migration (3h)
**File:** `models/Lead.js`
```js
status:      { type: String, enum: ['new','contacted','qualified','follow_up','proposal_sent','won','lost'], default: 'new', index: true },
source:      { type: String, enum: ['contact_form','whatsapp','call','project_page','quote_form'], default: 'contact_form' },
budgetRange: { type: String, enum: ['under_10L','10_25L','25_50L','50L_1Cr','above_1Cr','unknown'], default: 'unknown' },
city:        String,
projectRef:  { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
utm:         { source: String, medium: String, campaign: String },
notes:       [{ body: String, by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, at: { type: Date, default: Date.now } }],
```
Keep `contacted` temporarily; **migration script** `scripts/migrate-leads-v2.js`:
```js
await Lead.updateMany({ contacted: true,  status: { $exists: false } }, { $set: { status: 'contacted' } });
await Lead.updateMany({ contacted: false, status: { $exists: false } }, { $set: { status: 'new' } });
```
Run once, then remove the `contacted` field next release. Index: `{ status: 1, createdAt: -1 }`.

### P2-2 · Lead pipeline UI (6h)
**File:** `pages/admin/cms/LeadsList.jsx` → rebuild as `features/admin/leads/`
- Status select chip per row (PATCH via existing `updateLead`), filter tabs (`All / New / In Progress / Won / Lost`), search by name/phone, notes drawer (uses `notes[]`), CSV export (client-side from loaded rows is fine at this scale).
- Replace `window.confirm` with the existing `ConfirmModal` component (already used in ProjectForm).
- Dashboard (`DashboardHome.jsx`): replace the hardcoded `trend: '+2 this month'` (line 133) with a real computed delta (`createdAt >= startOfMonth` count from a new `/admin/stats` field), and **delete the fake "System Status" card** (lines 240-269 — it's static text claiming "All Systems Operational").

### P2-3 · Context-aware capture (4h)
- **UTM capture:** on public app mount, stash `utm_*` + `document.referrer` in `sessionStorage`; `createLead` merges them in. (Backend already accepts via P1-4 schema once `utm` added to it.)
- **Per-project CTA:** in the Portfolio lightbox sidebar, add "Build Something Like This" → opens contact with `projectRef` + prefilled message; WhatsApp variant: `wa.me/<n>?text=Hi, I'm interested in something like "<project.title>"`.
- **`source` tagging:** contact form → `contact_form`; lightbox → `project_page`.

### P2-4 · 2-step quote form (5h)
**New:** `components/conversion/QuoteModal.jsx`, triggered by navbar "Get a Detailed Quote" and the services section.
Step 1 (no identity, low friction): project type · city · budget band (the `budgetRange` enum) · timeline. Step 2: name + phone (+ optional email). Submits one lead with `source: 'quote_form'`. Progress indicator, back button, <30s to complete.

### P2-5 · Auto-reply + internal notification upgrade (2h)
**File:** `services/emailService.js` — add `sendLeadAutoReply(lead)` ("We received your brief — expect our call within 24 hours" + WhatsApp link + 3 featured project links). Fire alongside the existing internal mail. Both `esc()`-escaped (P1-4). Lazy-create the transporter (currently module-load) and no-op with a warning when SMTP env is absent.

### P2-6 · CTA system rollout (2h)
One verb set everywhere (replaces the current mix of "Get Technical Quote" / "Discover Projects" / "Start a Project" / "Submit Inquiry"):
- Primary: **Book a Free Site Visit** (hero, CTA band)
- Secondary: **Get a Detailed Quote** (navbar, services)
- Tertiary: **Chat on WhatsApp** (sticky bar, footer)
- Per-project: **Build Something Like This**

### P2-7 · Thank-you state + analytics events (2h)
Successful submit → inline success panel ("What happens next: 1. We call within 24h · 2. Site visit · 3. Detailed quote") instead of just a toast. Fire `lead_submitted`, `whatsapp_click`, `call_click`, `quote_opened` events (Plausible or GA4 — one `track()` util; decision D5-adjacent, default Plausible script tag).

**Phase 2 exit criteria:** lead volume measurable by source; pipeline statuses in use; quote form completion tracked.

---

# PHASE 3 — PREMIUM RESKIN (Week 3–5, ~50h)

> Goal: the site *looks* like the work it sells. Default direction = D3(a) premium design-build.

### P3-1 · Design tokens (3h)
**File:** `tailwind.config.js` + `index.html` fonts
```js
fontFamily: {
  display: ['Fraunces', 'Georgia', 'serif'],      // headings — warm, editorial, variable
  sans:    ['Inter', 'system-ui', 'sans-serif'],  // everything else
},
colors: {
  ink:    '#101418',   // near-black text
  navy:   '#0A2647',   // retained as brand anchor, used sparingly
  bone:   '#F4F1EB',   // warm section background (replaces flat white walls)
  taupe:  '#B7AA97',
  brass:  '#A87B4F',   // THE accent (replaces red+gold double act)
  mid:    '#6B7280',
},
borderRadius: { DEFAULT: '6px', lg: '12px' },     // kill rounded-[40px]/[60px]
```
Self-host via `@fontsource-variable/fraunces` + `@fontsource-variable/inter` (removes the 7-weight Poppins Google Fonts request, `index.html:16`). Rules: headings = Fraunces 400–500 with tight leading, **no more `font-black uppercase tracking-[5px]`** except tiny kickers; max one italic accent word per viewport; red `#C41B1F` survives only as a ≤2px rule/tick if at all.

### P3-2 · Effects diet (3h)
Delete: `NoiseOverlay.jsx`, `CustomCursor.jsx` + `useMousePosition` (and all `cursor-none` classes — grep shows ~15 occurrences), Hero particle canvas + mouse orb (`Hero.jsx:45-77,100`), `ScrollProgress` (optional keep), AOS (`npm un aos`, replace with Framer `whileInView` — already used elsewhere). `Preloader.jsx`: once per session (`sessionStorage`), 800ms cap, or delete.
**Keep as the signature interaction:** the masked text reveal + image scale-on-hover.

### P3-3 · Real routes (6h)
**File:** `App.jsx`
```jsx
const Admin = React.lazy(() => import('./features/admin'));   // P4-1 does the split; routes land here
<Route element={<PublicLayout />}>                            {/* Navbar/Footer/StickyBar once */}
  <Route path="/" element={<HomePage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:slug" element={<ProjectDetailPage />} />
  <Route path="/services/:slug" element={<ServicePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="*" element={<NotFound />} />                   {/* replaces silent redirect-home */}
</Route>
```
Backend already serves `GET /api/projects/slug/:slug` — unused until now. Navbar anchors become routes (anchor-scroll preserved on `/` only).

### P3-4 · Project detail = case study (8h)
**New:** `pages/ProjectDetailPage.jsx` (replaces the Portfolio lightbox as primary; lightbox can stay as quick-view).
Layout: full-bleed hero image → title + meta strip (location · year · scope · duration) → narrative (add `story { challenge, solution, outcome }` + `durationMonths`, `scope[]` to the Project schema and ProjectForm) → editorial gallery (mixed spans, already prototyped in the lightbox grid) → videos → testimonial if linked → **"Build Something Like This"** CTA → next-project footer.
Migration: existing projects render fine with empty story fields; backfill via admin.

### P3-5 · Homepage vNext (12h)
Recompose with the audited flow — mostly *rearranging refactored sections, not new builds*:
1. Hero (one image/video, no slider rotation <10s, CTAs per P2-6)
2. Trust strip = `ClientsMarquee` + key stats inline (merge `Stats` in, delete "METRICS." watermark)
3. Featured projects (3) — `featured: true` query, links to case studies
4. Services split (3 flagship cards w/ photography from `service.image` — field exists, unused)
5. **Before/After slider** (new: `components/home/BeforeAfter.jsx`, clip-path + drag handle; add `beforeAfter[{before, after, caption}]` to Project schema + form)
6. Process (keep, add per-step site photos)
7. Testimonial + linked project
8. One video walkthrough (not three)
9. Team/leadership (new `TeamMember` model + simple CMS list page — clone of TestimonialsList pattern, ~2h each end)
10. CTA band → 11. FAQ (new `Faq` model, same CRUD-list pattern) → 12. Footer (settings-driven per P1-6)

### P3-6 · Copy deck (4h, with you)
Per-section rewrite doc: hero promise, service descriptions (the seed copy is solid; the JSX copy is not), process steps, CTA microcopy, about narrative (name the director — the quote is currently attributed to "Director, Craftech"), FAQ answers (budget bands, timelines, warranty, payment schedule). English only; every claim verifiable.

### P3-7 · Admin design-system consolidation (6h)
Extract `features/admin/ui/`: `AdminCard`, `AdminInput`, `AdminSelect`, `AdminTable`, `AdminEmpty`, `AdminPageHeader` — based on the glass style (`rgba(10,38,71,0.25)` cards) already used in DashboardHome/ProjectForm. Migrate LeadsList/HomeCMS (slate-800 style) and Login (`.card` style) onto them. Delete the then-unused `.btn/.card/.input` block from `index.css:5-24` and split the file: `styles/public.css` + `styles/admin.css`.

### P3-8 · Photography standard (doc, 1h)
Rules for every upload: landscape 3:2 or 4:5 portrait, min 1920px wide, daylight or styled lighting, no phone-vertical on hero/thumbnails, people in ≤20% of shots. The redesign lives or dies on this more than on code.

**Phase 3 exit criteria:** side-by-side screenshot review vs. 2–3 reference firms (e.g., premium Mumbai design-build studios); every page passes the "would a ₹1Cr client trust this?" check.

---

# PHASE 4 — SEO + PERFORMANCE (Week 5–6, ~22h)

### P4-1 · Code-split admin (2h) — biggest single perf win
`App.jsx` statically imports all 14 admin pages + lucide + dropzone into the public bundle. `React.lazy` the entire admin subtree behind one `import('./features/admin')` + `<Suspense>`; verify with `vite build` → public chunk shrinks dramatically (measure before/after, expect several hundred KB).

### P4-2 · Image pipeline (4h)
**New:** `lib/cloudinary.js`
```js
export const cld = (url, { w, h, ar } = {}) =>
  url?.includes('/upload/')
    ? url.replace('/upload/', `/upload/f_auto,q_auto${w ? `,w_${w}` : ''}${h ? `,h_${h},c_fill` : ''}${ar ? `,ar_${ar},c_fill` : ''}/`)
    : url;
```
Apply at every `<img>`/background: portfolio thumbnails `w_800`, lightbox/case-study `w_1600`, hero `w_2000` + `<link rel="preload">` pointing at the **actual** first slide (current preload in `index.html:11` targets an image not in the slides). `loading="lazy"` + `decoding="async"` on everything below the fold; `srcset` on hero + case-study heroes.

### P4-3 · Head management + meta (4h)
`npm i react-helmet-async`. `<Seo title description image path type />` component; per route: home (from Settings SEO fields — extend Setting with `seo{defaultTitle,defaultDescription,ogImage}`), project pages (from `project.seo` — **fields exist in the schema, rendered nowhere**, plus fallback to title/description/thumbnail), services, about, contact. OG + Twitter cards + canonical.

### P4-4 · Structured data + sitemap + robots (4h)
- JSON-LD: `LocalBusiness` (name, **one** phone, address, geo, hours, sameAs socials) on every page; `Service` on service pages; `CreativeWork`/`ImageObject` on case studies; `FAQPage` on the FAQ section.
- Backend `GET /sitemap.xml`: static routes + `projects.find({status:'published'}).select('slug updatedAt')` + services. `robots.txt`: allow all, `Disallow: /admin`, sitemap pointer.
- Google Search Console + Google Business Profile with the D1 phone (NAP consistency).

### P4-5 · Font + third-party diet (2h)
Done partly in P3-1 (self-host Fraunces/Inter). Remove Font Awesome CDN (`index.html:19`) — migrate remaining public icons to lucide (`<Phone>`, `<MessageCircle>`, brand icons via simple-icons SVGs). Removes ~80KB render-blocking CSS.

### P4-6 · Caching (3h)
Backend in-memory TTL cache (`node-cache`, 60s) keyed per public content GET (`content:home`, `content:services`…), invalidated in the corresponding update/create/delete controllers. Frontend: TanStack Query (`npm i @tanstack/react-query`) replacing CMSContext's 5-fetch waterfall + the per-component `useEffect` fetches — `useHome()`, `useSettings()`, `useServices()`, `useProjects(params)` hooks with `staleTime: 60_000`.

### P4-7 · Measure (1h)
Lighthouse CI run (mobile) before P4-1 and after P4-6; targets: Performance ≥85, SEO ≥95, Accessibility ≥90 (the a11y backlog: icon-only buttons get `aria-label`s, hamburger gets `aria-expanded`, form inputs get real `<label>`s — currently placeholder-only).

---

# PHASE 5 — BUSINESS PLATFORM (Week 6+, ongoing)

### P5-1 · RBAC (6h)
`Admin` → add `role: { type: String, enum: ['super_admin','admin','content_manager','sales'], default: 'admin' }`.
```js
// middleware/permit.js
const PERMS = {
  super_admin:     ['*'],
  admin:           ['content:*', 'leads:*', 'projects:*', 'media:*'],
  content_manager: ['content:*', 'projects:*', 'media:*'],
  sales:           ['leads:*'],
};
const permit = (perm) => (req, res, next) => { /* match req.admin.role against PERMS */ };
router.put('/settings', protect, permit('settings:write'), updateSettings);
```
Users management page (super_admin only) — clone the CRUD-list pattern. JWT payload gains `role`; move to 1h access + 30d refresh token rotation at this point.

### P5-2 · Media library that tells the truth (8h)
New `MediaAsset` model (`publicId` unique, url, resourceType, bytes, folder, `usedBy[{collection, docId}]`). Write on every upload (`uploadController`), update `usedBy` on project/CMS saves, "orphans" tab in `MediaManager.jsx` with bulk Cloudinary cleanup. Fixes the verified leak: soft-deleted projects strand their Cloudinary files unfindably.

### P5-3 · Analytics dashboard (6h)
`AnalyticsEvent` model (type, path, projectRef, at; TTL index 90d). Public beacon endpoint (rate-limited, no auth, schema-validated). Dashboard charts: leads/week by source, top projects by views, CTA click-through. (Recharts in the lazy admin bundle.)

### P5-4 · Repo + delivery (8h)
- Monorepo per audit Phase 2 layout (move both apps under one git root; the frontend repo history can be grafted or restarted).
- GitHub Actions: lint + `vite build` + backend boot-check on PR; deploy job per D5.
- ESLint + Prettier baseline; Husky pre-commit.
- Seed/env docs in root README; delete `README.md` placeholders.

### P5-5 · Deferred-by-design
TypeScript migration (do it per-module during Phase 5, not as a big bang); Next.js/Astro for the public site **only if** organic search becomes a primary channel — re-evaluate after 8 weeks of Search Console data; Redis cache when a second API instance exists.

---

## MASTER SCHEDULE & EFFORT

| Phase | Effort | Elapsed | Ships |
|---|---|---|---|
| 0 — Stop the bleeding | ~14h | Days 1–3 | Working lead capture, factual site, secured secrets |
| 1 — CMS truth + hardening | ~28h | Week 1–2 | Fully dynamic content, injection-proof API |
| 2 — Conversion engine | ~24h | Week 2–3 | Pipeline CRM, quote funnel, mobile CTAs, attribution |
| 3 — Premium reskin | ~50h | Week 3–5 | New brand surface, case-study pages, admin DS |
| 4 — SEO + performance | ~22h | Week 5–6 | Indexable routes, ≥85 mobile Lighthouse |
| 5 — Platform | ~30h+ | Week 6+ | RBAC, media truth, analytics, CI |
| **Total to "world-class v1"** | **~140h** | **~6 weeks** (1 dev) | |

**Dependency spine:** P0-1 → P1-4 (validation tightens the live form) → P2-* (conversion builds on a working, validated lead path). P1-6 (settings) → P3 footer/navbar. P3-3 (routes) → P4-3/P4-4 (meta/sitemap need URLs to describe). Everything in P0 is parallel-safe.

**Sequencing logic (unchanged from audit):** conversion plumbing before beauty → data-truth before redesign → SEO only after real routes exist.

---

## RISK REGISTER

| Risk | Mitigation |
|---|---|
| Hero/section CMS data shaped for old UI breaks vNext homepage | P3-5 keeps reading the same `Home` fields; new fields are additive; seed updated in lockstep |
| Soft-delete hook (P0-3) hides docs an admin screen expected | Audit confirmed every current list *wants* deleted docs hidden; `withDeleted` escape hatch exists for a future trash view |
| JWT rotation logs out all admins | Announce; it's one login |
| Phase 3 stalls on photography | P3-8 standard + start with the 3 best-shot projects only; don't block the reskin on a full reshoot |
| Copy rewrite drifts back to jargon | Copy deck (P3-6) is reviewed against one rule: "would you say this sentence to a client on the phone?" |

---

## VERIFICATION GATES (run at each phase end)

- **G0:** Form submit → admin lead → email. `git ls-files` clean of `.env`. Mobile viewport shows call/WhatsApp bar.
- **G1:** Edit service/pillar/video/settings in admin → public reflects without deploy. `curl '…/api/projects?page=2'` paginates. Upload a 300MB file → 413. POST lead with `website` filled → 400.
- **G2:** Lead from project page carries `projectRef` + `source`. Status board drag/update persists. Auto-reply received.
- **G3:** Every public page screenshot-reviewed at 390px and 1440px. No `cursor-none`, no AOS, no FA CDN in the bundle.
- **G4:** `vite build` public chunk measured before/after lazy-admin. Lighthouse mobile ≥85/≥90/≥95 (perf/a11y/SEO). `site:` query indexes project URLs after submission.
- **G5:** `sales` role cannot open `/admin/settings` (403 + hidden nav). Orphan media count visible.
