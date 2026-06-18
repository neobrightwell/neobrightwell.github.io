/* AlbumPage decomposition — each visual region is its own focused component
 * so the page-level component only orchestrates data fetching and layout. */
import React from "react";
import { Link } from "react-router-dom";
import { ARCHIVE } from "@/constants/testIds";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { CrescentGlyph, StarMark } from "@/components/neoverse/Glyphs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const PLATFORM_LABEL = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  apple: "Apple Music",
  bandcamp: "Bandcamp",
  youtube: "YouTube",
  tidal: "Tidal",
  soundcloud: "SoundCloud",
  amazon: "Amazon Music",
};

const NOTE_MARK = "[ insert real content via admin";
export const isPlaceholder = (s) =>
  typeof s === "string" && s.trim().startsWith(NOTE_MARK);

/* -------- Status states -------- */

export function AlbumNotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-6 pt-24 pb-24 text-center">
      <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">
        Recovered fragment missing
      </p>
      <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mb-4">
        This room is sealed.
      </h1>
      <Link to="/archive" className="neo-link">
        Return to The Archive
      </Link>
    </div>
  );
}

export function AlbumSkeleton() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-16 space-y-6">
      <Skeleton className="h-12 w-2/3 bg-[rgba(231,224,214,0.05)]" />
      <Skeleton className="h-[260px] rounded-2xl bg-[rgba(231,224,214,0.04)]" />
      <Skeleton className="h-32 bg-[rgba(231,224,214,0.04)]" />
    </div>
  );
}

/* -------- Header -------- */

export function AlbumHeading({ album, atmo }) {
  return (
    <div className="lg:col-span-7">
      <div className="flex items-center gap-2 text-[rgba(199,168,106,0.92)] mb-4">
        <StarMark size={10} />
        <span className="font-mono tracking-archival text-[10.5px]">{atmo.tagline}</span>
      </div>
      <h1
        data-testid={ARCHIVE.album_title}
        className="font-serif text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.98] text-[rgba(231,224,214,0.98)] neo-illuminate"
      >
        {album.title}
      </h1>
      {album.subtitle && (
        <p className="mt-3 font-serif italic text-xl text-[rgba(231,224,214,0.78)]">
          {album.subtitle}
        </p>
      )}
      {album.year && (
        <p className="mt-3 font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)]">
          YEAR — {album.year}
        </p>
      )}
      {album.epigraph && !isPlaceholder(album.epigraph) && (
        <blockquote className="mt-6 border-l-2 border-[rgba(199,168,106,0.45)] pl-5 font-serif italic text-[rgba(231,224,214,0.85)] text-lg leading-relaxed max-w-[52ch]">
          {album.epigraph}
        </blockquote>
      )}
    </div>
  );
}

export function AlbumCover({ album, atmo }) {
  return (
    <div className="lg:col-span-5">
      <div className="relative overflow-hidden rounded-2xl neo-frame aspect-square">
        {album.cover_image_url ? (
          <img
            src={album.cover_image_url}
            alt={`${album.title} cover artwork`}
            className="w-full h-full object-cover"
          />
        ) : (
          <AlbumCoverPlaceholder album={album} atmo={atmo} />
        )}
      </div>
    </div>
  );
}

function AlbumCoverPlaceholder({ album, atmo }) {
  return (
    <div className="absolute inset-0">
      <AtmosphereLayer grain stars wash={atmo.wash} />
      <div className="absolute inset-0 flex items-center justify-center text-[rgba(199,168,106,0.4)]">
        <CrescentGlyph size={120} />
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.55)]">
          cover artwork pending
        </p>
        <p className="font-serif text-lg text-[rgba(231,224,214,0.85)] mt-1">
          {album.title}
        </p>
      </div>
    </div>
  );
}

/* -------- Streaming + Fragments aside -------- */

