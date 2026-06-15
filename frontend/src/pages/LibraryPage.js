
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLibrary } from "@/api/client";
import { LIBRARY } from "@/constants/testIds";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ThresholdGlyph } from "@/components/neoverse/Glyphs";

const TYPES = [
  { value: "all", label: "All" },
  { value: "poem", label: "Poems" },
  { value: "essay", label: "Essays" },
  { value: "manuscript", label: "Manuscripts" },
  { value: "publication", label: "Publications" },
];

export default function LibraryPage() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    fetchLibrary().then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return items.filter((i) => {
      if (type !== "all" && i.type !== type) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (![i.title, i.subtitle, ...(i.tags || [])].some((v) => (v || "").toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [items, search, type]);

  return (
    <div data-testid={LIBRARY.index} className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-14 sm:pt-20 pb-14">
      <header className="mb-12 max-w-[60ch]">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2">
          The Library
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.02] text-[rgba(231,224,214,0.95)]">
          Recovered documents.
          <span className="block italic text-[rgba(199,168,106,0.92)]">A quiet reading room.</span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed">
          Poems, essays, manuscripts. Take your time — these are documents that
          ask to be sat with.
        </p>
      </header>

      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={type}
          onValueChange={setType}
          className="w-full sm:w-auto"
          data-testid={LIBRARY.filter_tabs}
        >
          <TabsList className="bg-[hsl(var(--card))] border border-border/70">
            {TYPES.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="font-mono tracking-archival text-[10.5px]">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          data-testid={LIBRARY.search}
          type="search"
          placeholder="search by title or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72 bg-[rgba(20,22,27,0.55)] border-[rgba(199,194,184,0.18)]"
        />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered === null && [0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-[rgba(231,224,214,0.04)]" />
        ))}
        {filtered?.length === 0 && (
          <p className="font-serif italic text-[rgba(231,224,214,0.7)]">
            The shelves here are still being filled. New entries arrive in the artist’s own time.
          </p>
        )}
        {filtered?.map((entry) => (
          <Link
            key={entry.id}
            to={`/library/${entry.slug}`}
            data-testid={LIBRARY.item}
            className="group relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 hover:border-[rgba(199,168,106,0.45)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="mt-1 text-[rgba(199,168,106,0.7)] group-hover:text-[rgba(199,168,106,1)] transition-colors">
                <ThresholdGlyph size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.55)] mb-1">
                  {entry.type}
                </p>
                <h3 className="font-serif text-2xl text-[rgba(231,224,214,0.95)] leading-tight">
                  {entry.title}
                </h3>
                {entry.subtitle && (
                  <p className="mt-1 font-serif italic text-[rgba(231,224,214,0.72)]">{entry.subtitle}</p>
                )}
                {entry.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[rgba(199,194,184,0.18)] px-2.5 py-0.5 font-mono tracking-archival text-[9px] text-[rgba(231,224,214,0.7)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
