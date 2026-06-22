/* HomePage sections, extracted so HomePage.js becomes a thin orchestrator.
 * No behavioural changes from before — pure decomposition. */
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { THRESHOLD } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, ThresholdGlyph, EyeGlyph, StarMark } from "@/components/neoverse/Glyphs";

export const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};
export const FADE_UP_TITLE = { ...FADE_UP, initial: { opacity: 0, y: 16 } };
export const EASE = [0.22, 1, 0.36, 1];

export const PORTALS = [
  { to: "/archive", label: "The Archive", line: "Four rooms. Four atmospheres.", testid: THRESHOLD.portal_archive, Glyph: CrescentGlyph },
  { to: "/library", label: "The Library", line: "Recovered documents. Quiet, sacred.", testid: THRESHOLD.portal_library, Glyph: ThresholdGlyph },
  { to: "/observatory", label: "The Observatory", line: "Artifacts from another sky.", testid: THRESHOLD.portal_observatory, Glyph: EyeGlyph },
];

const HERO_BG =
  "url('https://images.unsplash.com/photo-1605571925268-bd3129e7df97?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400')";

export function ThresholdBio() {
  return (
    <section className="mx-auto max-w-[720px] px-4 sm:px-6 mt-20 sm:mt-28">
      <div className="space-y-5 font-serif text-[rgba(231,224,214,0.88)] text-lg sm:text-xl leading-[1.75]">
        <p>
          Neo Brightwell is an American singer-songwriter, outlaw poet, producer,
          and originator of Moonshine Disco.
        </p>
        <p>
          He writes from the borderlands between memory and myth, building songs,
          poems, records, and artifacts that inhabit a shared universe known as
          the Neoverse.
        </p>
        <p>
          His work is concerned with witness, survival, inheritance, and the
          strange ways people continue carrying what history fails to record.
        </p>
        <p>He lives in Philadelphia.</p>
        <p className="italic text-[rgba(199,168,106,0.92)] pt-1">
          The rest is in the archive.
        </p>
      </div>
    </section>
  );
}

