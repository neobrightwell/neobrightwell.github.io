import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SCHEMAS, DEFAULTS_FOR } from "./schemas";
import { ADMIN } from "@/constants/testIds";
import { Button } from "@/components/ui/button";
import { FieldInput, ListField } from "./AdminFormFields";

const slugify = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    schema.api
      .list({ status: "all" })
      .then((items) => {
        if (cancelled) return;
        const found = items.find((i) => i.id === id);
        if (found) setForm({ ...defaults, ...found });
        else setErr("Not found");
      })
      .catch((e) => {
        if (!cancelled) setErr(e?.message || "failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, resource, isNew, schema, defaults]);

  if (!schema) {
    return (
      <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">
        Unknown resource
      </p>
    );
  }
  if (loading) {
    return (
      <p className="font-mono text-[11px] text-[rgba(199,194,184,0.6)]">Loading…</p>
    );
  }

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const buildPayload = () => {
    const payload = { ...form };
    payload.slug = slugify(payload.slug || payload[schema.primary_field] || "untitled");
    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = buildPayload();
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
      <FormHeader
        resource={resource}
        schema={schema}
        isNew={isNew}
        title={form[schema.primary_field] || schema.singular}
        saving={saving}
        onCancel={() => navigate(`/admin/${resource}`)}
      />

      {err && <p className="font-mono text-[11px] text-[rgba(209,75,75,0.95)]">{err}</p>}

      {schema.sections.map((section) => (
        <FormSection key={section.title} section={section} form={form} setField={setField} />
      ))}
    </form>
  );
}

/* ----- small presentational helpers — keep the orchestrator above tiny ----- */

function FormHeader({ resource, schema, isNew, title, saving, onCancel }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <Link
          to={`/admin/${resource}`}
          className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(127,166,199,0.95)]"
        >
          ← back to {schema.title}
        </Link>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)] mt-1">
          {isNew ? `New ${schema.singular}` : title}
        </h1>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          data-testid={ADMIN.form_cancel}
          onClick={onCancel}
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
  );
}

function FormSection({ section, form, setField }) {
  return (
    <section className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5">
      <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)] mb-4">
        {section.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {section.fields.map((f) => (
          <FormFieldRow
            key={f.name}
            field={f}
            value={form[f.name]}
            onChange={(v) => setField(f.name, v)}
          />
        ))}
      </div>
    </section>
  );
}

function FormFieldRow({ field, value, onChange }) {
  const fullWidth = field.type === "longtext" || field.type === "list";
  return (
    <label className={["flex flex-col gap-1.5", fullWidth ? "md:col-span-2" : ""].join(" ")}>
      <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">
        {field.label}
        {field.required && <span className="text-[rgba(209,75,75,0.85)]"> *</span>}
      </span>
      {field.type === "list" ? (
        <ListField field={field} value={value} onChange={onChange} />
      ) : (
        <FieldInput field={field} value={value} onChange={onChange} />
      )}
      {field.hint && (
        <span className="font-mono text-[10px] text-[rgba(199,194,184,0.45)]">{field.hint}</span>
      )}
    </label>
  );
}
