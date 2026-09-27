const zlib = require("zlib");

const COMPRESSIBLE_TYPES = [
  "application/json",
  "text/html",
  "text/plain",
  "text/css",
  "application/javascript",
  "text/javascript",
  "image/svg+xml",
];

/**
 * Native Node.js HTTP compression middleware (supports Brotli, Gzip, Deflate)
 * Zero external dependencies.
 */
const compressionMiddleware = (req, res, next) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";

  // If client doesn't accept compression or is an SSE / raw stream request, skip
  if (!acceptEncoding || req.headers["x-no-compression"]) {
    return next();
  }

  let selectedEncoding = null;
  if (/\bbr\b/.test(acceptEncoding) && typeof zlib.createBrotliCompress === "function") {
    selectedEncoding = "br";
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    selectedEncoding = "gzip";
  } else if (/\bdeflate\b/.test(acceptEncoding)) {
    selectedEncoding = "deflate";
  }

  if (!selectedEncoding) {
    return next();
  }

  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  res.send = function (body) {
    if (res.headersSent) {
      return originalSend(body);
    }

    // Determine content type
    let contentType = res.getHeader("content-type") || "";
    if (typeof body === "object" && body !== null && !Buffer.isBuffer(body)) {
      body = JSON.stringify(body);
      if (!contentType) {
        contentType = "application/json; charset=utf-8";
        res.setHeader("Content-Type", contentType);
      }
    }

    const isCompressible = COMPRESSIBLE_TYPES.some((type) =>
      contentType.toLowerCase().includes(type)
    );

    if (!isCompressible) {
      return originalSend(body);
    }

    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body || "", "utf8");

    // Only compress responses >= 1 KB (1024 bytes)
    if (buffer.length < 1024) {
      return originalSend(body);
    }

    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Content-Encoding", selectedEncoding);
    res.removeHeader("Content-Length");

    const compressCallback = (err, compressed) => {
      if (err) {
        // Fallback to uncompressed on error
        res.removeHeader("Content-Encoding");
        return originalSend(buffer);
      }
      res.setHeader("Content-Length", compressed.length);
      return originalSend(compressed);
    };

    if (selectedEncoding === "br") {
      zlib.brotliCompress(buffer, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // Fast balance for real-time web responses
        },
      }, compressCallback);
    } else if (selectedEncoding === "gzip") {
      zlib.gzip(buffer, { level: 6 }, compressCallback);
    } else if (selectedEncoding === "deflate") {
      zlib.deflate(buffer, { level: 6 }, compressCallback);
    } else {
      return originalSend(body);
    }
  };

  res.json = function (obj) {
    if (res.headersSent) {
      return originalJson(obj);
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(JSON.stringify(obj));
  };

  next();
};

module.exports = compressionMiddleware;
