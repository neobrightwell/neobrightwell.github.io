// Test IDs for The Neoverse — referenced by the testing agent.

export const NAV = {
  root: "global-nav",
  brand: "global-nav-brand",
  link_archive: "global-nav-link-archive",
  link_library: "global-nav-link-library",
  link_symbols: "global-nav-link-symbols",
  link_roadhouse: "global-nav-link-roadhouse",
  link_observatory: "global-nav-link-observatory",
  link_invocation: "global-nav-link-invocation",
  mobile_open: "global-nav-open-button",
  mobile_close: "global-nav-close-button",
};

export const THRESHOLD = {
  hero: "threshold-hero",
  cta_enter_archive: "threshold-hero-enter-archive-button",
  cta_open_library: "threshold-hero-open-library-button",
  portals: "threshold-portals",
  portal_archive: "threshold-portal-archive",
  portal_library: "threshold-portal-library",
  portal_observatory: "threshold-portal-observatory",
};

export const ARCHIVE = {
  grid: "archive-album-grid",
  door: "archive-album-door",
  door_for: (slug) => `archive-album-door-${slug}`,
  album_title: "album-title",
  album_streaming_links: "album-streaming-links",
  album_tracklist: "album-tracklist",
  album_liner_notes: "album-liner-notes",
};

export const PLAYER = {
  root: "album-audio-player",
  play: "audio-player-play-button",
  pause: "audio-player-pause-button",
  seek: "audio-player-seek-slider",
  track_title: "audio-player-track-title",
  next: "audio-player-next-button",
  prev: "audio-player-prev-button",
};

export const LIBRARY = {
  index: "library-index",
  search: "library-search-input",
  filter_tabs: "library-filter-tabs",
  item: "library-item-card",
  reader: "library-reader",
};

export const SYMBOLS = {
  constellation: "symbols-constellation",
  node: "symbol-node",
  node_for: (slug) => `symbol-node-${slug}`,
  title: "symbol-title",
  occurrences: "symbol-occurrences",
};

export const ROADHOUSE = {
  board: "roadhouse-board",
  post: "roadhouse-post-card",
  post_open: "roadhouse-post-open-button",
};

export const OBSERVATORY = {
  gallery: "observatory-gallery",
  art_card: "observatory-art-card",
};

export const INVOCATION = {
  form: "invocation-form",
  email: "invocation-email-input",
  first_name: "invocation-first-name-input",
  submit: "invocation-submit-button",
  success: "invocation-confirmation-state",
  error: "invocation-error-message",
};

export const ADMIN = {
  shell: "admin-shell",
  login_form: "admin-login-form",
  // NOTE: `login_password` is a data-testid for the password INPUT field,
  // not a credential. Linters sometimes flag this — keeping the name for
  // clarity because the testing agent already targets `admin-login-password-input`.
  login_password: "admin-login-password-input",  // noqa: secret-scan
  login_submit: "admin-login-submit-button",
  logout: "admin-logout-button",
  nav_albums: "admin-nav-albums",
  nav_library: "admin-nav-library",
  nav_symbols: "admin-nav-symbols",
  nav_roadhouse: "admin-nav-roadhouse",
  nav_observatory: "admin-nav-observatory",
  nav_subscribers: "admin-nav-subscribers",
  list_create: "admin-list-create-button",
  list_item: "admin-list-item",
  list_edit: "admin-list-edit-button",
  list_delete: "admin-list-delete-button",
  form: "admin-edit-form",
  form_save: "admin-save-button",
  form_cancel: "admin-cancel-button",
};
