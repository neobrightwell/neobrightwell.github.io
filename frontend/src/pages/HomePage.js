
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { THRESHOLD } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, ThresholdGlyph, EyeGlyph, StarMark } from "@/components/neoverse/Glyphs";
import { InvocationForm } from "@/components/neoverse/InvocationForm";
import { fetchAlbums, fetchRoadhouse } from "@/api/client";

const PORTALS = [
  { to: "/archive", label: "The Archive", line: "Four rooms. Four atmospheres.", testid: THRESHOLD.portal_archive, Glyph: CrescentGlyph },
  { to: "/library", label: "The Library", line: "Recovered documents. Quiet, sacred.", testid: THRESHOLD.portal_library, Glyph: ThresholdGlyph },
  { to: "/observatory", label: "The Observatory", line: "Artifacts from another sky.", testid: THRESHOLD.portal_observatory, Glyph: EyeGlyph },
];

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [albums, setAlbums] = useState([]);

  // Imports `fetchAlbums` and `fetchRoadhouse` are stable module references,
  // so this effectively runs once on mount.
  useEffect(() => {
    let cancelled = false;
    fetchAlbums()
      .then((d) => { if (!cancelled) setAlbums((d || []).slice(0, 4)); })
      .catch(() => {});
    fetchRoadhouse()
      .then((d) => { if (!cancelled) setLatest((d || []).slice(0, 3)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative">
      {/* THRESHOLD HERO — "wow moment" #1: hero illuminates from within on mount */}
      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-10 sm:pt-14 lg:pt-20">
        <div
          data-testid={THRESHOLD.hero}
          className="relative overflow-hidden rounded-2xl neo-frame neo-illuminate"
          style={{ minHeight: "min(72vh, 720px)" }}
        >
          <AtmosphereLayer grain dust stars vignette wash="threshold" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1605571925268-bd3129e7df97?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400')",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(11,12,15,0.6)] to-[rgba(11,12,15,0.95)]" aria-hidden="true" />
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-14 sm:py-18 lg:py-24 flex flex-col gap-8 min-h-[inherit] justify-end">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 text-[rgba(199,168,106,0.95)]"
            >
              <CrescentGlyph size={26} />
              <span className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.75)]">
                Moonshine Disco — outlaw soul for people who survived
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] text-[rgba(231,224,214,0.98)] tracking-[-0.015em] max-w-[18ch]"
            >
              I hope you remember
              <span className="block italic text-[rgba(199,168,106,0.92)]">yourself tonight.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic text-[rgba(231,224,214,0.78)] text-lg sm:text-xl max-w-[58ch] leading-relaxed"
            >
              You’ve crossed a threshold. Inside: music, letters that were never mailed,
              a distant radio transmission, and an archive built for people who survived
              impossible things.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
            >
              <Link
                to="/archive"
                data-testid={THRESHOLD.cta_enter_archive}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[rgba(199,168,106,0.95)] px-5 py-3 font-mono tracking-archival text-[11px] text-[#0B0C0F] hover:bg-[rgba(199,168,106,1)] transition-colors"
              >
                Enter The Archive <span aria-hidden>→</span>
              </Link>
              <Link
                to="/library"
                data-testid={THRESHOLD.cta_open_library}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[rgba(199,194,184,0.32)] px-5 py-3 font-mono tracking-archival text-[11px] text-[rgba(231,224,214,0.92)] hover:bg-[rgba(231,224,214,0.04)] transition-colors"
              >
                Open The Library
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THREE PORTALS */}
      <section
        data-testid={THRESHOLD.portals}
        className="mx-auto max-w-[1180px] px-4 sm:px-6 mt-20 sm:mt-28"
      >
        <div className="flex items-center gap-3 mb-6">
          <StarMark size={11} className="text-[rgba(199,168,106,0.8)]" />
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">
            Three doors into the Neoverse
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PORTALS.map(({ to, label, line, testid, Glyph }) => (
            <Link
              key={to}
              to={to}
              data-testid={testid}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-6 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[rgba(199,168,106,0.45)]"
            >
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

      {/* LATEST ALBUMS — small strip */}
      {albums.length > 0 && (
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
            {albums.map((a, i) => (
              <Link
                key={a.id}
                to={`/archive/${a.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 hover:border-[rgba(199,168,106,0.45)] transition-colors min-h-[180px]"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                {a.cover_image_url && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center opacity-[0.55] group-hover:opacity-[0.78] transition-opacity duration-500"
                    style={{ backgroundImage: `url('${a.cover_image_url}')` }}
                  />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgba(11,12,15,0.95)] via-[rgba(11,12,15,0.55)] to-[rgba(11,12,15,0.30)]" />
                <AtmosphereLayer grain />
                <div className="relative z-10">
                  <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.6)] mb-3">
                    {a.subtitle || "—"}
                  </p>
                  <h3 className="font-serif text-xl text-[rgba(231,224,214,0.97)] leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ROADHOUSE STRIP */}
      {latest.length > 0 && (
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
            {latest.map((p) => (
              <div key={p.id} className="relative rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5">
                <span className="neo-pin" aria-hidden="true" />
                <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.55)] mb-2">{p.type}</p>
                <h3 className="font-serif text-xl text-[rgba(231,224,214,0.95)] leading-tight">{p.title}</h3>
                {p.excerpt && <p className="mt-2 text-sm text-[rgba(231,224,214,0.7)] leading-relaxed">{p.excerpt}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INVOCATION */}
      <section className="mx-auto max-w-[860px] px-4 sm:px-6 mt-24">
        <InvocationForm source="homepage" />
      </section>
    </div>
  );
}
