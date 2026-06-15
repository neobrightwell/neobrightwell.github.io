import React from "react";
import { Link } from "react-router-dom";
import { CrescentGlyph } from "@/components/neoverse/Glyphs";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-[640px] px-6 pt-24 pb-24 text-center">
      <span className="inline-flex text-[rgba(199,168,106,0.7)] mb-6">
        <CrescentGlyph size={42} />
      </span>
      <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-3">
        Recovered fragment missing
      </p>
      <h1 className="font-serif text-4xl text-[rgba(231,224,214,0.96)] leading-tight">
        This page is sealed.
      </h1>
      <p className="mt-4 font-serif italic text-[rgba(231,224,214,0.78)] text-lg">
        The road bent another way. Step back to the threshold.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-md bg-[rgba(199,168,106,0.95)] px-5 py-3 font-mono tracking-archival text-[11px] text-[#0B0C0F] hover:bg-[rgba(199,168,106,1)] transition-colors"
      >
        Return to the Threshold
      </Link>
    </div>
  );
}
