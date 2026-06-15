
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SCHEMAS, DEFAULTS_FOR } from "./schemas";
import { ADMIN } from "@/constants/testIds";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

const slugify = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function FieldInput({ field, value, onChange }) {
  const common = "bg-[rgba(20,22,27,0.6)] border-[rgba(199,194,184,0.18)]";
  if (field.type === "longtext") {
    return (
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className={common}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={common}
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(parseInt(e.target.value || "0", 10) || 0)}
        className={common}
      />
    );
  }
  if (field.type === "select") {
    return (
      <Select value={value || field.options?.[0]?.value} onValueChange={onChange}>
        <SelectTrigger className={common}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (field.type === "tags") {
    const csv = Array.isArray(value) ? value.join(", ") : "";
    return (
      <Input
        value={csv}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        placeholder={field.hint || "comma-separated"}
        className={common}
      />
    );
  }
  if (field.type === "image") {
    return (
      <div className="space-y-2">
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or data:image/…"
          className={common}
        />
        {value && (
          <div className="max-w-[220px] rounded-md border border-[rgba(199,194,184,0.18)] overflow-hidden">
            <img src={value} alt="" className="w-full h-auto" />
          </div>
        )}
      </div>
    );
  }
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={common}
    />
  );
}

function ListField({ field, value = [], onChange }) {
  const addItem = () => {
    const item = {};
    for (const f of field.item_fields) {
      if (f.type === "number") item[f.name] = 0;
      else item[f.name] = "";
    }
    onChange([...(value || []), item]);
  };
  const update = (idx, key, v) => {
    const next = [...value];
    next[idx] = { ...next[idx], [key]: v };
    onChange(next);
  };
  const remove = (idx) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {(value || []).map((item, idx) => (
        <div key={idx} className="rounded-md border border-[rgba(199,194,184,0.18)] p-3 bg-[rgba(20,22,27,0.45)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">#{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-[rgba(209,75,75,0.85)] hover:text-[rgba(209,75,75,1)]" aria-label="Remove">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.item_fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1 text-sm">
                <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">{f.label}</span>
                <FieldInput field={f} value={item[f.name]} onChange={(v) => update(idx, f.name, v)} />
                {f.hint && <span className="font-mono text-[9.5px] text-[rgba(199,194,184,0.4)]">{f.hint}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addItem} className="border-[rgba(199,194,184,0.2)] text-[rgba(231,224,214,0.85)] hover:bg-[rgba(231,224,214,0.04)] font-mono tracking-archival text-[10.5px]">
        <Plus size={14} className="mr-1" /> Add item
      </Button>
    </div>
  );
}

export default function AdminContentEdit() {
  const { resource, id } = useParams();
  const navigate = useNavigate();
  const schema = SCHEMAS[resource];
  const defaults = useMemo(() => DEFAULTS_FOR(resource), [resource]);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(id !== "new");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const isNew = id === "new";

  useEffect(() => {
    if (!schema) return;
    if (isNew) {
      setForm(defaults);
      return;
    }
    setLoading(true);
    schema.api
      .list({ status: "all" })
      .then((items) => {
        const found = items.find((i) => i.id === id);
        if (found) setForm({ ...defaults, ...found });
        else setErr("Not found");
      })
      .catch((e) => setErr(e?.message || "failed to load"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, resource]);

  if (!schema) return <p>Unknown resource</p>;
  if (loading) return <p className="font-mono text-[11px] text-[rgba(199,194,184,0.6)]">Loading…</p>;

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = { ...form };
      // auto-slug if empty
      if (!payload.slug) {
        payload.slug = slugify(payload[schema.primary_field] || "untitled");
      } else {
        payload.slug = slugify(payload.slug);
      }
      if (isNew) {
        const created = await schema.api.create(payload);
        navigate(`/admin/${resource}/${created.id}`);
      } else {
        await schema.api.update(id, payload);
      }
    } catch (e2) {
      const detail = e2?.response?.data?.detail || e2?.message || "save failed";
      setErr(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} data-testid={ADMIN.form} className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to={`/admin/${resource}`} className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(127,166,199,0.95)]">
            ← back to {schema.title}
          </Link>
          <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mt-1">
            {isNew ? `New ${schema.singular}` : form[schema.primary_field] || schema.singular}
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            data-testid={ADMIN.form_cancel}
            onClick={() => navigate(`/admin/${resource}`)}
            className="border-[rgba(199,194,184,0.2)] text-[rgba(231,224,214,0.85)] font-mono tracking-archival text-[10.5px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-testid={ADMIN.form_save}
            disabled={saving}
            className="bg-[rgba(127,166,199,0.95)] text-[#0B0C0F] hover:bg-[rgba(127,166,199,1)] font-mono tracking-archival text-[10.5px]"
          >
            {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
          </Button>
        </div>
      </div>

      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">{err}</p>}

      {schema.sections.map((section) => (
        <section key={section.title} className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5">
          <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)] mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {section.fields.map((f) => (
              <label
                key={f.name}
                className={[
                  "flex flex-col gap-1.5",
                  f.type === "longtext" || f.type === "list" ? "md:col-span-2" : "",
                ].join(" ")}
              >
                <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">
                  {f.label}
                  {f.required && <span className="text-[rgba(209,75,75,0.85)]"> *</span>}
                </span>
                {f.type === "list" ? (
                  <ListField field={f} value={form[f.name]} onChange={(v) => setField(f.name, v)} />
                ) : (
                  <FieldInput field={f} value={form[f.name]} onChange={(v) => setField(f.name, v)} />
                )}
                {f.hint && <span className="font-mono text-[10px] text-[rgba(199,194,184,0.45)]">{f.hint}</span>}
              </label>
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}
