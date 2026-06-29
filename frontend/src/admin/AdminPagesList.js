import React from "react";
import { Link } from "react-router-dom";
import { PAGE_LIST, PAGE_SCHEMAS } from "./pageSchemas";

export default function AdminPagesList() {
  return (
    <div className="max-w-[920px]">
      <header className="mb-8">
        <p className="font-mono tracking-archival text-[10.5px] text-[rgba(199,194,184,0.55)] mb-2">
          Pages
        </p>
        <h1 className="font-serif text-3xl text-[rgba(231,224,214,0.95)]">
          Editable site copy
        </h1>
        <p className="mt-3 font-serif italic text-[rgba(231,224,214,0.7)] leading-relaxed">
          Each page below has editable text — headlines, taglines, button
          labels, and (for the home page) bio paragraphs and portal copy.
          Empty fields fall back to the original copy. Saving an empty field
          does not blank the live site.
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAGE_LIST.map((slug) => (
          <li key={slug}>
            <Link
              to={`/admin/pages/${slug}`}
              data-testid={`admin-pages-link-${slug}`}
              className="group flex items-center justify-between rounded-lg border border-border/70 bg-[hsl(var(--card))] px-4 py-3 transition-colors hover:border-[rgba(199,168,106,0.45)]"
            >
              <span className="font-serif text-lg text-[rgba(231,224,214,0.95)]">
                {PAGE_SCHEMAS[slug]?.label || slug}
              </span>
              <span className="font-mono tracking-archival text-[10px] text-[rgba(199,168,106,0.8)] group-hover:text-[rgba(199,168,106,1)]">
                edit →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
