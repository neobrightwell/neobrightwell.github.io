# plan.md — The Neoverse (Neo Brightwell)

## 1) Objectives
- Build a living, immersive world (not a portfolio) with narrative navigation and restrained atmospheric motion.
- Deliver a scalable CMS-driven archive: albums (with immersive sub-pages), library writing, symbols/mythology, news/events/press, visual art.
- Implement “The Invocation” as a production-ready email signup flow (email + optional first name) with a literary confirmation state; architect for later provider hookup (Mailchimp/ConvertKit/Resend).
- Ensure fast, mobile-friendly, accessible (WCAG-minded), SEO-ready delivery.

## 2) Implementation Steps (Phased)

### Phase 1 — Core integration POC (Isolation): Email provider-ready “Invocation”
**Why**: external email service integration is the most failure-prone dependency; prove signup pipeline + provider adapter pattern early.

**User stories (Phase 1)**
1. As a visitor, I can enter my email (and optional first name) and receive an in-world confirmation state.
2. As a visitor, I cannot submit invalid emails and I get gentle, non-corporate error copy.
3. As an admin, I can see captured subscribers in the database.
4. As a developer, I can switch email providers (Resend/ConvertKit/Mailchimp) by changing env vars, not UI.
5. As a visitor, I can re-submit safely (dedupe) without confusing errors.

**Steps**
- Define provider adapter interface: `subscribe(email, firstName)` with implementations:
  - `DatabaseOnlyProvider` (always works; baseline)
  - `ResendProvider` (or provider-of-choice stub ready for credentials)
- Build a minimal FastAPI endpoint: `POST /api/invocation` (validate, dedupe, store, call provider).
- Create a standalone Python test script to hit the endpoint with real cases (valid/invalid/duplicate) and assert responses.
- (If credentials provided) run live provider call; otherwise verify adapter wiring + DB capture.
- Do not proceed until: validation + dedupe + DB persistence + adapter swap works.


### Phase 2 — V1 App Development (Public site + CMS backend, no admin auth yet)
**Goal**: working end-to-end public Neoverse with CMS-driven content types and immersive structure; keep copy structural/atmospheric only where needed; do not invent major lore/lyrics.

**User stories (Phase 2)**
1. As a visitor, I cross a “threshold” homepage that sets tone (dust/stars/grain) without slowing reading.
2. As a visitor, I enter The Archive and each album opens a dedicated immersive “room” with art, tracklist, embedded player, and outbound links.
3. As a visitor, I read poems/essays in a quiet Library experience optimized for long-form reading.
4. As a visitor, I explore Symbols/Mythology entries and discover subtle hidden details on hover/linger.
5. As a visitor, I can sign up via The Invocation from multiple entry points without leaving the world.

**Backend (FastAPI + MongoDB)**
- Create collections + schemas (Pydantic) for content types:
  - Albums, Songs, Poems, Essays, Publications, PressCoverage, VisualArt, Events, Symbols
- Implement CRUD endpoints for each type (public read endpoints + admin write endpoints placeholder).
- Image handling MVP: base64 storage fields + size/type validation (artwork, hero images, gallery items).
- Audio handling MVP:
  - Store streaming links per album/song (Spotify/Apple/Bandcamp/YouTube/etc.).
  - Support embedded player via configurable `embedType` + `embedUrl` (or uploaded preview audio later).
- Seed initial structure:
  - 4 albums with only allowed facts + clearly marked “INSERT REAL CONTENT” blocks.
  - Symbols entries for provided mythology names (no new lore).

**Frontend (React + Router + Framer Motion)**
- Global design system:
  - Palette: midnight/charcoal/silver; accents moonlit blue/violet/faded gold; rare neon crimson/ember.
  - Type: literary serif headings + readable body; avoid tech/corporate.
  - Components: ThresholdHero, ArchiveDoor, AlbumRoom, LibraryReader, SymbolCard, RoadhouseBoard, ObservatoryGallery, InvocationModal.
- Narrative navigation:
  - Primary paths: Threshold → Archive / Library / Symbols / Roadhouse / Observatory.
  - Secondary micro-navigation via “fragments” (epigraph slots, marginal notes, archive references) as placeholders.
- Motion (restrained): dust, grain, faint stars, slow parallax, gentle reveals; page transitions like turning archive pages.
- “Wow moments” (pick 1–2 only):
  - The Archive illumination on entry.
  - Sélune subtle appearance during certain transitions.
- SEO: clean routes, meta tags per section, sitemap endpoint later.

**Checkpoint: V1 E2E test**
- Run one full pass: homepage → album room → library read → symbols → invocation submit.
- Fix broken links, mobile layout issues, animation jank.


### Phase 3 — Admin Panel + Auth (JWT) + Editorial workflow
**Goal**: non-technical admin can manage the living archive; add auth after V1 is stable.

**User stories (Phase 3)**
1. As Neo, I can log in to an admin area securely and stay signed in.
2. As Neo, I can create/edit albums and attach songs, embeds, and streaming links.
3. As Neo, I can upload/replace artwork and manage visual art galleries.
4. As Neo, I can publish poems/essays/publications/press coverage with dates/tags/status.
5. As Neo, I can create/edit Symbols entries and control ordering/visibility.

**Steps**
- Implement JWT auth (single-admin or role-ready) + protected admin routes.
- Build admin UI (simple, form-driven): list → edit → preview → publish.
- Add validation + content status fields (draft/published) across types.
- Add relationship management:
  - Album ↔ Songs, Album ↔ Symbols, Posts ↔ Tags.
- Add subscriber export view (CSV download) and provider sync status.
- Conclude with testing agent: admin CRUD + public rendering reflects changes.


### Phase 4 — Polish: accessibility, performance, SEO, and refinement passes
**User stories (Phase 4)**
1. As a visitor on mobile, pages load quickly and remain readable with effects reduced if needed.
2. As a visitor using a screen reader, I can navigate landmarks, headings, and forms clearly.
3. As a visitor, I can find albums/poems via site search without breaking immersion.
4. As Neo, I can share any page and it renders with correct social preview metadata.
5. As a returning visitor, I notice subtle, non-intrusive hidden details that reward exploration.

**Steps**
- Accessibility: focus states, contrast checks, reduced-motion support, semantic headings.
- Performance: optimize images (size limits), lazy-load media, minimize heavy effects on mobile.
- SEO: dynamic meta per content, OpenGraph/Twitter cards, sitemap + robots.
- Add gentle search (Library + Archive) and tagging filters.
- Final E2E regression test across major routes + admin workflows.


## 3) Next Actions
1. Confirm the email provider preference for first integration target (Resend vs ConvertKit vs Mailchimp). If unknown, proceed with DatabaseOnlyProvider + Resend adapter scaffold.
2. Confirm domain/branding basics: preferred URL slug style and whether “Moonshine Disco” needs its own section or stays as a motif.
3. Begin Phase 1 POC: implement `/api/invocation`, subscribers collection, adapter interface, Python test script.
4. After Phase 1 is green, start Phase 2 build (models + seeded content + core pages + motion system).


## 4) Success Criteria
- Visitors experience a coherent threshold-to-rooms journey; no page feels like a generic portfolio.
- Each of the 4 albums has its own immersive page with embedded listening + outbound streaming links, and clearly marked real-content insertion blocks.
- The Invocation works end-to-end: validation, dedupe, DB persistence; provider hookup requires only env/config changes.
- Neo can manage all content types from a usable admin interface without touching code.
- Site is fast on mobile, supports reduced motion, and is SEO-shareable with correct metadata.
