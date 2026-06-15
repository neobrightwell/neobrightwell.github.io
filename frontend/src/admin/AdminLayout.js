import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import { ADMIN } from "@/constants/testIds";
import { CrescentGlyph } from "@/components/neoverse/Glyphs";

const NAV = [
  { to: "/admin", end: true, label: "Dashboard" },
  { to: "/admin/albums", label: "Albums", testid: ADMIN.nav_albums },
  { to: "/admin/library", label: "Library", testid: ADMIN.nav_library },
  { to: "/admin/symbols", label: "Symbols", testid: ADMIN.nav_symbols },
  { to: "/admin/roadhouse", label: "Roadhouse", testid: ADMIN.nav_roadhouse },
  { to: "/admin/observatory", label: "Observatory", testid: ADMIN.nav_observatory },
  { to: "/admin/subscribers", label: "Subscribers", testid: ADMIN.nav_subscribers },
];

const linkClass = ({ isActive }) =>
  [
    "block rounded-md px-3 py-2 font-mono tracking-archival text-[11px] transition-colors",
    isActive
      ? "bg-[rgba(127,166,199,0.12)] text-[rgba(231,224,214,0.95)] border border-[rgba(127,166,199,0.3)]"
      : "text-[rgba(199,194,184,0.7)] hover:bg-[rgba(231,224,214,0.04)] hover:text-[rgba(231,224,214,0.95)]",
  ].join(" ");

export default function AdminLayout() {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div data-testid={ADMIN.shell} className="min-h-screen bg-[hsl(var(--background))]">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-3 shrink-0">
            <span className="text-[rgba(199,168,106,0.95)]"><CrescentGlyph size={22} /></span>
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-lg text-[rgba(231,224,214,0.95)]">Archive Keeper</span>
              <span className="font-mono tracking-archival text-[9.5px] text-[rgba(199,194,184,0.5)]">
                The Neoverse — admin
              </span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] hover:text-[rgba(199,168,106,0.95)]"
            >
              view site →
            </button>
            <button
              onClick={logout}
              data-testid={ADMIN.logout}
              className="rounded-md border border-[rgba(199,194,184,0.2)] px-3 py-1.5 font-mono tracking-archival text-[10.5px] text-[rgba(231,224,214,0.85)] hover:bg-[rgba(231,224,214,0.04)]"
            >
              sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <nav className="space-y-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testid} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <main className="min-w-0">
          <Outlet context={{ admin }} />
        </main>
      </div>
    </div>
  );
}
