
import React, { useEffect, useState } from "react";
import { ARCHIVE } from "@/constants/testIds";
import { ArchiveDoor } from "@/components/neoverse/ArchiveDoor";
import { fetchAlbums } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchivePage() {
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    fetchAlbums().then(setAlbums).catch(() => setAlbums([]));
  }, []);

  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-14 sm:pt-20 pb-14">
      <header className="mb-12 sm:mb-16 max-w-[60ch]">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2">
          The Archive
        </p>
        <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] text-[rgba(231,224,214,0.95)]">
          Four rooms.
          <span className="block italic text-[rgba(199,168,106,0.92)]">
            One mythology.
          </span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed">
          Each album is its own room. Cross the threshold; the air changes.
          Move slowly — the archive rewards attention.
        </p>
      </header>

      <section
        data-testid={ARCHIVE.grid}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
      >
        {albums === null &&
          [0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[220px] rounded-2xl bg-[rgba(231,224,214,0.04)]" />
          ))}
        {albums?.map((a, i) => (
          <ArchiveDoor key={a.id} album={a} index={i} />
        ))}
        {albums?.length === 0 && (
          <p className="font-serif italic text-[rgba(231,224,214,0.7)]">
            The archive doors are still being hung. Return soon.
          </p>
        )}
      </section>
    </div>
  );
}
