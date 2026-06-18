// Small wrapper around DOMPurify so we configure the policy in ONE place.
// Anything rendered via dangerouslySetInnerHTML must flow through `sanitizeHtml`.
import DOMPurify from "dompurify";

// SVG glyphs uploaded for symbols use a tight whitelist.
const SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  ALLOWED_TAGS: [
    "svg", "g", "path", "circle", "rect", "line", "polyline", "polygon",
    "ellipse", "defs", "filter", "feGaussianBlur", "feColorMatrix",
    "linearGradient", "radialGradient", "stop", "text", "tspan", "title", "desc",
  ],
  ALLOWED_ATTR: [
    "viewBox", "width", "height", "fill", "stroke", "stroke-width",
    "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "opacity",
    "transform", "cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2",
    "rx", "ry", "d", "points", "id", "class", "style", "offset",
    "stop-color", "stop-opacity", "gradientUnits", "gradientTransform",
    "filterUnits", "stdDeviation", "values", "type", "in", "result", "aria-hidden",
  ],
};

// HTML embeds (e.g. Spotify / Bandcamp player iframes pasted by admin).
const EMBED_CONFIG = {
  ALLOWED_TAGS: ["iframe", "div", "p", "br", "a", "span", "strong", "em"],
  ALLOWED_ATTR: [
    "src", "width", "height", "frameborder", "allow", "allowfullscreen",
    "allowtransparency", "loading", "title", "style", "class",
    "scrolling", "href", "target", "rel",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:https?:)?\/\/(?:open\.spotify\.com|w\.soundcloud\.com|bandcamp\.com|[a-z0-9-]+\.bandcamp\.com|www\.youtube\.com|youtube\.com|youtube-nocookie\.com|music\.apple\.com|embed\.music\.apple\.com|player\.vimeo\.com)\//i,
};

export function sanitizeSvg(svg) {
  if (!svg) return "";
  return DOMPurify.sanitize(svg, SVG_CONFIG);
}

export function sanitizeEmbed(html) {
  if (!html) return "";
  return DOMPurify.sanitize(html, EMBED_CONFIG);
}
