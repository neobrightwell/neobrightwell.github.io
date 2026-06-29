import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchPageContent, adminSavePage } from "@/api/client";
import { PAGE_SCHEMAS, defaultsForPage } from "./pageSchemas";
import { FieldInput } from "./AdminFormFields";

export default function AdminPageEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const schema = PAGE_SCHEMAS[slug];

  const defaults = useMemo(() => defaultsForPage(slug), [slug]);
  const [form, setForm] = useState(defaults);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPageContent(slug)
      .then((doc) => {
        if (cancelled) return;
        const merged = { ...defaults };
        const dbFields = doc?.fields || {};
        // DB values override defaults; missing keys fall back to default copy
        for (const k of Object.keys(merged)) {
          if (dbFields[k] !== undefined && dbFields[k] !== null) merged[k] = dbFields[k];
        }
        setForm(merged);
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [slug, defaults]);

  if (!schema) {
    return (
      <div className="max-w-[720px]">
        <p className="font-serif italic text-[rgba(231,224,214,0.7)]">
          Unknown page “{slug}”.
        </p>
        <Link to="/admin/pages" className="neo-link mt-4 inline-block">← Back to pages</Link>
      </div>
    );
  }

  const setField = (k, v) => setForm((cur) => ({ ...cur, [k]: v }));

  const onSave = async () => {
    setSaving(true);
    try {
      // Only persist non-default, non-empty values so the live page can
      // fall back to the in-code default later by clearing the field.
      const payload = {};
      for (const section of schema.sections) {
        for (const f of section.fields) {
          const v = form[f.name];
          if (v === null || v === undefined) continue;
          if (typeof v === "string" && v.trim() === "") continue;
          payload[f.name] = v;
        }
      }
      await adminSavePage(slug, payload);
      toast.success("Page copy saved.");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not save page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[920px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/pages"
            className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)] hover:text-[rgba(199,168,106,0.95)]"
          >
            ← back to pages
          </Link>
          <h1 className="mt-2 font-serif text-3xl text-[rgba(231,224,214,0.95)]">
            {schema.label}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/pages")}
            data-testid="admin-cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving || !loaded}
            data-testid="admin-save-button"
          >
            {saving ? "Saving\u2026" : "Save changes"}
          </Button>
        </div>
      </div>

      <p className="mb-8 font-serif italic text-sm text-[rgba(231,224,214,0.65)] leading-relaxed">
        Fields are pre-filled with the copy currently shown on the site.
        Clear a field to revert it to the hard-coded default.
      </p>

      <div className="space-y-8">
        {schema.sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-border/70 bg-[hsl(var(--card))] p-5"
          >
            <h2 className="font-serif text-xl text-[rgba(231,224,214,0.95)] mb-5">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.fields.map((f) => {
                const fullWidth = f.type === "longtext" || f.type === "textarea";
                return (
                  <label
                    key={f.name}
                    className={["flex flex-col gap-1.5", fullWidth ? "md:col-span-2" : ""].join(" ")}
                  >
                    <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.7)]">
                      {f.label}
                    </span>
                    <FieldInput
                      field={f}
                      value={form[f.name] ?? ""}
                      onChange={(v) => setField(f.name, v)}
                    />
                    {f.hint && (
                      <span className="font-mono text-[10px] text-[rgba(199,194,184,0.45)]">{f.hint}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
