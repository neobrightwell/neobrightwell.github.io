import React from "react";
import { Link } from "react-router-dom";
import { CrescentGlyph } from "./Glyphs";
import { InvocationForm } from "./InvocationForm";

// Deterministic daily 'frequency' — a small hidden detail in the colophon.
const dailyFrequency = () => {
  const today = new Date();
  const seed =
    today.getUTCFullYear() * 372 +
    (today.getUTCMonth() + 1) * 31 +
    today.getUTCDate();
  const mhz = 88 + ((seed * 17) % 220) / 10; // 88.0 – 110.0
  return mhz.toFixed(1) + " FM";
};

const coordinates = () => {
  // A made-up but stable coordinate string (no real place implied).
  return "34.0522° N, 118.2437° W";
};

export const SiteFooter = () => {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-14 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[rgba(199,168,106,0.85)]">
              <CrescentGlyph size={22} />
            </span>
            <span className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)]">
              The Invocation
            </span>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-[rgba(231,224,214,0.92)] leading-[1.15] mb-2">
            Leave a light on in the archive.
          </p>
          <p className="text-[rgba(231,224,214,0.72)] leading-relaxed max-w-[44ch] mb-6">
            Receive transmissions from the road — new music, poems, artwork, and
            dispatches from the Neoverse.
          </p>
          <InvocationForm source="footer" compact />
        </div>

        <div className="md:col-span-3">
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-3">
            Wander
          </p>
          <ul className="space-y-2 text-[rgba(231,224,214,0.78)]">
            <li><Link to="/archive" className="hover:text-[rgba(199,168,106,0.95)]">The Archive</Link></li>
            <li><Link to="/library" className="hover:text-[rgba(199,168,106,0.95)]">The Library</Link></li>
            <li><Link to="/symbols" className="hover:text-[rgba(199,168,106,0.95)]">The Symbols</Link></li>
            <li><Link to="/roadhouse" className="hover:text-[rgba(199,168,106,0.95)]">The Roadhouse</Link></li>
            <li><Link to="/observatory" className="hover:text-[rgba(199,168,106,0.95)]">The Observatory</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-3">
            Colophon — recovered fragments
          </p>
          <p className="font-mono text-[11px] text-[rgba(199,194,184,0.75)]">
            FREQ — {dailyFrequency()}
          </p>
          <p className="font-mono text-[11px] text-[rgba(199,194,184,0.75)]">
            COORD — {coordinates()}
          </p>
          <p className="font-mono text-[11px] text-[rgba(199,194,184,0.5)] mt-2">
            ACCESSION — NB-{new Date().getUTCFullYear()}-001
          </p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.5)]">
            © Neo Brightwell. Moonshine Disco. Outlaw soul for people who survived.
          </p>
          <Link
            to="/admin"
            className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.35)] hover:text-[rgba(199,168,106,0.8)]"
          >
            • archive keeper
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
