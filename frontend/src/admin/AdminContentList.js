import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SCHEMAS } from "./schemas";
import { ADMIN } from "@/constants/testIds";
import { Button } from "@/components/ui/button";

export default function AdminContentList() {
  const { resource } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[resource];
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

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

  return (
    <div>
      <ListHeader
        schema={schema}
        onCreate={() => navigate(`/admin/${resource}/new`)}
      />
      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)] mb-4">{err}</p>}
      <ListTable
        items={items}
        schema={schema}
        resource={resource}
        busy={busy}
        onRemove={remove}
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

function ListTable({ items, schema, resource, busy, onRemove }) {
  const colCount = schema.list_fields.length + 1;
  return (
    <div className="rounded-xl border border-border/70 bg-[hsl(var(--card))] overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-[rgba(231,224,214,0.04)]">
          <tr>
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
          {items?.map((item) => (
            <ListRow
              key={item.id}
              item={item}
              schema={schema}
              resource={resource}
              busy={busy}
              onRemove={() => onRemove(item)}
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

function ListRow({ item, schema, resource, busy, onRemove }) {
  return (
    <tr
      data-testid={ADMIN.list_item}
      className="border-t border-[rgba(199,194,184,0.1)] hover:bg-[rgba(231,224,214,0.02)]"
    >
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
