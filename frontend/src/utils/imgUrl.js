/**
 * Normalizes an image URL to always use HTTPS and ensures Cloudinary URLs
 * use auto format (WebP/AVIF) and auto quality (f_auto,q_auto).
 *
 * @param {string|null|undefined} url - The image URL to normalize.
 * @returns {string|null} The optimized HTTPS version of the URL.
 */
export function toHttps(url) {
  if (!url || typeof url !== "string") return url || null;
  let normalized = url.replace(/^http:\/\//i, "https://");
  
  // Inject f_auto,q_auto for Cloudinary images if no transformations exist
  if (normalized.includes("res.cloudinary.com/") && normalized.includes("/image/upload/")) {
    if (!/\/image\/upload\/[^/]*[fwqc]_/.test(normalized)) {
      normalized = normalized.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }
  }
  return normalized;
}

/**
 * Return an optimized, modern-format Cloudinary derivative scaled for display width.
 * Automatically converts PNG/JPG to WebP/AVIF and compresses appropriately.
 *
 * @param {string|null|undefined} url - Original image URL
 * @param {number} width - Maximum display width in pixels (default: 640)
 */
export function toCloudinaryThumbnail(url, width = 640) {
  const secureUrl = toHttps(url);
  if (!secureUrl || !secureUrl.includes("res.cloudinary.com/") || !secureUrl.includes("/image/upload/")) {
    return secureUrl;
  }
  if (secureUrl.includes(`w_${width}`)) return secureUrl;

  if (secureUrl.includes("/image/upload/f_auto,q_auto/")) {
    return secureUrl.replace("/image/upload/f_auto,q_auto/", `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return secureUrl.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
}

