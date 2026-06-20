import React, { useEffect, useState } from "react";
import { adminListSubscribers } from "@/api/client";

function toCsv(subs) {
  const header = "email,first_name,source,created_at,provider,provider_status\n";
  const escape = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const rows = subs
    .map((s) =>
      [s.email, s.first_name || "", s.source || "", s.created_at, s.provider, s.provider_status || ""]
        .map(escape)
        .join(",")
    )
    .join("\n");
  return header + rows;
}

function downloadBlob(content, filename, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SubscribersHeader({ count, onExport }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">The Invocation</h1>
        <p className="text-[rgba(231,224,214,0.7)] mt-1">Witnesses who left a light on.</p>
      </div>
      <button
        onClick={onExport}
        disabled={count === 0}
        className="rounded-md bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] px-4 py-2 font-mono tracking-archival text-[10.5px] hover:bg-[rgba(127,166,199,1)] disabled:opacity-40"
      >
        Export CSV
      </button>
    </div>
  );
}

const COLUMNS = [
  { key: "email", label: "Email" },
  { key: "first_name", label: "First name" },
  { key: "source", label: "Source" },
  { key: "provider", label: "Provider" },
  { key: "created_at", label: "Joined", mono: true },
];

function SubscribersTable({ subs, loading }) {
  return (
    <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))] overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead className="bg-[rgba(231,224,214,0.04)]">
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <SubscriberRow key={s.id} sub={s} />
          ))}
          {!loading && subs.length === 0 && (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="p-6 text-center text-[rgba(231,224,214,0.55)] font-serif italic"
              >
                No witnesses yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SubscriberRow({ sub }) {
  return (
    <tr className="border-t border-[rgba(199,194,184,0.1)]">
      <td className="p-3 text-[rgba(231,224,214,0.9)]">{sub.email}</td>
      <td className="p-3 text-[rgba(231,224,214,0.78)]">{sub.first_name || "—"}</td>
      <td className="p-3 text-[rgba(231,224,214,0.78)]">{sub.source || "—"}</td>
      <td className="p-3 text-[rgba(231,224,214,0.78)]">{sub.provider}</td>
      <td className="p-3 text-[rgba(231,224,214,0.78)] font-mono text-[11px]">
        {new Date(sub.created_at).toLocaleString()}
      </td>
    </tr>
  );
}

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    adminListSubscribers()
      .then((data) => { if (!cancelled) setSubs(data); })
      .catch((e) => { if (!cancelled) setErr(e?.message || "failed to load"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const onExport = () => {
    const filename = `neoverse-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadBlob(toCsv(subs), filename);
  };

  return (
    <div>
      <SubscribersHeader count={subs.length} onExport={onExport} />
      {loading && (
        <p className="font-mono text-[11px] text-[rgba(199,194,184,0.6)]">Loading…</p>
      )}
      {err && (
        <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">{err}</p>
      )}
      <SubscribersTable subs={subs} loading={loading} />
    </div>
  );
}
