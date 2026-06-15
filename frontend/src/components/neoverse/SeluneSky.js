
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CrescentGlyph } from "./Glyphs";

/**
 * Wow moment: Sélune subtly appears in the sky on route transitions to
 * specific sections (Archive / Observatory / Symbols).  Auto-removes.
 */
const SELUNE_PATHS = ["/archive", "/observatory", "/symbols"];

export const SeluneSky = () => {
  const location = useLocation();
  const [key, setKey] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (SELUNE_PATHS.some((p) => location.pathname.startsWith(p))) {
      setKey((k) => k + 1);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3200);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  if (!visible) return null;
  return (
    <div
      key={key}
      className="pointer-events-none fixed right-6 top-20 z-[5] neo-selune text-[rgba(199,168,106,0.95)]"
      aria-hidden="true"
    >
      <CrescentGlyph size={56} />
    </div>
  );
};

export default SeluneSky;
