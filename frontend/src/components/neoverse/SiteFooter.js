import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { BrandMark } from "./BrandMark";
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

const coordinates = () => "34.0522° N, 118.2437° W";

// --- X (formerly Twitter) icon ---
const XIcon = ({ size = 18, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M18.244 2H21l-6.55 7.49L22 22h-6.812l-4.78-6.243L4.8 22H2l7.02-8.025L2 2h6.914l4.32 5.71L18.244 2zm-1.193 18h1.876L7.05 4H5.085l11.966 16z" />
  </svg>
);

// --- TikTok icon ---
const TikTokIcon = ({ size = 18, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.81 4.81 0 0 1-1.84-.07z" />
  </svg>
);

const TRANSMISSIONS = [
  { href: "https://neobrightwell.substack.com", label: "Notes from the Neoverse" },
  { href: "https://neobrightwell.bandcamp.com", label: "The Record Room" },
  { href: "https://elasticstage.com/neoverse", label: "The Reliquary" },
  { href: "https://temple.groover.co/neobrightwell/the-doorway", label: "The Press Room" },
];

const SIGNALS = [
  { href: "https://facebook.com/neobrightwell",  label: "Facebook",  Icon: Facebook },
  { href: "https://instagram.com/neobrightwell", label: "Instagram", Icon: Instagram },
  { href: "https://x.com/neobrightwell",         label: "X",         Icon: XIcon },
  { href: "https://tiktok.com/@neobrightwell",   label: "TikTok",    Icon: TikTokIcon },
  { href: "https://youtube.com/@neobrightwell",  label: "YouTube",   Icon: Youtube },
];

const WANDER = [
  { to: "/archive",      label: "The Archive" },
  { to: "/library",      label: "The Library" },
  { to: "/symbols",      label: "The Symbols" },
  { to: "/roadhouse",    label: "The Roadhouse" },
  { to: "/observatory",  label: "The Observatory" },
];

const SECTION_LABEL =
  "font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.6)] mb-3";

const LINK_BASE =
  "transition-colors hover:text-[rgba(199,168,106,0.95)] text-[rgba(231,224,214,0.78)]";

export const SiteFooter = () => {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-12">
        {/* Invocation */}
        <div className="md:col-span-6">
          <div className="flex items-center gap-3 mb-4">
            <BrandMark size={28} />
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

        {/* Wander */}
        <nav className="md:col-span-2" aria-label="Site navigation">
          <p className={SECTION_LABEL}>Wander</p>
          <ul className="space-y-2">
            {WANDER.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={LINK_BASE}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Transmissions */}
        <nav className="md:col-span-2" aria-label="Transmissions">
          <p className={SECTION_LABEL}>Transmissions</p>
          <ul className="space-y-2">
            {TRANSMISSIONS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_BASE}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Signals */}
        <div className="md:col-span-2">
          <p className={SECTION_LABEL}>Signals</p>
          <ul className="flex flex-wrap gap-3 items-center">
            {SIGNALS.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgba(199,194,184,0.18)] text-[rgba(199,194,184,0.7)] hover:text-[rgba(199,168,106,0.98)] hover:border-[rgba(199,168,106,0.55)] hover:bg-[rgba(199,168,106,0.06)] transition-colors"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom strip: © + colophon fragments + keeper link */}
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.5)]">
            © Neo Brightwell. Moonshine Disco. Outlaw soul for people who survived.
          </p>
          <p className="font-mono text-[10px] text-[rgba(199,194,184,0.45)] tracking-archival">
            FREQ {dailyFrequency()} · COORD {coordinates()} · ACCESSION NB-
            {new Date().getUTCFullYear()}-001
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
