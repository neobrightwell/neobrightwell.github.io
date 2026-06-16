
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSymbols } from "@/api/client";
import { SYMBOLS } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, EyeGlyph, ThresholdGlyph, StarMark } from "@/components/neoverse/Glyphs";
import { Skeleton } from "@/components/ui/skeleton";

// pick a default glyph by slug
const pickGlyph = (slug) => {
  if (slug.includes("eye") || slug.includes("witness")) return EyeGlyph;
  if (slug.includes("liminality") || slug.includes("road") || slug.includes("archive")) return ThresholdGlyph;
  return CrescentGlyph;
};

// Pseudo-random but deterministic position by slug — nodes scattered as a constellation.
const posFor = (slug, idx) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 9973;
  const x = 8 + ((h * 7) % 80); // 8..88%
  const y = 12 + ((h * 13 + idx * 17) % 70); // 12..82%
  return { x, y };
};

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetchSymbols().then(setSymbols).catch(() => setSymbols([]));
  }, []);

  const positions = (symbols || []).map((s, i) => ({ ...s, pos: posFor(s.slug, i) }));
  const center = hovered ? positions.find((s) => s.slug === hovered) : null;

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-14 sm:pt-20 pb-20">
      <header className="mb-12 max-w-[64ch]">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2">
          The Symbols
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.02] text-[rgba(231,224,214,0.95)]">
          A living mythology.
          <span className="block italic text-[rgba(199,168,106,0.92)]">
            Decoded in fragments.
          </span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed">
          Sélune. The crescent and star. The eye. The liminality glyph. Recurring
          shapes that speak across the work — remembrance, survival, transformation,
          return, truth, witness.
        </p>
      </header>

      {/* Constellation field */}
      <section
        data-testid={SYMBOLS.constellation}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))]"
        style={{ height: "min(560px, 70vh)" }}
        onMouseLeave={() => setHovered(null)}
      >
        <AtmosphereLayer grain stars vignette wash="archive" />

        {/* Constellation lines on hover */}
        {center && (
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            {positions
              .filter((s) => s.slug !== center.slug)
              .map((s) => (
                <line
                  key={s.slug}
                  x1={`${center.pos.x}%`}
                  y1={`${center.pos.y}%`}
                  x2={`${s.pos.x}%`}
                  y2={`${s.pos.y}%`}
                  stroke="rgba(199,168,106,0.32)"
                  strokeWidth="0.6"
                  strokeDasharray="2 4"
                />
              ))}
          </svg>
        )}

        {symbols === null && (
          <div className="absolute inset-0 flex items-center justify-center text-[rgba(199,194,184,0.55)]">
            <Skeleton className="h-8 w-32 bg-[rgba(231,224,214,0.06)]" />
          </div>
        )}

        {positions.map((s) => {
          const Glyph = pickGlyph(s.slug);
          const isActive = hovered === s.slug;
          return (
            <Link
              key={s.slug}
              to={`/symbols/${s.slug}`}
              data-testid={`${SYMBOLS.node}-${s.slug}`}
              onMouseEnter={() => setHovered(s.slug)}
              onFocus={() => setHovered(s.slug)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${s.pos.x}%`, top: `${s.pos.y}%` }}
            >
              <span
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  isActive ? "text-[rgba(199,168,106,1)]" : "text-[rgba(199,168,106,0.6)]"
                }`}
              >
                <span className="relative">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="object-contain transition-all duration-300"
                      style={{
                        width: isActive ? 56 : 42,
                        height: isActive ? 56 : 42,
                        filter: [
                          s.image_filter || "",
                          isActive
                            ? "drop-shadow(0 0 18px rgba(199,168,106,0.55)) brightness(1.05)"
                            : "drop-shadow(0 0 10px rgba(199,168,106,0.20)) opacity(0.88)",
                        ].filter(Boolean).join(" "),
                      }}
                    />
                  ) : (
                    <Glyph size={isActive ? 36 : 28} />
                  )}
                  {isActive && (
                    <span className="absolute -inset-3 rounded-full ring-1 ring-[rgba(199,168,106,0.45)] animate-pulse" />
                  )}
                </span>
                <span className="font-mono tracking-archival text-[9.5px] text-[rgba(231,224,214,0.85)] opacity-80 group-hover:opacity-100">
                  {s.name}
                </span>
              </span>
            </Link>
          );
        })}

        {/* Caption */}
        <div className="absolute left-5 bottom-5 flex items-center gap-2 text-[rgba(199,194,184,0.55)]">
          <StarMark size={10} />
          <p className="font-mono tracking-archival text-[10px]">Hover a symbol to draw the constellation</p>
        </div>
      </section>

      {/* List view (accessibility / mobile) */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols?.map((s) => {
          const Glyph = pickGlyph(s.slug);
          return (
            <Link
              key={s.id}
              to={`/symbols/${s.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 hover:border-[rgba(199,168,106,0.4)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3 text-[rgba(199,168,106,0.85)]">
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.name}
                    className="h-7 w-7 object-contain"
                    style={{
                      filter: [
                        s.image_filter || "",
                        "drop-shadow(0 0 8px rgba(199,168,106,0.25))",
                      ].filter(Boolean).join(" "),
                    }}
                  />
                ) : (
                  <Glyph size={24} />
                )}
                <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.6)]">symbol</span>
              </div>
              <h3 className="font-serif text-2xl text-[rgba(231,224,214,0.95)]">{s.name}</h3>
              {s.short_definition && (
                <p className="mt-2 text-sm text-[rgba(231,224,214,0.72)] leading-relaxed">{s.short_definition}</p>
              )}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
