/* Admin form primitives — extracted from AdminContentEdit to keep that file
 * focused on orchestration and to reduce cyclomatic complexity. */
import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdminImageField } from "./AdminImageField";

const INPUT_CLASS = "bg-[rgba(20,22,27,0.6)] border-[rgba(199,194,184,0.18)]";

const makeKey = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `k_${Math.random().toString(36).slice(2)}_${Date.now()}`;

/* Field renderers — one per `type`. Keeps FieldInput tiny and removes
 * the deeply-nested switch that made it complex. */
const RENDERERS = {
  longtext: ({ value, onChange }) => (
    <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={8} className={INPUT_CLASS} />
  ),
  textarea: ({ value, onChange }) => (
    <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} className={INPUT_CLASS} />
  ),
  number: ({ value, onChange }) => (
    <Input
      type="number"
      value={value ?? 0}
      onChange={(e) => onChange(parseInt(e.target.value || "0", 10) || 0)}
      className={INPUT_CLASS}
    />
  ),
  // Nullable decimal field used for constellation coordinates (0-100%).
  // Empty input maps to null so the public page can fall back to the
  // default layout map; any typed value (including 0) is saved as a float.
  position: ({ field, value, onChange }) => (
    <Input
      type="number"
      step="0.1"
      min="0"
      max="100"
      value={value === null || value === undefined ? "" : value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "") return onChange(null);
        const n = parseFloat(v);
        onChange(Number.isFinite(n) ? n : null);
      }}
      placeholder={field?.hint?.includes("0") ? "0 – 100" : ""}
      className={INPUT_CLASS}
    />
  ),
  select: ({ field, value, onChange }) => (
    <Select value={value || field.options?.[0]?.value} onValueChange={onChange}>
      <SelectTrigger className={INPUT_CLASS}><SelectValue /></SelectTrigger>
      <SelectContent>
        {field.options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  tags: ({ field, value, onChange }) => {
    const csv = Array.isArray(value) ? value.join(", ") : "";
    return (
      <Input
        value={csv}
        onChange={(e) =>
          onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
        }
        placeholder={field.hint || "comma-separated"}
        className={INPUT_CLASS}
      />
    );
  },
  image: ({ field, value, onChange }) => (
    <AdminImageField value={value} onChange={onChange} hint={field.hint} />
  ),
  text: ({ value, onChange }) => (
    <Input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} className={INPUT_CLASS} />
  ),
};

export function FieldInput({ field, value, onChange }) {
  const Renderer = RENDERERS[field.type] || RENDERERS.text;
  return <Renderer field={field} value={value} onChange={onChange} />;
}

/* Generates a stable per-item key. Used internally by ListField so React
 * doesn't re-mount form rows when the list reorders / items are removed. */
function ensureKeys(items, itemFields) {
  return (items || []).map((item) => (item._key ? item : { ...item, _key: makeKey() }));
}

function blankItem(itemFields) {
  const out = { _key: makeKey() };
  for (const f of itemFields) {
    out[f.name] = f.type === "number" ? 0 : "";
  }
  return out;
}

export function ListField({ field, value = [], onChange }) {
  // Strip _key on the way out to the API — it's a UI-only concern.
  const stripKeys = (items) => items.map(({ _key, ...rest }) => rest);
  const items = ensureKeys(value, field.item_fields);

  const addItem = () => onChange(stripKeys([...items, blankItem(field.item_fields)]));
  const update = (idx, key, v) => {
    const next = items.slice();
    next[idx] = { ...next[idx], [key]: v };
    onChange(stripKeys(next));
  };
  const remove = (idx) => {
    const next = items.slice();
    next.splice(idx, 1);
    onChange(stripKeys(next));
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={item._key}
          className="rounded-md border border-[rgba(199,194,184,0.18)] p-3 bg-[rgba(20,22,27,0.45)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">
              #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-[rgba(209,75,75,0.85)] hover:text-[rgba(209,75,75,1)]"
              aria-label="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.item_fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1 text-sm">
                <span className="font-mono tracking-archival text-[10px] text-[rgba(199,194,184,0.55)]">
                  {f.label}
                </span>
                <FieldInput
                  field={f}
                  value={item[f.name]}
                  onChange={(v) => update(idx, f.name, v)}
                />
                {f.hint && (
                  <span className="font-mono text-[9.5px] text-[rgba(199,194,184,0.4)]">{f.hint}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="border-[rgba(199,194,184,0.2)] text-[rgba(231,224,214,0.85)] hover:bg-[rgba(231,224,214,0.04)] font-mono tracking-archival text-[10.5px]"
      >
        <Plus size={14} className="mr-1" /> Add item
      </Button>
    </div>
  );
}
