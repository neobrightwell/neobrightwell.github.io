
import React, { useEffect, useState } from "react";
import {
  fetchAlbums,
  fetchLibrary,
  fetchSymbols,
  fetchRoadhouse,
  fetchObservatory,
  adminListSubscribers,
} from "@/api/client";
import { Link } from "react-router-dom";

const Stat = ({ label, value, to }) => (
  <Link
    to={to}
    className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5 hover:border-[rgba(127,166,199,0.4)] transition-colors"
  >
    <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.6)] mb-2">{label}</p>
    <p className="font-serif text-4xl text-[rgba(231,224,214,0.95)]">{value ?? "—"}</p>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  // Single fetch on mount — all fetch fns are stable module imports.
  useEffect(() => {
    let cancelled = false;
    const safe = (p) => p.then((r) => r.length).catch(() => 0);
    Promise.all([
      safe(fetchAlbums()),
      safe(fetchLibrary({ status: "all" })),
      safe(fetchSymbols()),
      safe(fetchRoadhouse({ status: "all" })),
      safe(fetchObservatory()),
      safe(adminListSubscribers()),
    ]).then(([albums, library, symbols, roadhouse, observatory, subs]) => {
      if (cancelled) return;
      setStats({ albums, library, symbols, roadhouse, observatory, subs });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-[rgba(231,224,214,0.95)] mb-2">Keeper’s desk.</h1>
      <p className="text-[rgba(231,224,214,0.7)] mb-8">
        Tend the archive. Every entry is a room in the living mythology.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Albums" value={stats.albums} to="/admin/albums" />
        <Stat label="Library entries" value={stats.library} to="/admin/library" />
        <Stat label="Symbols" value={stats.symbols} to="/admin/symbols" />
        <Stat label="Roadhouse posts" value={stats.roadhouse} to="/admin/roadhouse" />
        <Stat label="Visual art" value={stats.observatory} to="/admin/observatory" />
        <Stat label="Subscribers" value={stats.subs} to="/admin/subscribers" />
      </div>
    </div>
  );
}
