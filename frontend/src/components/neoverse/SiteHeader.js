import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV } from "@/constants/testIds";
import { CrescentGlyph } from "./Glyphs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { to: "/archive", label: "The Archive", testid: NAV.link_archive },
  { to: "/library", label: "The Library", testid: NAV.link_library },
  { to: "/symbols", label: "The Symbols", testid: NAV.link_symbols },
  { to: "/roadhouse", label: "The Roadhouse", testid: NAV.link_roadhouse },
  { to: "/observatory", label: "The Observatory", testid: NAV.link_observatory },
];

const linkClass = ({ isActive }) =>
  [
    "font-mono tracking-archival text-[11px] transition-colors",
    isActive
      ? "text-[rgba(231,224,214,0.98)]"
      : "text-[rgba(231,224,214,0.55)] hover:text-[rgba(231,224,214,0.92)]",
  ].join(" ");

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <header
      data-testid={NAV.root}
      className="sticky top-0 z-30 border-b border-border/60 backdrop-blur-md bg-[hsl(var(--background))]/85"
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 py-4 flex items-center gap-6">
        <Link
          to="/"
          data-testid={NAV.brand}
          className="flex items-center gap-3 group shrink-0"
        >
          <span className="text-[rgba(199,168,106,0.92)] group-hover:text-[rgba(199,168,106,1)] transition-colors">
            <CrescentGlyph size={26} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[20px] tracking-tight text-[rgba(231,224,214,0.95)]">
              Neo Brightwell
            </span>
            <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.52)]">
              The Neoverse
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 mx-auto" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={item.testid}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/invocation"
          data-testid={NAV.link_invocation}
          className="hidden md:inline-flex items-center gap-2 rounded-md border border-[rgba(199,168,106,0.45)] px-3.5 py-1.5 font-mono tracking-archival text-[10.5px] text-[rgba(231,224,214,0.92)] hover:bg-[rgba(199,168,106,0.08)] transition-colors"
        >
          The Invocation
        </Link>

        {/* Mobile */}
        <div className="ml-auto md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                data-testid={NAV.mobile_open}
                aria-label="Open menu"
                className="p-2 text-[rgba(231,224,214,0.85)]"
              >
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[hsl(var(--background))] border-l border-border/70 w-[78vw] max-w-[340px]">
              <div className="mt-2 mb-6">
                <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] mb-2">
                  From the archive
                </p>
                <p className="font-serif italic text-lg text-[rgba(231,224,214,0.85)]">
                  Some stories survive the fire.
                </p>
              </div>
              <nav className="flex flex-col gap-5" aria-label="Mobile">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-serif text-2xl text-[rgba(231,224,214,0.92)] hover:text-[rgba(199,168,106,0.95)] transition-colors"
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/invocation"
                  onClick={() => setOpen(false)}
                  className="mt-4 font-mono tracking-archival text-[11px] text-[rgba(199,168,106,0.95)]"
                >
                  The Invocation →
                </NavLink>
                <button
                  onClick={() => setOpen(false)}
                  data-testid={NAV.mobile_close}
                  className="sr-only"
                  aria-label="Close menu"
                >
                  <X />
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
