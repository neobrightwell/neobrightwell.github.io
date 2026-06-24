// Schema definitions for each admin content type.
// Each schema declares: resource, title, listFields, formSections (groups of fields).
// Field types: text | textarea | longtext | number | select | tags | image | toggle | list
import { adminAlbums, adminLibrary, adminSymbols, adminRoadhouse, adminObservatory } from "@/api/client";

const statusOpts = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export const SCHEMAS = {
  albums: {
    resource: "albums",
    api: adminAlbums,
    title: "Albums",
    singular: "album",
    primary_field: "title",
    list_fields: ["title", "slug", "atmosphere", "year", "status"],
    sections: [
      {
        title: "Identity",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true, hint: "URL fragment, e.g. neon-rodeo" },
          { name: "subtitle", label: "Subtitle", type: "text" },
          { name: "year", label: "Year", type: "text" },
          {
            name: "atmosphere",
            label: "Atmosphere",
            type: "select",
            options: [
              { value: "neon-rodeo", label: "Neon Rodeo (desert highway)" },
              { value: "an-american-reckoning", label: "An American Reckoning (fire / testimony)" },
              { value: "we-didnt-survive-to-be-quiet", label: "We Didn’t Survive to Be Quiet (archive)" },
              { value: "burn-bright-stay-free", label: "Burn Bright, Stay Free (liberation)" },
              { value: "default", label: "Default" },
            ],
          },
          { name: "status", label: "Status", type: "select", options: statusOpts },
          { name: "sort_order", label: "Sort order", type: "number" },
        ],
      },
      {
        title: "Visual",
        fields: [
          { name: "cover_image_url", label: "Cover image URL or data URI", type: "image" },
          { name: "hero_image_url", label: "Hero image URL (optional)", type: "image" },
        ],
      },
      {
        title: "Words",
        fields: [
          { name: "epigraph", label: "Epigraph", type: "textarea" },
          { name: "lore", label: "Liner notes / lore (markdown)", type: "longtext" },
          { name: "visual_symbolism", label: "Visual symbolism notes", type: "longtext" },
          { name: "themes", label: "Themes", type: "tags", hint: "comma-separated" },
        ],
      },
      {
        title: "Listening",
        fields: [
          {
            name: "streaming_links",
            label: "Streaming links",
            type: "list",
            item_fields: [
              { name: "platform", label: "Platform", type: "text", hint: "spotify / apple_music / bandcamp / youtube" },
              { name: "label", label: "Label override", type: "text" },
              { name: "url", label: "URL", type: "text" },
            ],
          },
          {
            name: "songs",
            label: "Songs",
            type: "list",
            item_fields: [
              { name: "title", label: "Title", type: "text" },
              { name: "order", label: "Order", type: "number" },
              { name: "duration", label: "Duration", type: "text", hint: "e.g. 3:42" },
              { name: "audio_url", label: "Audio URL (mp3 / preview)", type: "text" },
              { name: "lyrics", label: "Lyrics", type: "longtext" },
              { name: "notes", label: "Notes", type: "textarea" },
            ],
          },
          { name: "embed_html", label: "Embed HTML (Spotify/Bandcamp player snippet)", type: "longtext" },
          {
            name: "recovered_fragments",
            label: "Recovered fragments (frequencies, coordinates)",
            type: "list",
            item_fields: [
              { name: "label", label: "Label", type: "text" },
              { name: "value", label: "Value", type: "text" },
            ],
          },
        ],
      },
    ],
  },

  library: {
    resource: "library",
    api: adminLibrary,
    title: "Library",
    singular: "library entry",
    primary_field: "title",
    list_fields: ["title", "slug", "type", "status"],
    sections: [
      {
        title: "Entry",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "subtitle", label: "Subtitle", type: "text" },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "poem", label: "Poem" },
              { value: "essay", label: "Essay" },
              { value: "manuscript", label: "Manuscript" },
              { value: "publication", label: "Publication" },
            ],
          },
          { name: "date_written", label: "Date / season written", type: "text" },
          { name: "publication_credit", label: "Publication credit", type: "text" },
          { name: "status", label: "Status", type: "select", options: statusOpts },
          { name: "sort_order", label: "Sort order", type: "number" },
        ],
      },
      {
        title: "Body",
        fields: [
          { name: "epigraph", label: "Epigraph", type: "textarea" },
          { name: "body", label: "Body (markdown / plain text)", type: "longtext" },
          { name: "tags", label: "Tags", type: "tags" },
          { name: "marginal_notes", label: "Marginal notes", type: "tags", hint: "one per comma" },
        ],
      },
    ],
  },

  symbols: {
    resource: "symbols",
    api: adminSymbols,
    title: "Symbols",
    singular: "symbol",
    primary_field: "name",
    list_fields: ["name", "slug", "status"],
    sections: [
      {
        title: "Symbol",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "short_definition", label: "Short definition", type: "textarea" },
          { name: "full_description", label: "Full description (markdown)", type: "longtext" },
          { name: "themes", label: "Themes", type: "tags" },
          { name: "related_works", label: "Related work slugs", type: "tags" },
          { name: "image_url", label: "Glyph image (bitmap URL or data URI)", type: "image", hint: "Used when no custom SVG is provided; takes priority over the default line glyph." },
          { name: "image_filter", label: "Glyph image CSS filter (optional)", type: "text", hint: "e.g. 'invert(1)' for dark lines on light background; 'brightness(1.1) contrast(1.1)' for muted images." },
          { name: "glyph_svg", label: "Custom glyph SVG (optional)", type: "longtext" },
          { name: "status", label: "Status", type: "select", options: statusOpts },
          { name: "sort_order", label: "Sort order", type: "number" },
        ],
      },
    ],
  },

  roadhouse: {
    resource: "roadhouse",
    api: adminRoadhouse,
    title: "Roadhouse",
    singular: "roadhouse post",
    primary_field: "title",
    list_fields: ["title", "slug", "type", "event_date", "status"],
    sections: [
      {
        title: "Post",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "news", label: "News" },
              { value: "event", label: "Event / Show" },
              { value: "release", label: "Release" },
              { value: "press", label: "Press" },
              { value: "field_note", label: "Field Note" },
            ],
          },
          { name: "event_date", label: "Date (ISO)", type: "text", hint: "YYYY-MM-DD" },
          { name: "location", label: "Location", type: "text" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "body", label: "Body", type: "longtext" },
          { name: "image_url", label: "Image URL", type: "image" },
          { name: "link", label: "External link", type: "text" },
          { name: "link_label", label: "Link label", type: "text" },
          { name: "status", label: "Status", type: "select", options: statusOpts },
          { name: "sort_order", label: "Sort order", type: "number" },
        ],
      },
    ],
  },

  observatory: {
    resource: "observatory",
    api: adminObservatory,
    title: "Observatory",
    singular: "artwork",
    primary_field: "title",
    list_fields: ["title", "slug", "medium", "year", "status"],
    sections: [
      {
        title: "Artwork",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "image_url", label: "Image URL or data URI", type: "image", required: true },
          { name: "medium", label: "Medium", type: "text" },
          { name: "year", label: "Chronology", type: "text" },
          { name: "origin", label: "Origin", type: "text" },
          { name: "description", label: "Description", type: "longtext" },
          { name: "symbolism", label: "Symbolism notes", type: "longtext" },
          { name: "status", label: "Status", type: "select", options: statusOpts },
          { name: "sort_order", label: "Sort order", type: "number" },
        ],
      },
    ],
  },
};

export const DEFAULTS_FOR = (resource) => {
  const s = SCHEMAS[resource];
  if (!s) return {};
  const out = {};
  for (const section of s.sections) {
    for (const f of section.fields) {
      if (f.type === "list") out[f.name] = [];
      else if (f.type === "tags") out[f.name] = [];
      else if (f.type === "number") out[f.name] = 0;
      else if (f.type === "select") out[f.name] = f.options?.[0]?.value || "";
      else out[f.name] = "";
    }
  }
  return out;
};
