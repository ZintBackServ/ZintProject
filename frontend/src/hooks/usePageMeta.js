import { useEffect } from "react";

const SITE_NAME = "Zint Computer Education Institute";
const BASE_URL = "https://zintinstitute.in";
const DEFAULT_IMAGE = `${BASE_URL}/image.png`;
const DEFAULT_TITLE = "Best IT Training Institute in Gwalior | Zint Institute";
const DEFAULT_DESC =
  "ISO 9001:2015 Certified computer training institute in Gwalior. Top career courses in Software Development, Full Stack, Python, Web Design, DCA, PGDCA & 100% Placement Support.";

/**
 * usePageMeta — sets document.title, meta description, OpenGraph, Twitter, canonical, and robots directives.
 * Accepts either:
 *   usePageMeta(title, description, options)
 * or
 *   usePageMeta({ title, description, image, noIndex, canonicalPath, keywords, type })
 */
export function usePageMeta(arg1, arg2, arg3) {
  let title = "";
  let description = "";
  let options = {};

  if (typeof arg1 === "object" && arg1 !== null) {
    options = arg1;
    title = options.title || "";
    description = options.description || "";
  } else {
    title = arg1 || "";
    description = arg2 || "";
    options = arg3 || {};
  }

  const {
    image = DEFAULT_IMAGE,
    noIndex = false,
    canonicalPath = null,
    type = "website",
    keywords = null,
  } = options;

  const applyMeta = () => {
    if (typeof document === "undefined") return;

    // 1. Build Title
    let formattedTitle = DEFAULT_TITLE;
    if (title) {
      if (title.includes("Zint") || title.includes("ZINT")) {
        formattedTitle = title;
      } else {
        formattedTitle = `${title} | Zint Institute`;
      }
    }
    document.title = formattedTitle;

    // Helper to get or create element
    const setMetaTag = (selector, attrName, attrVal, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content || "");
    };

    const setLinkTag = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // 2. Canonical URL (always clean absolute https://zintinstitute.in/path without trailing slash / query params)
    let cleanCanonical = BASE_URL;
    if (canonicalPath) {
      const normalizedPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
      cleanCanonical = `${BASE_URL}${normalizedPath === "/" ? "" : normalizedPath.replace(/\/+$/, "")}`;
    } else if (typeof window !== "undefined") {
      const pathname = window.location.pathname.replace(/\/+$/, "");
      cleanCanonical = `${BASE_URL}${pathname}`;
    }
    setLinkTag("canonical", cleanCanonical);

    // 3. Robots (noindex for private/auth/error pages)
    const robotsContent = noIndex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    setMetaTag('meta[name="robots"]', "name", "robots", robotsContent);

    // 4. Meta Description
    const metaDesc = description || DEFAULT_DESC;
    setMetaTag('meta[name="description"]', "name", "description", metaDesc);

    // 4b. Meta Keywords (optional per-page; skip if not provided)
    if (keywords) {
      setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    }

    // 5. Open Graph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", formattedTitle);
    setMetaTag('meta[property="og:description"]', "property", "og:description", metaDesc);
    setMetaTag('meta[property="og:url"]', "property", "og:url", cleanCanonical);
    setMetaTag('meta[property="og:type"]', "property", "og:type", type);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    
    // Ensure absolute image URL
    const absoluteImage = image.startsWith("http") ? image : `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
    setMetaTag('meta[property="og:image"]', "property", "og:image", absoluteImage);

    // 6. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", formattedTitle);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", metaDesc);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);
    setMetaTag('meta[name="twitter:url"]', "name", "twitter:url", cleanCanonical);
  };

  // Run synchronously for immediate prerender/DOM capture
  applyMeta();

  // Also hook into useEffect for reactive updates when props/state change
  useEffect(() => {
    applyMeta();
  }, [title, description, image, noIndex, canonicalPath, type, keywords]);
}

export default usePageMeta;
