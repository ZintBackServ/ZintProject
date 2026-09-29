const express = require("express");
const router = express.Router();
const courseModel = require("../models/courseModel");
const eventModel = require("../models/eventModel");

const BASE_URL = "https://zintinstitute.in";

let cachedSitemap = null;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const STATIC_ROUTES = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "courses", changefreq: "daily", priority: "0.9" },
  { path: "about", changefreq: "monthly", priority: "0.8" },
  { path: "contact", changefreq: "monthly", priority: "0.8" },
  { path: "admission", changefreq: "weekly", priority: "0.8" },
  { path: "internship", changefreq: "weekly", priority: "0.8" },
  { path: "events", changefreq: "weekly", priority: "0.7" },
  { path: "webinar", changefreq: "weekly", priority: "0.7" },
  { path: "workshop", changefreq: "weekly", priority: "0.7" },
  { path: "careers", changefreq: "monthly", priority: "0.6" },
  { path: "PrivacyPolicy", changefreq: "yearly", priority: "0.3" },
  { path: "RefundPolicy", changefreq: "yearly", priority: "0.3" },
  { path: "TermsConditions", changefreq: "yearly", priority: "0.3" },
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const now = Date.now();
    if (cachedSitemap && now - lastCacheTime < CACHE_DURATION_MS) {
      res.header("Content-Type", "application/xml; charset=utf-8");
      res.header("Cache-Control", "public, max-age=3600");
      return res.send(cachedSitemap);
    }

    const [courses, events] = await Promise.all([
      courseModel.find({}, "_id slug updatedAt createdAt").lean(),
      eventModel.find({}, "_id updatedAt createdAt").lean(),
    ]);

    const xmlUrls = [];

    // Static pages
    for (const route of STATIC_ROUTES) {
      const loc = route.path ? `${BASE_URL}/${route.path}` : BASE_URL;
      xmlUrls.push(`
  <url>
    <loc>${loc}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
    }

    // Dynamic Course Pages
    for (const course of courses) {
      const slugOrId = course.slug || course._id;
      const lastMod = (course.updatedAt || course.createdAt || new Date()).toISOString().split("T")[0];
      xmlUrls.push(`
  <url>
    <loc>${BASE_URL}/courses/${slugOrId}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
    }

    // Dynamic Events / Workshops
    for (const event of events) {
      const lastMod = (event.updatedAt || event.createdAt || new Date()).toISOString().split("T")[0];
      xmlUrls.push(`
  <url>
    <loc>${BASE_URL}/events</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.join("")}
</urlset>`;

    cachedSitemap = sitemapXml;
    lastCacheTime = now;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.header("Cache-Control", "public, max-age=3600");
    return res.send(sitemapXml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return res.status(500).send("Error generating sitemap");
  }
});

router.get("/robots.txt", (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow private user portals, auth redirects, and admin areas
Disallow: /admin
Disallow: /admin/
Disallow: /user/
Disallow: /auth/
Disallow: /login
Disallow: /courses/*/fee

# Sitemap Index
Sitemap: ${BASE_URL}/sitemap.xml
`;
  res.header("Content-Type", "text/plain; charset=utf-8");
  res.header("Cache-Control", "public, max-age=86400");
  return res.send(robotsTxt);
});

module.exports = router;
