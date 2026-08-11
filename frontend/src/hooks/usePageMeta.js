/**
 * usePageMeta — sets document.title, meta description, OpenGraph tags, and canonical link on every route.
 * Usage: call at the top of any page component.
 *
 * @param {string} title       — page title (appended with " | Zint Computer Education Institute")
 * @param {string} description — meta description for SEO
 */
export function usePageMeta(title, description) {
  const fullTitle = title
    ? `${title} | Zint Computer Education Institute`
    : "Zint Computer Education Institute - ISO 9001:2015 Certified | Gwalior";

  // Update <title>
  document.title = fullTitle;

  // Helper to get or create element
  const setMetaAttr = (selector, createTag, attrName, attrVal, content) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement(createTag);
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    if (createTag === "link") {
      el.setAttribute("href", content);
    } else {
      el.setAttribute("content", content);
    }
  };

  // 1. Meta Description
  if (description) {
    setMetaAttr('meta[name="description"]', "meta", "name", "description", description);
    setMetaAttr('meta[property="og:description"]', "meta", "property", "og:description", description);
    setMetaAttr('meta[name="twitter:description"]', "meta", "name", "twitter:description", description);
  }

  // 2. OpenGraph & Twitter Title
  setMetaAttr('meta[property="og:title"]', "meta", "property", "og:title", fullTitle);
  setMetaAttr('meta[name="twitter:title"]', "meta", "name", "twitter:title", fullTitle);

  // 3. Canonical Link & OG URL
  if (typeof window !== "undefined") {
    const currentUrl = window.location.href;
    setMetaAttr('link[rel="canonical"]', "link", "rel", "canonical", currentUrl);
    setMetaAttr('meta[property="og:url"]', "meta", "property", "og:url", currentUrl);
  }
}

