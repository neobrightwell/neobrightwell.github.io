// ---------------------------------------------------------------------
//  usePageContent(slug)
//
//  Fetches editable copy from /api/pages/{slug} once on mount and returns
//  a translator function `t(key, fallback)` that yields the DB value when
//  present and the supplied fallback otherwise. Pages can therefore use
//  hardcoded English as the design source of truth and gracefully upgrade
//  to admin-managed copy.
// ---------------------------------------------------------------------
import { useEffect, useState, useCallback } from "react";
import { fetchPageContent } from "@/api/client";

export function usePageContent(slug) {
  const [fields, setFields] = useState(null); // null = still loading

  useEffect(() => {
    let cancelled = false;
    fetchPageContent(slug)
      .then((d) => { if (!cancelled) setFields(d?.fields || {}); })
      .catch(() => { if (!cancelled) setFields({}); });
    return () => { cancelled = true; };
  }, [slug]);

  // Returns the DB-stored value for `key` when set & non-empty, else
  // `fallback`. Treats empty strings as "not set" so an accidentally
  // cleared field doesn't blank out the live site.
  const t = useCallback(
    (key, fallback) => {
      if (!fields) return fallback;
      const v = fields[key];
      if (v === undefined || v === null) return fallback;
      if (typeof v === "string" && v.trim() === "") return fallback;
      return v;
    },
    [fields]
  );

  return t;
}
