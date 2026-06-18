/* Client-side image resizer / compressor.
 *
 * - Reads a File chosen via <input type="file">.
 * - Resizes so the longest edge ≤ MAX_DIM (default 1600px).
 * - Encodes as JPEG (default) or PNG (when alpha must be preserved).
 * - Returns a `data:image/...` URI ready to drop into Mongo.
 *
 * The whole pipeline runs in the browser — nothing is uploaded anywhere.
 */

export const DEFAULT_MAX_DIM = 1600;
export const DEFAULT_QUALITY = 0.85;
export const MAX_INPUT_BYTES = 12 * 1024 * 1024; // 12 MB
export const MAX_OUTPUT_BYTES_WARN = 1.5 * 1024 * 1024; // 1.5 MB warn

/** Mime types we know how to handle. */
const SUPPORTED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** Decide whether to keep alpha (PNG) or flatten (JPEG). */
function preserveAlpha(file) {
  const t = (file?.type || "").toLowerCase();
  return t === "image/png" || t === "image/webp" || t === "image/gif";
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image file."));
    };
    img.src = url;
  });
}

function fitDims(srcW, srcH, maxDim) {
  if (srcW <= maxDim && srcH <= maxDim) return [srcW, srcH];
  if (srcW >= srcH) {
    return [maxDim, Math.round((srcH / srcW) * maxDim)];
  }
  return [Math.round((srcW / srcH) * maxDim), maxDim];
}

/** Rough byte count of a data: URI. */
export function dataUriBytes(uri) {
  if (!uri || !uri.startsWith("data:")) return 0;
  const comma = uri.indexOf(",");
  if (comma === -1) return 0;
  const b64 = uri.slice(comma + 1);
  // Each base64 char encodes 6 bits → 0.75 bytes.
  // Subtract padding.
  const pad = (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

export async function fileToDataUri(
  file,
  {
    maxDim = DEFAULT_MAX_DIM,
    quality = DEFAULT_QUALITY,
    forceJpeg = false,
  } = {}
) {
  if (!file) throw new Error("No file given.");
  if (!SUPPORTED.has(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type || "unknown"}". Use JPEG, PNG, WEBP or GIF.`
    );
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      `That file is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). ` +
        `Please use an image under ${(MAX_INPUT_BYTES / 1024 / 1024).toFixed(0)} MB.`
    );
  }

  const img = await readImage(file);
  const [w, h] = fitDims(img.naturalWidth, img.naturalHeight, maxDim);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: true });

  // For JPEG output we paint a clean background so transparent regions don't
  // become weird black blocks.
  const wantAlpha = !forceJpeg && preserveAlpha(file);
  if (!wantAlpha) {
    ctx.fillStyle = "#0B0C0F"; // matches our dark theme so flattened PNGs blend if alpha is dropped
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  const outMime = wantAlpha ? "image/png" : "image/jpeg";
  const dataUri = wantAlpha
    ? canvas.toDataURL(outMime)
    : canvas.toDataURL(outMime, quality);

  return {
    dataUri,
    width: w,
    height: h,
    outBytes: dataUriBytes(dataUri),
    outMime,
    inMime: file.type,
    inBytes: file.size,
    name: file.name,
  };
}

export function prettyBytes(n) {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
