/* Image upload field for the admin form.
 *
 * Two ways to supply an image:
 *   1) Paste a URL (https://… or /uploads/…)
 *   2) Click "Choose file" — the browser resizes + compresses + base64-encodes
 *      it client-side, then drops the resulting data: URI into the same field.
 *
 * Either way, the value stored in Mongo is whatever ends up in the text input.
 */
import React, { useRef, useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fileToDataUri,
  prettyBytes,
  DEFAULT_MAX_DIM,
  MAX_OUTPUT_BYTES_WARN,
} from "@/lib/image";

const INPUT_CLASS =
  "bg-[rgba(20,22,27,0.6)] border-[rgba(199,194,184,0.18)]";

export function AdminImageField({ value, onChange, hint, maxDim = DEFAULT_MAX_DIM }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const pick = () => fileRef.current?.click();
  const clear = () => {
    onChange("");
    setInfo(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fileToDataUri(file, { maxDim });
      onChange(res.dataUri);
      setInfo({
        name: res.name,
        size: res.outBytes,
        dims: `${res.width}×${res.height}`,
        mime: res.outMime,
      });
    } catch (err) {
      setError(err?.message || "Could not process that image.");
    } finally {
      setBusy(false);
    }
  };

  const isDataUri = typeof value === "string" && value.startsWith("data:");
  const showPreview = !!value;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-stretch">
        <Input
          type="text"
          value={isDataUri ? "" : (value || "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isDataUri ? "embedded image — clear to paste a URL" : "https://… or /uploads/…"}
          disabled={isDataUri || busy}
          className={`${INPUT_CLASS} flex-1`}
        />
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(199,168,106,0.45)] bg-[rgba(199,168,106,0.08)] px-3 py-1.5 font-mono tracking-archival text-[10.5px] text-[rgba(231,224,214,0.92)] hover:bg-[rgba(199,168,106,0.16)] disabled:opacity-40"
        >
          {busy ? (
            <>
              <ImagePlus size={14} className="animate-pulse" />
              processing…
            </>
          ) : (
            <>
              <Upload size={14} />
              choose file
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={clear}
            disabled={busy}
            aria-label="Clear image"
            className="inline-flex items-center rounded-md border border-[rgba(199,194,184,0.2)] px-2 py-1.5 text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={onFile}
      />

      {error && (
        <p className="font-mono text-[10.5px] text-[rgba(209,75,75,0.95)]">{error}</p>
      )}

      {info && (
        <p className="font-mono text-[10px] text-[rgba(199,194,184,0.55)] tracking-archival">
          {info.name} — {info.dims} {info.mime.replace("image/", "").toUpperCase()} — {prettyBytes(info.size)}
          {info.size > MAX_OUTPUT_BYTES_WARN && (
            <span className="ml-2 text-[rgba(208,122,58,0.9)]">
              (heavy — consider a smaller source for faster page loads)
            </span>
          )}
        </p>
      )}

      {hint && !info && (
        <p className="font-mono text-[10px] text-[rgba(199,194,184,0.45)]">{hint}</p>
      )}

      {showPreview && (
        <div className="max-w-[260px] rounded-md border border-[rgba(199,194,184,0.18)] overflow-hidden bg-[rgba(11,12,15,0.5)]">
          <img
            src={value}
            alt=""
            className="w-full h-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

export default AdminImageField;
