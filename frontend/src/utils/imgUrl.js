/**
 * Normalizes an image URL to always use HTTPS.
 * This fixes mixed-content warnings for Cloudinary URLs that were stored
 * in the database before the backend was updated to use secure_url.
 *
 * Usage:
 *   import { toHttps } from "../utils/imgUrl";
 *   <img src={toHttps(student.profileImage)} ... />
 *
 * @param {string|null|undefined} url - The image URL to normalize.
 * @returns {string|null} The HTTPS version of the URL, or null if not provided.
 */
export function toHttps(url) {
  if (!url) return null;
  // Replace http:// with https:// only for known CDN domains to be safe
  return url.replace(/^http:\/\//i, "https://");
}