export function ThresholdHero() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-10 sm:pt-14 lg:pt-20">
      <div
        data-testid={THRESHOLD.hero}
        className="relative overflow-hidden rounded-2xl neo-frame neo-illuminate"
        style={{ minHeight: "min(72vh, 720px)" }}
      >
        <AtmosphereLayer grain dust stars vignette wash="threshold" />
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.22]" style={{ backgroundImage: HERO_BG }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(11,12,15,0.6)] to-[rgba(11,12,15,0.95)]" aria-hidden="true" />
        <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-14 sm:py-18 lg:py-24 flex flex-col gap-8 min-h-[inherit] justify-end">
          <motion.div {...FADE_UP} transition={{ duration: 1.4, ease: EASE }} className="flex items-center gap-3 text-[rgba(199,168,106,0.95)]">
            <CrescentGlyph size={26} />
            <span className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.75)]">
              Moonshine Disco — outlaw soul for people who survived
            </span>
          </motion.div>
          <motion.h1 {...FADE_UP_TITLE} transition={{ duration: 1.4, delay: 0.15, ease: EASE }} className="font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] text-[rgba(231,224,214,0.98)] tracking-[-0.015em] max-w-[18ch]">
            I hope you remember
            <span className="block italic text-[rgba(199,168,106,0.92)]">yourself tonight.</span>
          </motion.h1>
          <motion.p {...FADE_UP} transition={{ duration: 1.4, delay: 0.35, ease: EASE }} className="font-serif italic text-[rgba(231,224,214,0.78)] text-lg sm:text-xl max-w-[58ch] leading-relaxed">
            You’ve crossed a threshold. Inside: music, letters that were never mailed, a distant radio
            transmission, and an archive built for people who survived impossible things.
          </motion.p>
          <motion.div {...FADE_UP} transition={{ duration: 1.4, delay: 0.5, ease: EASE }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <Link to="/archive" data-testid={THRESHOLD.cta_enter_archive} className="inline-flex items-center justify-center gap-2 rounded-md bg-[rgba(199,168,106,0.95)] px-5 py-3 font-mono tracking-archival text-[11px] text-[#0B0C0F] hover:bg-[rgba(199,168,106,1)] transition-colors">
              Enter The Archive <span aria-hidden>→</span>
            </Link>
            <Link to="/library" data-testid={THRESHOLD.cta_open_library} className="inline-flex items-center justify-center gap-2 rounded-md border border-[rgba(199,194,184,0.32)] px-5 py-3 font-mono tracking-archival text-[11px] text-[rgba(231,224,214,0.92)] hover:bg-[rgba(231,224,214,0.04)] transition-colors">
              Open The Library
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function PortalsSection() {
  return (
    <section data-testid={THRESHOLD.portals} className="mx-auto max-w-[1180px] px-4 sm:px-6 mt-20 sm:mt-28">
      <div className="flex items-center gap-3 mb-6">
        <StarMark size={11} className="text-[rgba(199,168,106,0.8)]" />
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">
          Three doors into the Neoverse
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PORTALS.map(({ to, label, line, testid, Glyph }) => (
          <Link key={to} to={to} data-testid={testid} className="group relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-6 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[rgba(199,168,106,0.45)]">
            <AtmosphereLayer grain dust />
            <div className="relative z-10">
              <span className="inline-flex text-[rgba(199,168,106,0.85)] group-hover:text-[rgba(199,168,106,1)] transition-colors mb-5">
                <Glyph size={26} />
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[rgba(231,224,214,0.95)]">{label}</h3>
              <p className="mt-2 text-[rgba(231,224,214,0.7)] leading-relaxed">{line}</p>
              <p className="mt-6 font-mono tracking-archival text-[10px] text-[rgba(199,168,106,0.8)] group-hover:text-[rgba(199,168,106,1)] transition-colors">
                cross over →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AlbumsStrip({ albums }) {
  if (!albums?.length) return null;
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 mt-20">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">From The Archive</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[rgba(231,224,214,0.95)] mt-1">Four rooms. One mythology.</h2>
        </div>
        <Link to="/archive" className="hidden sm:inline-flex font-mono tracking-archival text-[10.5px] text-[rgba(199,168,106,0.95)] hover:text-[rgba(199,168,106,1)]">
          All rooms →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {albums.map((a, i) => <AlbumStripCard key={a.id} album={a} index={i} />)}
      </div>
    </section>
  );
}

function AlbumStripCard({ album, index }) {
  return (
    <Link
      to={`/archive/${album.slug}`}
      className="group relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 hover:border-[rgba(199,168,106,0.45)] transition-colors min-h-[180px]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {album.cover_image_url && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-[0.55] group-hover:opacity-[0.78] transition-opacity duration-500"
          style={{ backgroundImage: `url('${album.cover_image_url}')` }}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgba(11,12,15,0.95)] via-[rgba(11,12,15,0.55)] to-[rgba(11,12,15,0.30)]" />
      <AtmosphereLayer grain />
      <div className="relative z-10">
        <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.6)] mb-3">{album.subtitle || "—"}</p>
        <h3 className="font-serif text-xl text-[rgba(231,224,214,0.97)] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{album.title}</h3>
      </div>
    </Link>
  );
}

export function RoadhouseStrip({ posts }) {
  if (!posts?.length) return null;
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 mt-20">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">The Roadhouse</p>
          <h2 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mt-1">Latest dispatches</h2>
        </div>
        <Link to="/roadhouse" className="font-mono tracking-archival text-[10.5px] text-[rgba(199,168,106,0.95)]">
          The bulletin board →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/roadhouse/${p.slug}`}
            className="group relative block rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 transition-all duration-300 hover:border-[rgba(199,168,106,0.45)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(199,168,106,0.6)]"
          >
            <span className="neo-pin" aria-hidden="true" />
            <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.55)] mb-2">
              {p.type === "field_note" ? "field note" : p.type}
            </p>
            <h3 className="font-serif text-xl text-[rgba(231,224,214,0.95)] leading-tight group-hover:text-[rgba(199,168,106,0.95)] transition-colors">
              {p.title}
            </h3>
            {p.excerpt && (
              <p
                className={
                  p.type === "field_note"
                    ? "mt-2 font-serif italic text-[rgba(231,224,214,0.78)] leading-[1.75] whitespace-pre-line line-clamp-4"
                    : "mt-2 text-sm text-[rgba(231,224,214,0.7)] leading-relaxed line-clamp-3"
                }
              >
                {p.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
