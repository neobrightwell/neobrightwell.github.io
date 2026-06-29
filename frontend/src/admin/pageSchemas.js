// ---------------------------------------------------------------------
// Editable page copy schemas.
//
// Each entry defines which text fields are editable for a given page slug,
// what they look like in the admin form, and what their hardcoded fallback
// is. The public page renders `dbValue || hardcodedDefault` so changing the
// fallback here also updates the live site when no DB value is set.
//
// Field types reuse the renderers in AdminFormFields.js: text, textarea,
// longtext.
// ---------------------------------------------------------------------

export const PAGE_SCHEMAS = {
  home: {
    label: "Home",
    sections: [
      {
        title: "Hero",
        fields: [
          { name: "hero_eyebrow", label: "Eyebrow (small caption above headline)", type: "text",
            default: "Moonshine Disco \u2014 outlaw soul for people who survived" },
          { name: "hero_headline_primary", label: "Headline \u2014 first line", type: "text",
            default: "I hope you remember" },
          { name: "hero_headline_secondary", label: "Headline \u2014 second line (italic gold)", type: "text",
            default: "yourself tonight." },
          { name: "hero_subtext", label: "Hero subtext (italic paragraph)", type: "textarea",
            default: "You\u2019ve crossed a threshold. Inside: music, letters that were never mailed, a distant radio transmission, and an archive built for people who survived impossible things." },
          { name: "hero_cta_primary_label", label: "Primary CTA label", type: "text",
            default: "Enter The Archive",
            hint: "Button destination is fixed in code." },
          { name: "hero_cta_secondary_label", label: "Secondary CTA label", type: "text",
            default: "Open The Library",
            hint: "Button destination is fixed in code." },
        ],
      },
      {
        title: "Bio",
        fields: [
          { name: "bio", label: "Bio paragraphs", type: "longtext",
            hint: "Separate paragraphs with a blank line.",
            default:
              "Neo Brightwell is an American singer-songwriter, outlaw poet, producer, and originator of Moonshine Disco.\n\nHe writes from the borderlands between memory and myth, building songs, poems, records, and artifacts that inhabit a shared universe known as the Neoverse.\n\nHis work is concerned with witness, survival, inheritance, and the strange ways people continue carrying what history fails to record.\n\nHe lives in Philadelphia." },
          { name: "bio_kicker", label: "Kicker (italic gold line under bio)", type: "text",
            default: "The rest is in the archive." },
        ],
      },
      {
        title: "Portals (three doors)",
        fields: [
          { name: "portals_caption", label: "Caption above portal cards", type: "text",
            default: "Three doors into the Neoverse" },
          { name: "portal_archive_label", label: "Portal 1 \u2014 label", type: "text", default: "The Archive" },
          { name: "portal_archive_line",  label: "Portal 1 \u2014 line",  type: "text", default: "Four rooms. Four atmospheres." },
          { name: "portal_library_label", label: "Portal 2 \u2014 label", type: "text", default: "The Library" },
          { name: "portal_library_line",  label: "Portal 2 \u2014 line",  type: "text", default: "Recovered documents. Quiet, sacred." },
          { name: "portal_observatory_label", label: "Portal 3 \u2014 label", type: "text", default: "The Observatory" },
          { name: "portal_observatory_line",  label: "Portal 3 \u2014 line",  type: "text", default: "Artifacts from another sky." },
        ],
      },
      {
        title: "Albums strip",
        fields: [
          { name: "albums_strip_eyebrow",   label: "Eyebrow",   type: "text", default: "From The Archive" },
          { name: "albums_strip_headline",  label: "Headline",  type: "text", default: "Four rooms. One mythology." },
          { name: "albums_strip_link_label", label: "All-rooms link label", type: "text", default: "All rooms \u2192" },
        ],
      },
      {
        title: "Roadhouse strip",
        fields: [
          { name: "roadhouse_strip_eyebrow",   label: "Eyebrow",   type: "text", default: "The Roadhouse" },
          { name: "roadhouse_strip_headline",  label: "Headline",  type: "text", default: "Latest dispatches" },
          { name: "roadhouse_strip_link_label", label: "Bulletin link label", type: "text", default: "The bulletin board \u2192" },
        ],
      },
    ],
  },

  archive: { ...sectionPage({
    label: "Archive (landing page)",
    defaults: {
      eyebrow: "The Archive",
      headline_primary: "Four rooms.",
      headline_secondary: "One mythology.",
      subtext: "Each album is its own room. Cross the threshold; the air changes. Move slowly \u2014 the archive rewards attention.",
    },
  }) },

  library: { ...sectionPage({
    label: "Library (landing page)",
    defaults: {
      eyebrow: "The Library",
      headline_primary: "Recovered documents.",
      headline_secondary: "A quiet reading room.",
      subtext: "Poems, essays, manuscripts. Take your time \u2014 these are documents that ask to be sat with.",
    },
  }) },

  symbols: { ...sectionPage({
    label: "Symbols (landing page)",
    defaults: {
      eyebrow: "The Symbols",
      headline_primary: "A living mythology.",
      headline_secondary: "Decoded in fragments.",
      subtext: "S\u00e9lune. The crescent and star. The eye. The liminality glyph. Recurring shapes that speak across the work \u2014 remembrance, survival, transformation, return, truth, witness.",
    },
    extras: [
      { name: "constellation_caption", label: "Constellation caption (bottom-left of canvas)", type: "text", default: "Hover a symbol to draw its constellation." },
    ],
  }) },

  roadhouse: { ...sectionPage({
    label: "Roadhouse (landing page)",
    defaults: {
      eyebrow: "The Roadhouse",
      headline_primary: "A bulletin board.",
      headline_secondary: "A desert dance hall.",
      subtext: "Shows, releases, news, and press \u2014 pinned to the wall by hand.",
    },
  }) },

  observatory: { ...sectionPage({
    label: "Observatory (landing page)",
    defaults: {
      eyebrow: "The Observatory",
      headline_primary: "Artifacts from",
      headline_secondary: "another sky.",
      subtext: "Paintings, photographs, and visual projects \u2014 examined under quiet light.",
    },
  }) },

  invocation: { ...sectionPage({
    label: "Invocation (signup page)",
    defaults: {
      eyebrow: "The Invocation",
      headline_primary: "Leave a light on",
      headline_secondary: "in the archive.",
      subtext: "Receive transmissions from the road \u2014 new music, poems, artwork, and dispatches from the Neoverse. No noise. Only the signal.",
    },
  }) },
};

