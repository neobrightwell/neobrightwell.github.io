
import React, { useEffect, useState } from "react";
import { fetchObservatory } from "@/api/client";
import { OBSERVATORY } from "@/constants/testIds";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StarMark } from "@/components/neoverse/Glyphs";
import { usePageContent } from "@/hooks/usePageContent";

export default function ObservatoryPage() {
  const [art, setArt] = useState(null);
  const [active, setActive] = useState(null);
  const t = usePageContent("observatory");

  useEffect(() => {
    fetchObservatory().then(setArt).catch(() => setArt([]));
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-14 sm:pt-20 pb-20">
      <header className="mb-12 max-w-[64ch]">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2">
          {t("eyebrow", "The Observatory")}
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5.2vw,4.2rem)] leading-[1.02] text-[rgba(231,224,214,0.95)]">
          {t("headline_primary", "Artifacts from")}
          <span className="block italic text-[rgba(199,168,106,0.92)]">{t("headline_secondary", "another sky.")}</span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed">
          {t("subtext", "Paintings, photographs, and visual projects — examined under quiet light.")}
        </p>
      </header>

      <section data-testid={OBSERVATORY.gallery} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {art === null && [0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[4/5] rounded-xl bg-[rgba(231,224,214,0.04)]" />
        ))}
        {art?.length === 0 && (
          <p className="col-span-full font-serif italic text-[rgba(231,224,214,0.7)]">
            The plates are still being placed under glass.
          </p>
        )}
        {art?.map((piece) => (
          <Dialog key={piece.id} onOpenChange={(o) => setActive(o ? piece : null)}>
            <DialogTrigger asChild>
              <button
                data-testid={OBSERVATORY.art_card}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-[hsl(var(--card))] text-left"
              >
                <AspectRatio ratio={4 / 5} className="overflow-hidden">
                  {piece.image_url ? (
                    <img
                      src={piece.image_url}
                      alt={piece.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-[rgba(20,22,27,0.7)]" />
                  )}
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,12,15,0.92)] via-[rgba(11,12,15,0.35)] to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="flex items-center gap-1.5 text-[rgba(199,168,106,0.85)] mb-1">
                    <StarMark size={9} />
                    <span className="font-mono tracking-archival text-[9.5px]">plate</span>
                  </div>
                  <p className="font-serif text-xl text-[rgba(231,224,214,0.97)] leading-snug">{piece.title}</p>
                  {piece.medium && (
                    <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.55)] mt-0.5">
                      {piece.medium}{piece.year ? ` — ${piece.year}` : ""}
                    </p>
                  )}
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-[hsl(var(--card))] border border-border/70 p-0 overflow-hidden">
              {active && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="bg-[#0B0C0F]">
                    {active.image_url && (
                      <img src={active.image_url} alt={active.title} className="w-full h-full object-cover max-h-[80vh]" />
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-2">
                      plate {active.medium ? `— ${active.medium}` : ""}
                    </p>
                    <h2 className="font-serif text-3xl text-[rgba(231,224,214,0.97)] leading-tight">{active.title}</h2>
                    {active.year && (
                      <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mt-1">
                        CHRONOLOGY — {active.year}
                      </p>
                    )}
                    {active.origin && (
                      <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mt-0.5">
                        ORIGIN — {active.origin}
                      </p>
                    )}
                    {active.description && (
                      <p className="mt-4 text-[rgba(231,224,214,0.78)] leading-relaxed text-sm whitespace-pre-wrap">
                        {active.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))}
      </section>
    </div>
  );
}
