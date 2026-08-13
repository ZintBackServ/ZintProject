/**
 * Backend API base URL — set at build time via VITE_API_URL.
 *
 * Production examples:
 *   Same domain (Apache proxies /user, /course, … to Node): https://zintinstitute.in
 *   Separate API subdomain: https://api.zintinstitute.in
 */
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/** Build a full API path, e.g. apiUrl("/user/me") */
export function apiUrl(path = "") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

/** Full-page redirect target for Google OAuth (must hit Express, not React Router). */
export function googleAuthUrl() {
  return apiUrl("/user/auth/google");
}

/**
 * Upgrade an http:// image URL to https://.
 * Old Cloudinary records in the DB were saved before `secure: true` was set,
 * so they still start with http:// — which triggers mixed-content warnings on
 * the HTTPS production site.
 *
 * Usage:  <img src={toHttps(student.profileImage)} />
 */
export function toHttps(url) {
  if (!url || typeof url !== "string") return url;
  return url.replace(/^http:\/\//i, "https://");
}
