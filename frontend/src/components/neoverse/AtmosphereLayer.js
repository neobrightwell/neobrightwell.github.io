import React from "react";
import { cn } from "@/lib/utils";

/**
 * AtmosphereLayer
 * Stacks restrained atmospheric overlays inside any positioned container.
 * Props: grain, dust, stars, vignette, wash ("blue"|"fire"|"archive"|"liberation"|"threshold")
 * Honors prefers-reduced-motion via CSS rules.
 */
export const AtmosphereLayer = ({
  grain = true,
  dust = false,
  stars = false,
  vignette = false,
  wash = null,
  className = "",
}) => {
  const washClass = wash ? `neo-wash-${wash}` : "";
  return (
    <div className={cn("neo-layer", className)} aria-hidden="true">
      {wash && <div className={cn("neo-layer", washClass)} />}
      {stars && <div className="neo-layer neo-stars" />}
      {dust && <div className="neo-layer neo-dust" />}
      {grain && <div className="neo-layer neo-grain" />}
      {vignette && <div className="neo-layer neo-vignette" />}
    </div>
  );
};

export default AtmosphereLayer;
