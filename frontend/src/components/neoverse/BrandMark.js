import React from "react";

/**
 * BrandMark — the master Neo Brightwell / Moonshine Disco mark.
 * Renders the NB Skull + Disco Globe artifact, with subtle warm glow.
 */
export const NB_SKULL_URL =
  "https://customer-assets.emergentagent.com/job_the-archive-3/artifacts/e8pfhrjf_IMG_1488.jpeg";

export const BrandMark = ({ size = 32, className = "", glow = true }) => (
  <img
    src={NB_SKULL_URL}
    alt="Neo Brightwell — Moonshine Disco mark"
    width={size}
    height={size}
    className={className}
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      filter: glow
        ? "drop-shadow(0 0 12px rgba(199,168,106,0.28))"
        : "none",
    }}
  />
);

export default BrandMark;