// Helper factory for the uniform section-page schema.
function sectionPage({ label, defaults, extras = [] }) {
  return {
    label,
    sections: [
      {
        title: "Header",
        fields: [
          { name: "eyebrow",            label: "Eyebrow (small caption)",                type: "text",     default: defaults.eyebrow },
          { name: "headline_primary",   label: "Headline \u2014 first line",             type: "text",     default: defaults.headline_primary },
          { name: "headline_secondary", label: "Headline \u2014 second line (italic gold)", type: "text",  default: defaults.headline_secondary },
          { name: "subtext",            label: "Subtext (italic paragraph)",             type: "textarea", default: defaults.subtext },
          ...extras,
        ],
      },
    ],
  };
}

// All page slugs in nav order.
export const PAGE_LIST = [
  "home",
  "archive",
  "library",
  "symbols",
  "roadhouse",
  "observatory",
  "invocation",
];

// Helper: get the full default-values map for a page (used to pre-fill the
// admin form with current copy when no DB value exists yet).
export function defaultsForPage(slug) {
  const schema = PAGE_SCHEMAS[slug];
  if (!schema) return {};
  const out = {};
  for (const section of schema.sections) {
    for (const f of section.fields) {
      out[f.name] = f.default ?? "";
    }
  }
  return out;
}
