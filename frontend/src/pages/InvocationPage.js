import React from "react";
import { InvocationForm } from "@/components/neoverse/InvocationForm";
import { AtmosphereLayer } from "@/components/neoverse/AtmosphereLayer";
import { usePageContent } from "@/hooks/usePageContent";

export default function InvocationPage() {
  const t = usePageContent("invocation");
  return (
    <div className="relative mx-auto max-w-[820px] px-4 sm:px-6 pt-16 sm:pt-24 pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] z-0">
        <AtmosphereLayer grain stars wash="threshold" />
      </div>
      <div className="relative z-10">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.6)] mb-2 text-center">
          {t("eyebrow", "The Invocation")}
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5.2vw,4rem)] leading-[1.02] text-[rgba(231,224,214,0.97)] text-center">
          {t("headline_primary", "Leave a light on")}
          <span className="block italic text-[rgba(199,168,106,0.92)]">{t("headline_secondary", "in the archive.")}</span>
        </h1>
        <p className="mt-5 font-serif italic text-lg sm:text-xl text-[rgba(231,224,214,0.78)] leading-relaxed text-center max-w-[56ch] mx-auto">
          {t("subtext", "Receive transmissions from the road — new music, poems, artwork, and dispatches from the Neoverse. No noise. Only the signal.")}
        </p>
        <div className="mt-10">
          <InvocationForm source="invocation-page" />
        </div>
      </div>
    </div>
  );
}
