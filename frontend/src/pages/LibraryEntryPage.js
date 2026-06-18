
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchLibraryEntry } from "@/api/client";
import { LIBRARY } from "@/constants/testIds";
import { Skeleton } from "@/components/ui/skeleton";
import { CrescentGlyph } from "@/components/neoverse/Glyphs";

const NOTE_MARK = "[ insert real content via admin";
const isPlaceholder = (s) => typeof s === "string" && s.trim().startsWith(NOTE_MARK);

export default function LibraryEntryPage() {
  const { slug } = useParams();
  const [entry, setEntry] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setEntry(null);
    setErr(false);
    fetchLibraryEntry(slug).then(setEntry).catch(() => setErr(true));
  }, [slug]);

  if (err) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-24 text-center">
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mb-4">
          This page is missing from the archive.
        </h1>
        <Link to="/library" className="neo-link">Return to The Library</Link>
      </div>
    );
  }
  if (!entry) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-16 space-y-4">
        <Skeleton className="h-10 w-2/3 bg-[rgba(231,224,214,0.05)]" />
        <Skeleton className="h-64 bg-[rgba(231,224,214,0.04)]" />
      </div>
    );
  }

  return (
    <div data-testid={LIBRARY.reader} className="mx-auto max-w-[760px] px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
      <Link
        to="/library"
        className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(199,168,106,0.95)]"
      >
        ← back to the library
      </Link>

      <header className="mt-6 mb-10">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">
          {entry.type}
          {entry.date_written && <> — {entry.date_written}</>}
        </p>
        <h1 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.04] text-[rgba(231,224,214,0.98)]">
          {entry.title}
        </h1>
        {entry.subtitle && (
          <p className="mt-3 font-serif italic text-xl text-[rgba(231,224,214,0.78)]">
            {entry.subtitle}
          </p>
        )}
      </header>

      {entry.epigraph && !isPlaceholder(entry.epigraph) && (
        <blockquote className="mb-10 border-l-2 border-[rgba(199,168,106,0.5)] pl-5 font-serif italic text-[rgba(231,224,214,0.85)] text-lg leading-relaxed">
          {entry.epigraph}
        </blockquote>
      )}

      <article className="rounded-2xl neo-paper p-6 sm:p-10">
        {entry.body && !isPlaceholder(entry.body) ? (
          <div className="prose-neoverse neo-dropcap whitespace-pre-wrap">{entry.body}</div>
        ) : (
          <div className="flex flex-col items-center text-center py-12">
            <span className="text-[rgba(199,168,106,0.6)] mb-4">
              <CrescentGlyph size={42} />
            </span>
            <p className="font-serif italic text-lg text-[rgba(231,224,214,0.75)] max-w-[40ch] leading-relaxed">
              The words for this entry are kept elsewhere for now. They will appear here when Neo is ready to release them.
            </p>
          </div>
        )}
      </article>

      {entry.publication_credit && (
        <p className="mt-6 font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)]">
          {entry.publication_credit}
        </p>
      )}

      {entry.marginal_notes?.length > 0 && (
        <aside className="mt-10 rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5">
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-3">
            Marginal notes
          </p>
          <ul className="space-y-2">
            {entry.marginal_notes.map((n, i) => (
              <li key={`${n.slice(0, 40)}-${i}`} className="font-serif italic text-[rgba(231,224,214,0.78)]">
                — {n}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
