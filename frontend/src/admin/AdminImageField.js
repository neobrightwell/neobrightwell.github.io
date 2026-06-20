/* Image upload field for the admin form.
 * Pure UI — all upload logic lives in useImageUpload. */
import React, { useRef } from "react";
import { Upload, X, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  prettyBytes,
  DEFAULT_MAX_DIM,
  MAX_OUTPUT_BYTES_WARN,
} from "@/lib/image";
import { useImageUpload } from "./useImageUpload";

const INPUT_CLASS = "bg-[rgba(20,22,27,0.6)] border-[rgba(199,194,184,0.18)]";

function UploadButton({ busy, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  );
}

function ClearButton({ busy, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label="Clear image"
      className="inline-flex items-center rounded-md border border-[rgba(199,194,184,0.2)] px-2 py-1.5 text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)]"
    >
      <X size={14} />
    </button>
  );
}

function ImageMeta({ info }) {
  return (
    <p className="font-mono text-[10px] text-[rgba(199,194,184,0.55)] tracking-archival">
      {info.name} — {info.dims} {info.mime.replace("image/", "").toUpperCase()} —{" "}
      {prettyBytes(info.size)}
      {info.size > MAX_OUTPUT_BYTES_WARN && (
        <span className="ml-2 text-[rgba(208,122,58,0.9)]">
          (heavy — consider a smaller source for faster page loads)
        </span>
      )}
    </p>
  );
}

function ImagePreview({ src }) {
  return (
    <div className="max-w-[260px] rounded-md border border-[rgba(199,194,184,0.18)] overflow-hidden bg-[rgba(11,12,15,0.5)]">
      <img
        src={src}
        alt=""
        className="w-full h-auto"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

export function AdminImageField({ value, onChange, hint, maxDim = DEFAULT_MAX_DIM }) {
  const fileRef = useRef(null);
  const { busy, info, error, process, reset } = useImageUpload({ maxDim });

  const isDataUri = typeof value === "string" && value.startsWith("data:");

  const pick = () => fileRef.current?.click();
  const clear = () => {
    onChange("");
    reset();
    if (fileRef.current) fileRef.current.value = "";
  };
  const onFile = async (e) => {
    const dataUri = await process(e.target.files?.[0]);
    if (dataUri) onChange(dataUri);
  };

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
        <UploadButton busy={busy} onClick={pick} />
        {value && <ClearButton busy={busy} onClick={clear} />}
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
      {info && <ImageMeta info={info} />}
      {hint && !info && (
        <p className="font-mono text-[10px] text-[rgba(199,194,184,0.45)]">{hint}</p>
      )}
      {value && <ImagePreview src={value} />}
    </div>
  );
}

export default AdminImageField;
