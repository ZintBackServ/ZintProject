function frontendBaseUrl() {
  const raw = process.env.FRONTEND_URL || process.env.frontendurl || "http://localhost:5174";
  return String(raw)
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/+$/, "");
}

function frontendPath(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${frontendBaseUrl()}${normalized}`;
}

function isLocalFrontend() {
  return /localhost|127\.0\.0\.1/i.test(frontendBaseUrl());
}

module.exports = { frontendBaseUrl, frontendPath, isLocalFrontend };
