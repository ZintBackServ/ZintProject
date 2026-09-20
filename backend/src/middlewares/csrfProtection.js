const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function normaliseOrigin(value) {
  if (!value) return null;
  try {
    return new URL(String(value).trim()).origin;
  } catch {
    return null;
  }
}

// Cookie-authenticated, state-changing requests must originate from a configured
// frontend. CORS controls whether a response is readable; it does not stop a
// cross-site form submission, so it is not CSRF protection by itself.
function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method) || !req.cookies?.token) return next();

  const origin = normaliseOrigin(req.get("origin"));
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.frontendurl,
    process.env.frontendurl2,
  ].map(normaliseOrigin).filter(Boolean);

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Cross-site request blocked.",
    });
  }

  next();
}

module.exports = csrfProtection;
