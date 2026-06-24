
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSymbols } from "@/api/client";
import { SYMBOLS } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, EyeGlyph, ThresholdGlyph, StarMark } from "@/components/neoverse/Glyphs";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------
//  Constellation groupings.
//  Each group is its own mini-constellation. When a node is hovered,
//  only lines WITHIN that group are drawn.
// ---------------------------------------------------------------------
const CONSTELLATIONS = [
  {
    id: "celestial",
    label: "The Celestial",
    slugs: ["selune", "crescent-and-star", "the-eye"],
  },
  {
    id: "wayfaring",
    label: "The Wayfaring",
    slugs: ["the-road", "liminality-glyph", "the-archive"],
  },
  {
    id: "testimony",
    label: "The Testimony",
    slugs: ["the-witness", "fire"],
  },
];

// Hand-tuned positions (% of canvas). Each row vertically separated so
// labels never collide; groups occupy distinct regions of the sky.
const POSITIONS = {
  // Celestial — top hemisphere
  "selune":             { x: 50, y: 18 },
  "crescent-and-star":  { x: 32, y: 32 },
  "the-eye":            { x: 64, y: 34 },
  // Wayfaring — lower-left arc
  "liminality-glyph":   { x: 22, y: 56 },
  "the-road":           { x: 16, y: 80 },
  "the-archive":        { x: 44, y: 78 },
  // Testimony — right side
  "the-witness":        { x: 74, y: 56 },
  "fire":               { x: 82, y: 78 },
};

const groupForSlug = (slug) =>
  CONSTELLATIONS.find((g) => g.slugs.includes(slug)) || null;

// Deterministic fallback for any symbol slug that isn't in our hand-tuned
// layout (e.g., a future symbol added via admin). Lands them in a safe
// strip along the bottom-center so they don't collide with the known map.
const fallbackPosition = (slug, idx) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 9973;
  const x = 35 + ((h + idx * 11) % 30); // 35..65%
  const y = 88 + ((h * 3) % 6);          // 88..93%
  return { x, y };
};

// pick a default glyph by slug
const pickGlyph = (slug) => {
  if (slug.includes("eye") || slug.includes("witness")) return EyeGlyph;
  if (slug.includes("liminality") || slug.includes("road") || slug.includes("archive")) return ThresholdGlyph;
  return CrescentGlyph;
};

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetchSymbols().then(setSymbols).catch(() => setSymbols([]));
  }, []);

  // Decorate symbols with position + group metadata.
  const placed = useMemo(() => {
    if (!symbols) return [];
    return symbols.map((s, i) => {
      const pos = POSITIONS[s.slug] || fallbackPosition(s.slug, i);
      const group = groupForSlug(s.slug);
      return { ...s, pos, groupId: group?.id || null };
    });
  }, [symbols]);

  // Group-aware line drawing: when a node is hovered, surface only the
  // lines connecting nodes in the same constellation.
  const activeLines = useMemo(() => {
    if (!hovered) return [];
    const center = placed.find((s) => s.slug === hovered);
    if (!center || !center.groupId) return [];
    const peers = placed.filter(
      (s) => s.groupId === center.groupId && s.slug !== center.slug
    );
    // pairwise connections inside the group (triangle for 3, single line for 2)
    const groupNodes = placed.filter((s) => s.groupId === center.groupId);
    const lines = [];
    for (let i = 0; i < groupNodes.length; i++) {
      for (let j = i + 1; j < groupNodes.length; j++) {
        const a = groupNodes[i];
        const b = groupNodes[j];
        // emphasis: the edges touching the hovered node are brighter
        const touchesHovered = a.slug === center.slug || b.slug === center.slug;
        lines.push({
          key: `${a.slug}--${b.slug}`,
          x1: a.pos.x,
          y1: a.pos.y,
          x2: b.pos.x,
          y2: b.pos.y,
          emphasized: touchesHovered,
        });
      }
    }
    return lines.length ? lines : peers.map((p) => ({
      // safety net — shouldn't happen for groups of 2+, but handles singleton groups
      key: `${center.slug}--${p.slug}`,
      x1: center.pos.x, y1: center.pos.y,
      x2: p.pos.x, y2: p.pos.y,
      emphasized: true,
    }));
  }, [hovered, placed]);

  const hoveredGroupId = useMemo(() => {
    if (!hovered) return null;
    const center = placed.find((s) => s.slug === hovered);
    return center?.groupId || null;
  }, [hovered, placed]);

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
        style={{ height: "min(820px, 95vh)", minHeight: "560px" }}
        onMouseLeave={() => setHovered(null)}
      >
        <AtmosphereLayer grain stars vignette wash="archive" />

        {/* Constellation lines (within hovered group only) */}
        {activeLines.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {activeLines.map((ln) => (
              <line
                key={ln.key}
                x1={`${ln.x1}%`}
                y1={`${ln.y1}%`}
                x2={`${ln.x2}%`}
                y2={`${ln.y2}%`}
                stroke={
                  ln.emphasized
                    ? "rgba(199,168,106,0.55)"
                    : "rgba(199,168,106,0.28)"
                }
                strokeWidth={ln.emphasized ? "0.9" : "0.6"}
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

        {placed.map((s) => {
          const Glyph = pickGlyph(s.slug);
          const isActive = hovered === s.slug;
          const inHoveredGroup = hoveredGroupId && s.groupId === hoveredGroupId;
          const dim = hoveredGroupId && !inHoveredGroup;
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
                  isActive
                    ? "text-[rgba(199,168,106,1)]"
                    : inHoveredGroup
                    ? "text-[rgba(199,168,106,0.85)]"
                    : "text-[rgba(199,168,106,0.6)]"
                }`}
                style={{ opacity: dim ? 0.35 : 1 }}
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
                <span className="font-mono tracking-archival text-[9px] sm:text-[9.5px] text-[rgba(231,224,214,0.85)] opacity-80 group-hover:opacity-100 whitespace-nowrap">
                  {s.name}
                </span>
              </span>
            </Link>
          );
        })}

        {/* Caption */}
        <div className="absolute left-5 bottom-5 flex items-center gap-2 text-[rgba(199,194,184,0.55)]">
          <StarMark size={10} />
          <p className="font-mono tracking-archival text-[10px]">
            Three constellations — hover to draw.
          </p>
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
