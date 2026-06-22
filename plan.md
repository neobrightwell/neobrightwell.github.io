# plan.md — The Neoverse (Neo Brightwell)

## 1) Objectives
- Build a living, immersive world (not a portfolio) with narrative navigation and restrained atmospheric motion.
- Deliver a scalable CMS-driven archive: albums (with immersive sub-pages), library writing, symbols/mythology, Roadhouse dispatches (news/events/press/field notes), and visual art.
- Ensure Roadhouse content is fully readable end-to-end: **bulletin board → dedicated detail page per dispatch** with optional external link surfaced *inside* the detail view.
- Implement “The Invocation” as a production-ready email signup flow (email + optional first name) with a literary confirmation state; architected for provider hookup (Resend/Mailchimp/ConvertKit) without UI redesign.
- Provide a non-technical **admin CMS** so Neo can manage the entire living archive without touching code.
- Ensure fast, mobile-friendly, accessible (WCAG-minded), and SEO-ready delivery.

**Current status:** V1 is live with all major public sections + CMS + JWT admin auth. **Roadhouse detail routing is now implemented and verified** (cards are clickable; `/roadhouse/:slug` pages render correctly).

---

## 2) Implementation Steps (Phased)

### Phase 1 — Core integration POC (Isolation): Email provider-ready “Invocation” **(COMPLETED; folded into Phase 2)**
**Why**: external email service integration is the most failure-prone dependency; validate signup pipeline + provider adapter pattern.

**User stories (Phase 1)**
1. As a visitor, I can enter my email (and optional first name) and receive an in-world confirmation state.
2. As a visitor, I cannot submit invalid emails and I get gentle, non-corporate error copy.
3. As an admin, I can see captured subscribers in the database.
4. As a developer, I can switch email providers by changing env vars, not UI.
5. As a visitor, I can re-submit safely (dedupe) without confusing errors.

**Delivered**
- `POST /api/invocation` implemented with validation + dedupe + DB persistence.
- Provider adapter architecture in place (`email_provider.py`) with DB-only provider active by default and a stub for future provider wiring.
- Admin endpoint to view subscribers (`GET /api/admin/subscribers`, protected).

---

### Phase 2 — V1 App Development (Public site + CMS backend + admin auth) **(COMPLETED)**
**Goal**: working end-to-end public Neoverse with CMS-driven content types and immersive structure; keep copy structural/atmospheric only where needed; do not invent major lore/lyrics.

**User stories (Phase 2)**
1. As a visitor, I cross a “threshold” homepage that sets tone (dust/stars/grain) without slowing reading.
2. As a visitor, I enter The Archive and each album opens a dedicated immersive “room” with art, tracklist, embedded player, and outbound links.
3. As a visitor, I read poems/essays in a quiet Library experience optimized for long-form reading.
4. As a visitor, I explore Symbols/Mythology entries via a constellation interaction.
5. As a visitor, I can sign up via The Invocation from multiple entry points without leaving the world.
6. As Neo, I can manage all content via a simple admin interface.
7. As a visitor, I can read full Roadhouse dispatches via a dedicated URL per entry.

**Backend (FastAPI + MongoDB)**
- Implemented structured collections + Pydantic schemas for core content types actually shipped:
  - Albums (with Songs, StreamingLinks, RecoveredFragments)
  - Library entries
  - Symbols
  - Roadhouse posts (including Field Notes)
  - Visual art (Observatory)
  - Subscribers (Invocation)
- Implemented public read endpoints and full admin CRUD endpoints (JWT-protected).
- Ensured DB indexes (unique slugs; unique subscriber email).

**Frontend (React + Router + Framer Motion + shadcn/ui customized)**
- Global design tokens implemented (palette/typography/texture) per design guidelines.
- Site structure delivered:
  - `/` Threshold homepage (hero “wow moment” illumination)
  - `/archive` Archive doors + 4 immersive album rooms (`/archive/:slug`) with distinct atmospheres
  - `/library` + `/library/:slug` sacred reading UX
  - `/symbols` constellation interaction + `/symbols/:slug`
  - `/roadhouse` bulletin board
  - **`/roadhouse/:slug` Roadhouse dispatch detail pages**
  - `/observatory` gallery + modal viewing
  - `/invocation` dedicated landing + embedded Invocation in footer
- Motion system: restrained, atmospheric (dust/grain/stars), page transitions; Sélune appears briefly on transitions to selected sections.
- Integrated audio player component styled as an artifact.

**Roadhouse detail experience (COMPLETED)**
- Implemented and wired `RoadhousePostPage`:
  - Added route: `/roadhouse/:slug` in `src/App.js`
  - Added API client: `fetchRoadhousePost(slug)`
  - Converted Roadhouse bulletin cards to `<Link>` navigation (`RoadhousePage.js`)
  - Converted homepage “Latest dispatches” strip cards to `<Link>` navigation (`HomePageSections.js`)
  - External links are no longer launched from cards; they appear on the detail page only (per editorial direction).
