import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAlbum } from "@/api/client";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { IntegratedAudioPlayer } from "@/components/neoverse/IntegratedAudioPlayer";
import { sanitizeEmbed } from "@/lib/sanitize";
import {
  AlbumNotFound,
  AlbumSkeleton,
  AlbumHeading,
  AlbumCover,
  StreamingLinksPanel,
  RecoveredFragmentsPanel,
  AlbumTabs,
} from "./AlbumPageParts";

const ATMO_MAP = {
  "neon-rodeo": { wash: "blue", tagline: "the desert highway" },
  "an-american-reckoning": { wash: "fire", tagline: "the fire and the testimony" },
  "we-didnt-survive-to-be-quiet": { wash: "archive", tagline: "the archive of survivors" },
  "burn-bright-stay-free": {
    wash: "liberation",
    tagline: "liberation • endurance • transformation",
  },
  default: { wash: "blue", tagline: "" },
};

export default function AlbumPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setAlbum(null);
    setErr(false);
    fetchAlbum(slug)
      .then((data) => { if (!cancelled) setAlbum(data); })
      .catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, [slug]);

  const sortedSongs = useMemo(
    () =>
      (album?.songs || [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [album?.songs]
  );

  if (err) return <AlbumNotFound />;
  if (!album) return <AlbumSkeleton />;

  const atmo = ATMO_MAP[album.atmosphere] || ATMO_MAP.default;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] z-0">
        <AtmosphereLayer grain dust stars wash={atmo.wash} vignette />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-4 sm:px-6 pt-12 sm:pt-16 pb-16">
        <Link
          to="/archive"
          className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(199,168,106,0.95)]"
        >
          ← back to the archive
        </Link>

        <header className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <AlbumHeading album={album} atmo={atmo} />
          <AlbumCover album={album} atmo={atmo} />
        </header>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <IntegratedAudioPlayer tracks={album.songs} albumTitle={album.title} />
            {album.embed_html && (
              <div
                className="mt-4 rounded-xl overflow-hidden border border-border/60"
                // Sanitized: DOMPurify with embed-only allowlist (Spotify / Bandcamp / YouTube …).
                // The string passed to __html ALWAYS flows through sanitizeEmbed first.
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: sanitizeEmbed(album.embed_html) }}
              />
            )}
          </div>
          <aside className="lg:col-span-5">
            <StreamingLinksPanel album={album} />
            <RecoveredFragmentsPanel fragments={album.recovered_fragments} />
          </aside>
        </section>

        <section className="mt-14">
          <AlbumTabs album={album} sortedSongs={sortedSongs} />
        </section>
      </div>
    </div>
  );
}
