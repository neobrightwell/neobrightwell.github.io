/* Custom hook encapsulating the client-side image upload pipeline.
 * Keeps AdminImageField purely presentational. */
import { useCallback, useState } from "react";
import { fileToDataUri, DEFAULT_MAX_DIM } from "@/lib/image";

export function useImageUpload({ maxDim = DEFAULT_MAX_DIM } = {}) {
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setInfo(null);
    setError(null);
  }, []);

  /* Process the picked File and return the resulting data URI.
   * Callers wire the returned URI into form state. */
  const process = useCallback(
    async (file) => {
      if (!file) return null;
      setError(null);
      setBusy(true);
      try {
        const res = await fileToDataUri(file, { maxDim });
        setInfo({
          name: res.name,
          size: res.outBytes,
          dims: `${res.width}×${res.height}`,
          mime: res.outMime,
        });
        return res.dataUri;
      } catch (err) {
        setError(err?.message || "Could not process that image.");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [maxDim]
  );

  return { busy, info, error, process, reset };
}
