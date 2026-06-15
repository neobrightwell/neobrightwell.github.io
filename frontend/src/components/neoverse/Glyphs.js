import React from "react";

/** A simple crescent + star glyph used as brand mark and Sélune symbol. */
export const CrescentGlyph = ({ size = 22, className = "", withStar = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`neo-crescent ${className}`}
    aria-hidden="true"
  >
    <path
      d="M16.5 4.5a8.5 8.5 0 1 0 3 12.6A6.5 6.5 0 0 1 16.5 4.5z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {withStar && (
      <path
        d="M20 6.2l.5 1.4 1.5.1-1.2.9.4 1.5L20 9.3l-1.2.8.4-1.5-1.2-.9 1.5-.1z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        fill="none"
      />
    )}
  </svg>
);

export const EyeGlyph = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="12" cy="12" r="0.7" fill="currentColor" />
  </svg>
);

export const ThresholdGlyph = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M6 21V8a6 6 0 0 1 12 0v13" stroke="currentColor" strokeWidth="1.1" />
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.1" />
    <path d="M12 12v6" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const StarMark = ({ size = 12, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
    <path d="M6 1l1.2 3.6L11 5l-2.9 2.2L9 11 6 9 3 11l.9-3.8L1 5l3.8-.4z" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);
