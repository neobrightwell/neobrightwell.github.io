import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRoadhousePost } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { CrescentGlyph } from "@/components/neoverse/Glyphs";

const TYPE_LABELS = {
  news: "news",
  event: "event",
  release: "release",
  press: "press",
  field_note: "field note",
};

export default function RoadhousePostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setErr(false);
    fetchRoadhousePost(slug)
      .then((d) => { if (!cancelled) setPost(d); })
      .catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, [slug]);

  if (err) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-24 text-center">
        <span className="inline-flex text-[rgba(199,168,106,0.7)] mb-6">
          <CrescentGlyph size={42} />
        </span>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mb-4">
          This dispatch has fallen from the board.
        </h1>
        <Link to="/roadhouse" className="neo-link">
          Return to The Roadhouse
        </Link>
      </div>
    );
  }
  if (!post) {
    return (
      <div className="mx-auto max-w-[720px] px-6 pt-16 space-y-4">
        <Skeleton className="h-10 w-2/3 bg-[rgba(231,224,214,0.05)]" />
        <Skeleton className="h-40 bg-[rgba(231,224,214,0.04)]" />
      </div>
    );
  }

  const isFieldNote = post.type === "field_note";
  const dateStr = post.event_date
    ? new Date(post.event_date).toLocaleDateString(undefined, {
        month: "long", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-[760px] px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
      <Link
        to="/roadhouse"
        className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(199,168,106,0.95)]"
      >
        ← back to the roadhouse
      </Link>

      <header className="mt-6 mb-8">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">
          {TYPE_LABELS[post.type] || post.type}
          {dateStr && <> — {dateStr}</>}
        </p>
        <h1 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.04] text-[rgba(231,224,214,0.98)]">
          {post.title}
        </h1>
        {post.location && (
          <p className="mt-2 font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">
            {post.location}
          </p>
        )}
      </header>

      {post.image_url && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-border/60">
          <img src={post.image_url} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      <article
        className={
          isFieldNote
            ? "rounded-2xl neo-paper p-6 sm:p-10 font-serif italic text-[rgba(231,224,214,0.88)] text-lg sm:text-xl leading-[1.85] whitespace-pre-line"
            : "rounded-2xl neo-paper p-6 sm:p-10 prose-neoverse whitespace-pre-line"
        }
      >
        {post.body || post.excerpt || (
          <p className="font-serif italic text-[rgba(231,224,214,0.7)]">
            (no body yet — fill it in via the admin panel)
          </p>
        )}
      </article>

      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-[rgba(199,168,106,0.55)] bg-[rgba(199,168,106,0.08)] px-5 py-3 font-mono tracking-archival text-[10.5px] text-[rgba(231,224,214,0.92)] hover:bg-[rgba(199,168,106,0.16)] transition-colors"
        >
          {post.link_label || "Open"} →
        </a>
      )}
    </div>
  );
}
