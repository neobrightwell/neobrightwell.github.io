
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSymbols } from "@/api/client";
import { SYMBOLS } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, EyeGlyph, ThresholdGlyph, StarMark } from "@/components/neoverse/Glyphs";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------
//  Default constellation groupings (FALLBACK ONLY).
//  Used when no symbol in the dataset has explicit `connects_to` set yet.
//  As soon as ANY symbol has `connects_to` configured via the admin,
//  the page switches entirely to that explicit graph.
// ---------------------------------------------------------------------
const DEFAULT_GROUPS = [
  ["selune", "crescent-and-star", "the-eye"],
  ["the-road", "liminality-glyph", "the-archive"],
  ["the-witness", "fire"],
];

// Default per-slug positions (FALLBACK ONLY). Used when a symbol has no
// explicit pos_x / pos_y configured in the admin.
const DEFAULT_POSITIONS = {
  "selune":             { x: 50, y: 18 },
  "crescent-and-star":  { x: 32, y: 32 },
  "the-eye":            { x: 64, y: 34 },
  "liminality-glyph":   { x: 22, y: 56 },
  "the-road":           { x: 16, y: 80 },
  "the-archive":        { x: 44, y: 78 },
  "the-witness":        { x: 74, y: 56 },
  "fire":               { x: 82, y: 78 },
};

// Deterministic fallback for any slug with no explicit position and no
// entry in DEFAULT_POSITIONS. Lands them in a strip along the bottom so
// new symbols are visible until you reposition them via admin.
const hashPosition = (slug, idx) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 9973;
  const x = 35 + ((h + idx * 11) % 30); // 35..65%
  const y = 88 + ((h * 3) % 6);          // 88..93%
  return { x, y };
};

const pickGlyph = (slug) => {
  if (slug.includes("eye") || slug.includes("witness")) return EyeGlyph;
  if (slug.includes("liminality") || slug.includes("road") || slug.includes("archive")) return ThresholdGlyph;
  return CrescentGlyph;
};

const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetchSymbols().then(setSymbols).catch(() => setSymbols([]));
  }, []);

  // --- Resolve positions (explicit > default map > hash fallback) ---
  const placed = useMemo(() => {
    if (!symbols) return [];
    return symbols.map((s, i) => {
      let pos;
      if (
        typeof s.pos_x === "number" &&
        typeof s.pos_y === "number" &&
        Number.isFinite(s.pos_x) &&
        Number.isFinite(s.pos_y)
      ) {
        pos = { x: s.pos_x, y: s.pos_y };
      } else if (DEFAULT_POSITIONS[s.slug]) {
        pos = DEFAULT_POSITIONS[s.slug];
      } else {
        pos = hashPosition(s.slug, i);
      }
      return { ...s, pos };
    });
  }, [symbols]);

  // --- Build the edge set ---
  // Mode A: if ANY symbol has a non-null connects_to (even []), use the
  //         explicit graph entirely.
  // Mode B: otherwise, fall back to DEFAULT_GROUPS (pairwise within each).
  const edges = useMemo(() => {
    if (!placed.length) return new Set();
    const slugSet = new Set(placed.map((s) => s.slug));
    const hasExplicit = placed.some(
      (s) => Array.isArray(s.connects_to) // null/undefined = unset
    );
    const out = new Set();
    if (hasExplicit) {
      placed.forEach((s) => {
        if (!Array.isArray(s.connects_to)) return;
        s.connects_to.forEach((other) => {
          if (other && other !== s.slug && slugSet.has(other)) {
            out.add(edgeKey(s.slug, other));
          }
        });
      });
    } else {
      DEFAULT_GROUPS.forEach((groupSlugs) => {
        const present = groupSlugs.filter((sl) => slugSet.has(sl));
        for (let i = 0; i < present.length; i++) {
          for (let j = i + 1; j < present.length; j++) {
            out.add(edgeKey(present[i], present[j]));
          }
        }
      });
    }
    return out;
  }, [placed]);

  // --- Compute connected components (each = one constellation) ---
  const componentOf = useMemo(() => {
    const adj = {};
    placed.forEach((s) => { adj[s.slug] = new Set(); });
    edges.forEach((e) => {
      const [a, b] = e.split("|");
      adj[a]?.add(b);
      adj[b]?.add(a);
    });
    const comp = {};
    let id = 0;
    placed.forEach((s) => {
      if (comp[s.slug] != null) return;
      const stack = [s.slug];
      const cid = id++;
      while (stack.length) {
        const cur = stack.pop();
        if (comp[cur] != null) continue;
        comp[cur] = cid;
        (adj[cur] || []).forEach((n) => {
          if (comp[n] == null) stack.push(n);
        });
      }
    });
    return comp;
  }, [placed, edges]);

  const hoveredComponent = hovered != null ? componentOf[hovered] : null;

  // --- Active lines (only edges inside the hovered component) ---
  const activeLines = useMemo(() => {
    if (hoveredComponent == null) return [];
    const slugToPos = {};
    placed.forEach((s) => { slugToPos[s.slug] = s.pos; });
    const lines = [];
    edges.forEach((e) => {
      const [a, b] = e.split("|");
      if (componentOf[a] !== hoveredComponent) return;
      const pa = slugToPos[a];
      const pb = slugToPos[b];
      if (!pa || !pb) return;
      const touchesHovered = a === hovered || b === hovered;
      lines.push({
        key: e,
        x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y,
        emphasized: touchesHovered,
      });
    });
    return lines;
  }, [edges, componentOf, hoveredComponent, hovered, placed]);

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

        {/* Constellation lines (within hovered component only) */}
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
          const inHoveredComp =
            hoveredComponent != null && componentOf[s.slug] === hoveredComponent;
          const dim = hoveredComponent != null && !inHoveredComp;
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
                    : inHoveredComp
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
            Hover a symbol to draw its constellation.
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
