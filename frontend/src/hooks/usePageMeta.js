/**
 * usePageMeta — sets document.title and meta description on every route.
 * Usage: call at the top of any page component.
 *
 * @param {string} title       — page title (appended with " | Zint Institute")
 * @param {string} description — meta description for SEO
 */
export function usePageMeta(title, description) {
  const fullTitle = title
    ? `${title} | Zint Computer Education Institute`
    : "Zint Computer Education Institute — ISO 9001:2015 Certified, Gwalior";

  // Update <title>
  document.title = fullTitle;

  // Update or create <meta name="description">
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  if (description) metaDesc.setAttribute("content", description);

  // Update or create <meta property="og:title">
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", fullTitle);
}
