import React from "react";
import { Link } from "react-router-dom";
import { ARCHIVE } from "@/constants/testIds";
import { CrescentGlyph, StarMark } from "./Glyphs";
import { AtmosphereLayer } from "./AtmosphereLayer";

const ATMOSPHERE_MAP = {
  "neon-rodeo": {
    wash: "blue",
    accent: "the desert highway",
    accentColor: "rgba(127, 166, 199, 0.9)",
  },
  "an-american-reckoning": {
    wash: "fire",
    accent: "the fire and the testimony",
    accentColor: "rgba(208, 122, 58, 0.9)",
  },
  "we-didnt-survive-to-be-quiet": {
    wash: "archive",
    accent: "the archive of survivors",
    accentColor: "rgba(123, 106, 154, 0.9)",
  },
  "burn-bright-stay-free": {
    wash: "liberation",
    accent: "liberation • endurance • transformation",
    accentColor: "rgba(199, 168, 106, 0.95)",
  },
  default: { wash: "blue", accent: "—", accentColor: "rgba(199,194,184,0.7)" },
};

export const ArchiveDoor = ({ album, index = 0 }) => {
  const conf = ATMOSPHERE_MAP[album.atmosphere] || ATMOSPHERE_MAP.default;
  // wow moment: sequential illumination via animation-delay
  const style = { animationDelay: `${120 * index}ms` };
  return (
    <Link
      to={`/archive/${album.slug}`}
      data-testid={`${ARCHIVE.door}-${album.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--card))] p-6 sm:p-7 neo-illuminate transition-transform duration-300 hover:-translate-y-0.5 hover:border-[rgba(199,168,106,0.55)]"
      style={{ ...style, minHeight: "320px" }}
    >
      {album.cover_image_url && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-[0.55] group-hover:opacity-[0.78] transition-opacity duration-500"
          style={{ backgroundImage: `url('${album.cover_image_url}')` }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[rgba(11,12,15,0.94)] via-[rgba(11,12,15,0.55)] to-[rgba(11,12,15,0.35)]"
      />
      <AtmosphereLayer grain wash={conf.wash} />
      <div className="relative z-10">
        <div
          className="flex items-center gap-2 mb-5"
          style={{ color: conf.accentColor }}
        >
          <StarMark size={10} />
          <span className="font-mono tracking-archival text-[10px]">
            {conf.accent}
          </span>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-[rgba(231,224,214,0.97)] leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
          {album.title}
        </h3>
        {album.subtitle && (
          <p className="mt-2 font-serif italic text-[rgba(231,224,214,0.78)] text-base">
            {album.subtitle}
          </p>
        )}
        <div className="mt-7 flex items-center justify-between">
          <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.6)]">
            {album.year || "—"}
          </span>
          <span className="flex items-center gap-1 font-mono tracking-archival text-[10px] text-[rgba(199,168,106,0.92)] group-hover:text-[rgba(199,168,106,1)]">
            Enter the room
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
      <div className="absolute right-5 top-5 text-[rgba(199,168,106,0.35)] group-hover:text-[rgba(199,168,106,0.75)] transition-colors">
        <CrescentGlyph size={36} withStar={false} />
      </div>
    </Link>
  );
};

export default ArchiveDoor;
