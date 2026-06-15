
import React, { useEffect, useState } from "react";
import { adminListSubscribers } from "@/api/client";

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    adminListSubscribers()
      .then(setSubs)
      .catch((e) => setErr(e?.message || "failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const downloadCsv = () => {
    const header = "email,first_name,source,created_at,provider,provider_status\n";
    const rows = subs
      .map((s) =>
        [s.email, s.first_name || "", s.source || "", s.created_at, s.provider, s.provider_status || ""]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neoverse-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">The Invocation</h1>
          <p className="text-[rgba(231,224,214,0.7)] mt-1">Witnesses who left a light on.</p>
        </div>
        <button
          onClick={downloadCsv}
          disabled={subs.length === 0}
          className="rounded-md bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] px-4 py-2 font-mono tracking-archival text-[10.5px] hover:bg-[rgba(127,166,199,1)] disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>
      {loading && <p className="font-mono text-[11px] text-[rgba(199,194,184,0.6)]">Loading…</p>}
      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">{err}</p>}
      <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[rgba(231,224,214,0.04)]">
            <tr>
              <th className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">Email</th>
              <th className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">First name</th>
              <th className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">Source</th>
              <th className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">Provider</th>
              <th className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">Joined</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-t border-[rgba(199,194,184,0.1)]">
                <td className="p-3 text-[rgba(231,224,214,0.9)]">{s.email}</td>
                <td className="p-3 text-[rgba(231,224,214,0.78)]">{s.first_name || "—"}</td>
                <td className="p-3 text-[rgba(231,224,214,0.78)]">{s.source || "—"}</td>
                <td className="p-3 text-[rgba(231,224,214,0.78)]">{s.provider}</td>
                <td className="p-3 text-[rgba(231,224,214,0.78)] font-mono text-[11px]">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && subs.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-[rgba(231,224,214,0.55)] font-serif italic">No witnesses yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
