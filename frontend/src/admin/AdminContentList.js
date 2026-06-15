
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SCHEMAS } from "./schemas";
import { ADMIN } from "@/constants/testIds";
import { Button } from "@/components/ui/button";

const slugify = (s) =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminContentList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[resource];
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const reload = () => {
    if (!schema) return;
    setItems(null);
    schema.api
      .list({ status: "all" })
      .then(setItems)
      .catch((e) => {
        setErr(e?.message || "failed to load");
        setItems([]);
      });
  };

  useEffect(() => {
    if (!schema) return;
    let cancelled = false;
    setItems(null);
    schema.api
      .list({ status: "all" })
      .then((r) => { if (!cancelled) setItems(r); })
      .catch((e) => {
        if (cancelled) return;
        setErr(e?.message || "failed to load");
        setItems([]);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  if (!schema) {
    return <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">Unknown content type: {resource}</p>;
  }

  const remove = async (item) => {
    if (!window.confirm(`Remove “${item[schema.primary_field]}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await schema.api.remove(item.id);
      reload();
    } catch (e) {
      setErr(e?.response?.data?.detail || "delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">collection</p>
          <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">{schema.title}</h1>
        </div>
        <Button
          data-testid={ADMIN.list_create}
          onClick={() => navigate(`/admin/${resource}/new`)}
          className="bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] hover:bg-[rgba(127,166,199,1)] font-mono tracking-archival text-[11px]"
        >
          + New {schema.singular}
        </Button>
      </div>
      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)] mb-4">{err}</p>}
      <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[rgba(231,224,214,0.04)]">
            <tr>
              {schema.list_fields.map((f) => (
                <th key={f} className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">
                  {f}
                </th>
              ))}
              <th className="text-right p-3" />
            </tr>
          </thead>
          <tbody>
            {items === null && (
              <tr><td colSpan={schema.list_fields.length + 1} className="p-6 text-center text-[rgba(199,194,184,0.55)] font-mono text-[11px]">Loading…</td></tr>
            )}
            {items?.length === 0 && (
              <tr><td colSpan={schema.list_fields.length + 1} className="p-8 text-center font-serif italic text-[rgba(231,224,214,0.65)]">Nothing here yet. Tend the room.</td></tr>
            )}
            {items?.map((item) => (
              <tr key={item.id} data-testid={ADMIN.list_item} className="border-t border-[rgba(199,194,184,0.1)] hover:bg-[rgba(231,224,214,0.02)]">
                {schema.list_fields.map((f) => (
                  <td key={f} className="p-3 text-[rgba(231,224,214,0.85)]">
                    {Array.isArray(item[f]) ? item[f].join(", ") : String(item[f] ?? "—")}
                  </td>
                ))}
                <td className="p-3 text-right space-x-2">
                  <Link
                    to={`/admin/${resource}/${item.id}`}
                    data-testid={ADMIN.list_edit}
                    className="font-mono tracking-archival text-[10.5px] text-[rgba(127,166,199,0.95)] hover:text-[rgba(127,166,199,1)]"
                  >
                    edit
                  </Link>
                  <button
                    onClick={() => remove(item)}
                    disabled={busy}
                    data-testid={ADMIN.list_delete}
                    className="font-mono tracking-archival text-[10.5px] text-[rgba(209,75,75,0.85)] hover:text-[rgba(209,75,75,1)]"
                  >
                    remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[10px] text-[rgba(199,194,184,0.45)]">tip: slugify with {`{`}{slugify("Example Title")}{`}`} — admin auto-generates slug from title if left blank.</p>
    </div>
  );
}