- Verified in preview via screenshot automation:
  - Clicking a card on `/roadhouse` routes to `/roadhouse/<slug>`
  - Clicking a card from homepage routes to `/roadhouse/<slug>`
  - Detail page renders title, type, date (when present), body/excerpt, optional image, back link, and optional external link button.

**Admin CMS + Auth (folded into Phase 2; originally Phase 3)**
- Single-admin JWT auth:
  - `POST /api/admin/login` issues token
  - Protected admin routes for CRUD
- Admin UI:
  - `/admin/login` + `/admin`
  - `/admin/:resource` list views, `/admin/:resource/:id` edit/create views
  - `/admin/subscribers` table + CSV export

**Checkpoint: V1 E2E test**
- Backend: previously reported **100% (27/27)**
- Frontend: previously reported **95% (31/32)** with the remaining flags documented as non-bugs.
- Additional targeted Roadhouse navigation verification completed (manual automation + screenshots).

---

### Phase 3 — Admin Panel + Auth (JWT) + Editorial workflow **(COMPLETED; merged into Phase 2)**
**Note**: This phase was originally planned as a separate step, but admin auth + CMS were implemented during Phase 2 because they were straightforward and required for V1 to function as a living archive.

---

### Phase 4 — Polish: accessibility, performance, SEO, and refinement passes **(OPTIONAL / NEXT WHEN REQUESTED)**
**User stories (Phase 4)**
1. As a visitor on mobile, pages load quickly and remain readable with effects reduced if needed.
2. As a visitor using a screen reader, I can navigate landmarks, headings, and forms clearly.
3. As a visitor, I can find albums/poems via site search without breaking immersion.
4. As Neo, I can share any page and it renders with correct social preview metadata.
5. As a returning visitor, I notice subtle, non-intrusive hidden details that reward exploration.

**Steps**
- Accessibility audit:
  - confirm semantic landmarks, heading order, link names, form labels
  - contrast checks on textured surfaces
  - confirm reduced-motion behavior across all overlays/animations
- Performance pass:
  - image lazy-loading and size constraints
  - reduce heavy overlays on low-power devices
  - audit bundle size and remove unused dependencies
- SEO:
  - per-page dynamic meta (title/description)
  - OpenGraph/Twitter cards (section + per-album + per-Roadhouse post)
  - sitemap + robots
- Search + filters:
  - gentle search across Library + Archive
  - tagging filters for Library and possibly Roadhouse
- Final regression test across major routes + admin workflows.

---

### Phase 5 — Real email provider integration **(OPTIONAL / WHEN CREDENTIALS AVAILABLE)**
**Goal**: wire The Invocation into Resend / ConvertKit / Mailchimp without redesign.

**Steps**
- Choose provider (Resend recommended for API simplicity unless ConvertKit/Mailchimp is preferred).
- Add env vars and implement provider adapter in `email_provider.py`.
- Confirm:
  - success and error handling
  - double opt-in behavior (if desired)
  - admin visibility of provider sync status (or logging/telemetry)

---

### Phase 6 — File uploads / object storage **(OPTIONAL)**
**Goal**: if URLs/base64 become limiting, move images/audio previews to S3/R2.

**Steps**
- Add signed upload endpoints.
- Store object URLs in Mongo instead of raw base64.
- Add admin UX for file uploads and asset management.

---

### Phase 7 — Content insertion (Neo’s editorial pass) **(ONGOING / OWNER: NEO)**
- Neo fills in real lore, lyrics, poems, essays, album notes, artwork via admin.
- Pending known content task:
  - Add full tracklist (with times) for **“Burn Bright, Stay Free”** once provided.

---

### Phase 8 — Future immersive expansions (optional)
- Hidden `/signal` page (daily frequency; recovered transmissions)
- Coordinates page / archive accession map
- More “linger-to-reveal” details (strictly optional; keep restraint)
- Additional symbolic interactions (constellation improvements)

---

## 3) Next Actions
1. **If deploying to production**: ensure you are deploying the latest preview build that includes Roadhouse detail routing.
2. Provide the tracklist + song durations for **“Burn Bright, Stay Free”** (P1) to add times into the album page.
3. Decide if you want to prioritize **Phase 4 (polish)** or **Phase 5 (email provider integration)** next.
4. If moving to a real provider next, provide:
   - provider choice (Resend / ConvertKit / Mailchimp)
   - double opt-in vs single opt-in
   - audience/list ID (if applicable)

---

## 4) Success Criteria
- Visitors experience a coherent threshold-to-rooms journey; nothing reads as a generic portfolio.
- Each of the 4 albums has its own immersive page with embedded listening capability (when audio URLs/embeds are added) + outbound streaming links, and clearly marked real-content insertion blocks.
- **Roadhouse is fully navigable**: bulletin board cards and homepage strip cards open **internal** detail pages at `/roadhouse/:slug`, and any external link is available from within the post.
- The Invocation works end-to-end: validation, dedupe, DB persistence; provider hookup requires only env/config changes.
- Neo can manage all content types from a usable admin interface without touching code.
- Site is fast on mobile, honors reduced motion, and is SEO-shareable with correct metadata.