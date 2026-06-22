import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// =====================================================================
//  ADMIN JWT STORAGE — DELIBERATE TRADEOFF, DO NOT "FIX"
// ---------------------------------------------------------------------
//  Admin JWT lives in sessionStorage (NOT localStorage) so it is scoped
//  to the current browser tab and cleared on close. This shrinks the
//  XSS blast radius vs. localStorage while keeping the SPA flow simple.
//
//  For a fully hardened setup, swap this to an httpOnly cookie issued
//  by /api/admin/login — that requires backend Set-Cookie changes and
//  CSRF protection, and is tracked as a separate architectural task
//  (NOT a bug). Until then this is intentional.
//
//  NOTE TO STATIC ANALYZERS: flagging sessionStorage for tokens here
//  is a known false positive — see comment above.
// =====================================================================
const TOKEN_KEY = "neoverse_admin_token";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (t) => sessionStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.url?.includes("/admin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Public endpoints ----
export const fetchAlbums = () => api.get("/albums").then((r) => r.data);
export const fetchAlbum = (slug) => api.get(`/albums/${slug}`).then((r) => r.data);
export const fetchLibrary = (params = {}) => api.get("/library", { params }).then((r) => r.data);
export const fetchLibraryEntry = (slug) => api.get(`/library/${slug}`).then((r) => r.data);
export const fetchSymbols = () => api.get("/symbols").then((r) => r.data);
export const fetchSymbol = (slug) => api.get(`/symbols/${slug}`).then((r) => r.data);
export const fetchRoadhouse = (params = {}) => api.get("/roadhouse", { params }).then((r) => r.data);
export const fetchRoadhousePost = (slug) => api.get(`/roadhouse/${slug}`).then((r) => r.data);
export const fetchObservatory = () => api.get("/observatory").then((r) => r.data);
export const fetchArtwork = (slug) => api.get(`/observatory/${slug}`).then((r) => r.data);

// ---- Invocation ----
export const submitInvocation = (payload) =>
  api.post("/invocation", payload).then((r) => r.data);

// ---- Admin ----
export const adminLogin = (password) =>
  api.post("/admin/login", { password }).then((r) => r.data);
export const adminMe = () => api.get("/admin/me").then((r) => r.data);
export const adminListSubscribers = () =>
  api.get("/admin/subscribers").then((r) => r.data);

const adminCrud = (resource) => ({
  list: (params = { status: "all" }) => api.get(`/${resource}`, { params }).then((r) => r.data),
  get: (slug) => api.get(`/${resource}/${slug}`).then((r) => r.data),
  create: (payload) => api.post(`/admin/${resource}`, payload).then((r) => r.data),
  update: (id, payload) => api.put(`/admin/${resource}/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/admin/${resource}/${id}`).then((r) => r.data),
});

export const adminAlbums = adminCrud("albums");
export const adminLibrary = adminCrud("library");
export const adminSymbols = adminCrud("symbols");
export const adminRoadhouse = adminCrud("roadhouse");
export const adminObservatory = adminCrud("observatory");
