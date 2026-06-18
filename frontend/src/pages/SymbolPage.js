
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSymbol } from "@/api/client";
import { SYMBOLS } from "@/constants/testIds";
import { Skeleton } from "@/components/ui/skeleton";
import { CrescentGlyph, EyeGlyph, ThresholdGlyph } from "@/components/neoverse/Glyphs";
import { sanitizeSvg } from "@/lib/sanitize";

const NOTE_MARK = "[ insert real content via admin";
const isPlaceholder = (s) => typeof s === "string" && s.trim().startsWith(NOTE_MARK);

const pickGlyph = (slug = "") => {
  if (slug.includes("eye") || slug.includes("witness")) return EyeGlyph;
  if (slug.includes("liminality") || slug.includes("road") || slug.includes("archive")) return ThresholdGlyph;
  return CrescentGlyph;
};

export default function SymbolPage() {
  const { slug } = useParams();
  const [sym, setSym] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setSym(null);
    setErr(false);
    fetchSymbol(slug).then(setSym).catch(() => setErr(true));
  }, [slug]);
  if (err) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-24 text-center">
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mb-4">
          This symbol is hidden for now.
        </h1>
        <Link to="/symbols" className="neo-link">Return to The Symbols</Link>
      </div>
    );
  }
  if (!sym) {
    return (
      <div className="mx-auto max-w-[860px] px-6 pt-16 space-y-4">
        <Skeleton className="h-10 w-2/3 bg-[rgba(231,224,214,0.05)]" />
        <Skeleton className="h-48 bg-[rgba(231,224,214,0.04)]" />
      </div>
    );
  }

  const Glyph = pickGlyph(sym.slug);

  return (
    <div className="mx-auto max-w-[920px] px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
      <Link to="/symbols" className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(199,168,106,0.95)]">
        ← back to the symbols
      </Link>

      <header className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">symbol</p>
          <h1
            data-testid={SYMBOLS.title}
            className="font-serif text-[clamp(2.4rem,5.4vw,4rem)] leading-[1.02] text-[rgba(231,224,214,0.98)]"
          >
            {sym.name}
          </h1>
          {sym.short_definition && (
            <p className="mt-3 font-serif italic text-xl text-[rgba(231,224,214,0.82)]">
              {sym.short_definition}
            </p>
          )}
          {sym.themes?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {sym.themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[rgba(199,194,184,0.2)] px-3 py-1 font-mono tracking-archival text-[9.5px] text-[rgba(231,224,214,0.75)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-4 flex justify-center md:justify-end">
          {sym.image_url ? (
            <img
              src={sym.image_url}
              alt={sym.name}
              className="h-36 w-36 object-contain"
              style={{
                filter: [
                  sym.image_filter || "",
                  "drop-shadow(0 12px 36px rgba(199,168,106,0.18))",
                ].filter(Boolean).join(" "),
              }}
            />
          ) : sym.glyph_svg ? (
            <div
              className="text-[rgba(199,168,106,0.95)] h-32 w-32"
              // Sanitized via DOMPurify with an SVG-only allowlist.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(sym.glyph_svg) }}
            />
          ) : (
            <span className="text-[rgba(199,168,106,0.85)]">
              <Glyph size={132} />
            </span>
          )}
        </div>
      </header>

      <article className="mt-12 rounded-2xl neo-paper p-6 sm:p-10">
        {sym.full_description && !isPlaceholder(sym.full_description) ? (
          <div className="prose-neoverse whitespace-pre-wrap">{sym.full_description}</div>
        ) : (
          <p className="font-serif italic text-[rgba(231,224,214,0.72)] leading-relaxed">
            The full description for this symbol will be written in Neo’s own hand. For now, it lives in the negative space between the works.
          </p>
        )}
      </article>

      {sym.related_works?.length > 0 && (
        <section data-testid={SYMBOLS.occurrences} className="mt-10">
          <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">
            Occurrences
          </p>
          <div className="flex flex-wrap gap-2">
            {sym.related_works.map((slug) => (
              <Link
                key={slug}
                to={`/archive/${slug}`}
                className="rounded-md border border-[rgba(199,194,184,0.18)] px-3 py-1.5 font-mono tracking-archival text-[10px] text-[rgba(231,224,214,0.85)] hover:border-[rgba(199,168,106,0.5)] hover:bg-[rgba(199,168,106,0.05)] transition-colors"
              >
                {slug}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
