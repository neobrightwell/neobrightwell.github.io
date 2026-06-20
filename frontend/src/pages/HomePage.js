import React, { useEffect, useState } from "react";
import { InvocationForm } from "@/components/neoverse/InvocationForm";
import { fetchAlbums, fetchRoadhouse } from "@/api/client";
import {
  ThresholdHero,
  PortalsSection,
  AlbumsStrip,
  RoadhouseStrip,
} from "./HomePageSections";

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [albums, setAlbums] = useState([]);

  // Imports `fetchAlbums` and `fetchRoadhouse` are stable module references,
  // so this effectively runs once on mount.
  useEffect(() => {
    let cancelled = false;
    fetchAlbums()
      .then((d) => { if (!cancelled) setAlbums((d || []).slice(0, 4)); })
      .catch(() => {});
    fetchRoadhouse()
      .then((d) => { if (!cancelled) setLatest((d || []).slice(0, 3)); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative">
      <ThresholdHero />
      <PortalsSection />
      <AlbumsStrip albums={albums} />
      <RoadhouseStrip posts={latest} />
      <section className="mx-auto max-w-[860px] px-4 sm:px-6 mt-24">
        <InvocationForm source="homepage" />
      </section>
    </div>
  );
}
