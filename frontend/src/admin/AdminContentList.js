import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SCHEMAS } from "./schemas";
import { ADMIN } from "@/constants/testIds";
import { Button } from "@/components/ui/button";
import { adminObservatoryReorder } from "@/api/client";
import { toast } from "sonner";

export default function AdminContentList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[resource];
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const reorderable = resource === "observatory";

  const load = (cancelledRef) => {
    if (!schema) return;
    setItems(null);
    schema.api
      .list({ status: "all" })
      .then((r) => { if (!cancelledRef?.cancelled) setItems(r); })
      .catch((e) => {
        if (cancelledRef?.cancelled) return;
        setErr(e?.message || "failed to load");
        setItems([]);
      });
  };

  useEffect(() => {
    const ref = { cancelled: false };
    load(ref);
    return () => { ref.cancelled = true; };
    // schema is derived from `resource` from URL params; intentionally re-running on resource changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  if (!schema) {
    return (
      <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">
        Unknown content type: {resource}
      </p>
    );
  }

  const remove = async (item) => {
    if (!window.confirm(`Remove “${item[schema.primary_field]}”? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await schema.api.remove(item.id);
      load();
    } catch (e) {
      setErr(e?.response?.data?.detail || "delete failed");
    } finally {
      setBusy(false);
    }
  };

  // Optimistic swap + persist. Only used when `reorderable` is true.
  const move = async (item, direction) => {
    if (!items?.length || busy) return;
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const next = items.slice();
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    setItems(next); // optimistic
    setBusy(true);
    try {
      await adminObservatoryReorder(next.map((x) => x.id));
    } catch (e) {
      // revert on failure
      setItems(items);
      toast.error(e?.response?.data?.detail || "Reorder failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <ListHeader
        schema={schema}
        onCreate={() => navigate(`/admin/${resource}/new`)}
      />
      {reorderable && (
        <p className="mb-4 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">
          Use the ↑ ↓ arrows to change display order on the public Observatory page.
        </p>
      )}
      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)] mb-4">{err}</p>}
      <ListTable
        items={items}
        schema={schema}
        resource={resource}
        busy={busy}
        onRemove={remove}
        reorderable={reorderable}
        onMove={move}
      />
    </div>
  );
}

function ListHeader({ schema, onCreate }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">
          collection
        </p>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">{schema.title}</h1>
      </div>
      <Button
        data-testid={ADMIN.list_create}
        onClick={onCreate}
        className="bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] hover:bg-[rgba(127,166,199,1)] font-mono tracking-archival text-[11px]"
      >
        + New {schema.singular}
      </Button>
    </div>
  );
}

function ListTable({ items, schema, resource, busy, onRemove, reorderable, onMove }) {
  const colCount = schema.list_fields.length + 1 + (reorderable ? 1 : 0);
  return (
    <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))] overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-[rgba(231,224,214,0.04)]">
          <tr>
            {reorderable && (
              <th className="w-[90px] p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">
                order
              </th>
            )}
            {schema.list_fields.map((f) => (
              <th
                key={f}
                className="text-left p-3 font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]"
              >
                {f}
              </th>
            ))}
            <th className="text-right p-3" />
          </tr>
        </thead>
        <tbody>
          {items === null && <EmptyRow colSpan={colCount} message="Loading…" />}
          {items?.length === 0 && (
            <EmptyRow colSpan={colCount} message="Nothing here yet. Tend the room." italic />
          )}
          {items?.map((item, idx) => (
            <ListRow
              key={item.id}
              item={item}
              schema={schema}
              resource={resource}
              busy={busy}
              onRemove={() => onRemove(item)}
              reorderable={reorderable}
              canMoveUp={idx > 0}
              canMoveDown={idx < (items.length - 1)}
              onMoveUp={() => onMove(item, "up")}
              onMoveDown={() => onMove(item, "down")}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow({ colSpan, message, italic }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={[
          "p-6 text-center",
          italic
            ? "p-8 font-serif italic text-[rgba(231,224,214,0.65)]"
            : "text-[rgba(199,194,184,0.55)] font-mono text-[11px]",
        ].join(" ")}
      >
        {message}
      </td>
    </tr>
  );
}

function ListRow({ item, schema, resource, busy, onRemove, reorderable, canMoveUp, canMoveDown, onMoveUp, onMoveDown }) {
  return (
    <tr
      data-testid={ADMIN.list_item}
      className="border-t border-[rgba(199,194,184,0.1)] hover:bg-[rgba(231,224,214,0.02)]"
    >
      {reorderable && (
        <td className="p-2 align-middle">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={busy || !canMoveUp}
              data-testid={`admin-observatory-move-up-${item.id}`}
              aria-label={`Move ${item[schema.primary_field] || "item"} up`}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-[rgba(199,194,184,0.18)] text-[rgba(231,224,214,0.85)] hover:bg-[rgba(231,224,214,0.04)] hover:text-[rgba(199,168,106,0.95)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={busy || !canMoveDown}
              data-testid={`admin-observatory-move-down-${item.id}`}
              aria-label={`Move ${item[schema.primary_field] || "item"} down`}
              className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-[rgba(199,194,184,0.18)] text-[rgba(231,224,214,0.85)] hover:bg-[rgba(231,224,214,0.04)] hover:text-[rgba(199,168,106,0.95)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowDown size={14} />
            </button>
          </div>
        </td>
      )}
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
          onClick={onRemove}
          disabled={busy}
          data-testid={ADMIN.list_delete}
          className="font-mono tracking-archival text-[10.5px] text-[rgba(209,75,75,0.85)] hover:text-[rgba(209,75,75,1)]"
        >
          remove
        </button>
      </td>
    </tr>
  );
}