export function StreamingLinksPanel({ album }) {
  const links = album.streaming_links || [];
  return (
    <div className="rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-5 sm:p-6">
      <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-4">
        Listen across the radio dial
      </p>
      {links.length === 0 ? (
        <p className="text-sm text-[rgba(231,224,214,0.65)] leading-relaxed">
          Streaming destinations will be tuned in soon. The archive keeps its own copy.
        </p>
      ) : (
        <ul data-testid={ARCHIVE.album_streaming_links} className="space-y-2.5">
          {links.map((l, i) => (
            <li key={`${l.platform || "p"}-${l.url || i}`}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-md border border-[rgba(199,194,184,0.18)] px-4 py-2.5 hover:border-[rgba(199,168,106,0.6)] hover:bg-[rgba(199,168,106,0.06)] transition-colors"
              >
                <span className="font-serif text-[rgba(231,224,214,0.95)]">
                  {l.label || PLATFORM_LABEL[l.platform] || l.platform}
                </span>
                <span className="font-mono tracking-archival text-[10px] text-[rgba(199,168,106,0.85)]">
                  tune in →
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RecoveredFragmentsPanel({ fragments = [] }) {
  if (fragments.length === 0) return null;
  return (
    <div className="mt-5 rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-5">
      <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-3">
        Recovered fragments
      </p>
      <ul className="space-y-1.5">
        {fragments.map((f, i) => (
          <li
            key={`${f.label}-${f.value}-${i}`}
            className="font-mono text-[11px] text-[rgba(199,194,184,0.78)]"
          >
            <span className="text-[rgba(199,194,184,0.5)] tracking-archival">
              {f.label.toUpperCase()} —{" "}
            </span>
            {f.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------- Tab content -------- */

export function LinerNotesContent({ album }) {
  const showLore = album.lore && !isPlaceholder(album.lore);
  return (
    <div className="rounded-2xl neo-paper p-6 sm:p-8 max-w-[68ch]">
      {showLore ? (
        <div className="prose-neoverse whitespace-pre-wrap">{album.lore}</div>
      ) : (
        <p className="font-serif italic text-[rgba(231,224,214,0.7)] leading-relaxed">
          The liner notes for this room are still in the artist’s hand. Words will be
          inscribed here — by Neo, not by us.
        </p>
      )}
      {album.themes?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {album.themes.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[rgba(199,194,184,0.18)] px-3 py-1 font-mono tracking-archival text-[9.5px] text-[rgba(231,224,214,0.7)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TracklistContent({ sortedSongs }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-[hsl(var(--card))] overflow-hidden">
      {sortedSongs.length === 0 ? (
        <p className="p-6 font-serif italic text-[rgba(231,224,214,0.7)]">
          The tracklist will be carved in here when the record is ready to speak.
        </p>
      ) : (
        <ol className="divide-y divide-[rgba(199,194,184,0.12)]">
          {sortedSongs.map((s, i) => (
            <TrackRow key={s.id || `${s.title}-${i}`} song={s} index={i} />
          ))}
        </ol>
      )}
    </div>
  );
}

function TrackRow({ song, index }) {
  return (
    <li className="flex items-start gap-4 px-5 py-4">
      <span className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mt-1 w-6">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-lg text-[rgba(231,224,214,0.95)]">{song.title}</p>
        {song.notes && !isPlaceholder(song.notes) && (
          <p className="mt-1 text-sm text-[rgba(231,224,214,0.65)] leading-relaxed">
            {song.notes}
          </p>
        )}
      </div>
      {song.duration && (
        <span className="font-mono text-[10.5px] text-[rgba(199,194,184,0.55)]">
          {song.duration}
        </span>
      )}
    </li>
  );
}

export function AlbumTabs({ album, sortedSongs }) {
  const hasSymbolism =
    album.visual_symbolism && !isPlaceholder(album.visual_symbolism);
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="bg-[hsl(var(--card))] border border-border/70">
        <TabsTrigger
          value="notes"
          data-testid={ARCHIVE.album_liner_notes}
          className="font-mono tracking-archival text-[10.5px]"
        >
          Liner notes
        </TabsTrigger>
        <TabsTrigger
          value="tracks"
          data-testid={ARCHIVE.album_tracklist}
          className="font-mono tracking-archival text-[10.5px]"
        >
          Tracklist
        </TabsTrigger>
        {hasSymbolism && (
          <TabsTrigger value="symbols" className="font-mono tracking-archival text-[10.5px]">
            Symbolism
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="notes" className="mt-6">
        <LinerNotesContent album={album} />
      </TabsContent>
      <TabsContent value="tracks" className="mt-6">
        <TracklistContent sortedSongs={sortedSongs} />
      </TabsContent>
      {hasSymbolism && (
        <TabsContent value="symbols" className="mt-6">
          <div className="rounded-2xl neo-paper p-6 sm:p-8 max-w-[68ch] prose-neoverse whitespace-pre-wrap">
            {album.visual_symbolism}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
