
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchRoadhouse } from "@/api/client";
import { ROADHOUSE } from "@/constants/testIds";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageContent } from "@/hooks/usePageContent";

const TYPES = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "event", label: "Shows" },
  { value: "release", label: "Releases" },
  { value: "field_note", label: "Field Notes" },
  { value: "press", label: "Press" },
];

const rotations = [-0.6, 0.5, -0.3, 0.7, -0.8, 0.4, -0.5, 0.6];

export default function RoadhousePage() {
  const [posts, setPosts] = useState(null);
  const [type, setType] = useState("all");
  const t = usePageContent("roadhouse");

  useEffect(() => {
    fetchRoadhouse().then(setPosts).catch(() => setPosts([]));
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return null;
    return posts.filter((p) => type === "all" || p.type === type);
  }, [posts, type]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-14 sm:pt-20 pb-20">
      <header className="mb-10 max-w-[60ch]">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2">
          {t("eyebrow", "The Roadhouse")}
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.02] text-[rgba(231,224,214,0.95)]">
          {t("headline_primary", "A bulletin board.")}
          <span className="block italic text-[rgba(199,168,106,0.92)]">
            {t("headline_secondary", "A desert dance hall.")}
          </span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed">
          {t("subtext", "Shows, releases, news, and press — pinned to the wall by hand.")}
        </p>
      </header>

      <Tabs value={type} onValueChange={setType} className="mb-10">
        <TabsList className="bg-[hsl(var(--card))] border border-border/70">
          {TYPES.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="font-mono tracking-archival text-[10.5px]">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section data-testid={ROADHOUSE.board} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-2 -mx-2 overflow-hidden">
        {filtered === null && [0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-44 rounded-xl bg-[rgba(231,224,214,0.04)]" />
        ))}
        {filtered?.length === 0 && (
          <p className="col-span-full font-serif italic text-[rgba(231,224,214,0.7)]">
            The board is empty tonight. Come back when the storm passes.
          </p>
        )}
        {filtered?.map((p, i) => (
          <Link
            key={p.id}
            to={`/roadhouse/${p.slug}`}
            data-testid={ROADHOUSE.post}
            className="group relative block rounded-xl border border-border/70 bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:rotate-0 hover:border-[rgba(199,168,106,0.45)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(199,168,106,0.6)]"
            style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
          >
            <span className="neo-pin" aria-hidden="true" />
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.6)]">
                {p.type === "field_note" ? "field note" : p.type}
              </span>
              {p.event_date && (
                <span className="font-mono text-[10px] text-[rgba(199,194,184,0.55)]">
                  {new Date(p.event_date).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl text-[rgba(231,224,214,0.95)] leading-tight group-hover:text-[rgba(199,168,106,0.95)] transition-colors">
              {p.title}
            </h3>
            {p.location && (
              <p className="mt-1 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">
                {p.location}
              </p>
            )}
            {p.excerpt && (
              <p
                className={
                  p.type === "field_note"
                    ? "mt-3 font-serif italic text-[rgba(231,224,214,0.82)] leading-[1.75] whitespace-pre-line line-clamp-5"
                    : "mt-3 text-sm text-[rgba(231,224,214,0.72)] leading-relaxed line-clamp-4"
                }
              >
                {p.excerpt}
              </p>
            )}
            <span
              data-testid={ROADHOUSE.post_open}
              className="mt-4 inline-flex font-mono tracking-archival text-[10.5px] text-[rgba(199,168,106,0.85)] group-hover:text-[rgba(199,168,106,1)]"
            >
              Read →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
